"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { site } from "@/lib/site";

const API_URL = "https://dashboard-mg.vercel.app/api/devis";
// Délai de garde PAR TENTATIVE : au-delà, on abandonne le fetch et on réessaie.
// Sans ça, un endpoint qui « pend » laisserait le bouton bloqué sur « Envoi… ».
const TIMEOUT_MS = 10_000;

const TYPES = [
  "Film corporate",
  "Événement / captation",
  "Mariage",
  "Publicité / réseaux",
  "Autre",
] as const;

type Status = "idle" | "sending" | "success" | "error";

// "aborted" = le composant a été démonté pendant l'envoi : on ne touche plus
// à l'état. À ne PAS confondre avec un abandon dû au délai de garde, qui est
// traité comme un échec réseau (donc réessayé, puis état "error").
type PostResult = "ok" | "failed" | "aborted";

const fieldClass = "field";
const labelClass = "t-legend mb-1 flex items-center gap-1";

// POST avec réessais : 2 tentatives supplémentaires sur erreur réseau, délai
// de garde dépassé ou 5xx ; aucune sur 4xx. Renvoie "ok" si l'API répond
// 200 { ok: true }. `external` permet d'interrompre proprement au démontage.
async function postDevis(
  payload: unknown,
  external: AbortSignal,
): Promise<PostResult> {
  const maxRetries = 2;
  for (let attempt = 0; ; attempt++) {
    // Démontage survenu pendant l'attente entre deux tentatives.
    if (external.aborted) return "aborted";

    const ctrl = new AbortController();
    // Le démontage annule aussi la tentative en cours.
    const relayAbort = () => ctrl.abort();
    external.addEventListener("abort", relayAbort, { once: true });
    // Marqueur qui distingue « trop lent » de « composant démonté ».
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      ctrl.abort();
    }, TIMEOUT_MS);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      // On valide le contrat de l'API : succès = HTTP 200 avec { ok: true }.
      // Un 200 sans ce corps ne doit PAS être compté comme un succès.
      const body = await res.json().catch(() => null);
      if (res.ok) return body?.ok === true ? "ok" : "failed";
      // 4xx : erreur définitive, on n'insiste pas.
      if (res.status >= 400 && res.status < 500) return "failed";
      // 5xx : on relance (via le catch).
      throw new Error(`server_${res.status}`);
    } catch {
      // Abandon dû au démontage (et pas au délai de garde) : on sort sans
      // réessayer et sans rien mettre à jour côté UI.
      if (external.aborted && !timedOut) return "aborted";
      if (attempt >= maxRetries) return "failed";
    } finally {
      // Nettoyage systématique du timer et de l'écouteur, quel que soit
      // le chemin de sortie (succès, échec, retour anticipé).
      clearTimeout(timer);
      external.removeEventListener("abort", relayAbort);
    }

    // Petite pause croissante avant le réessai.
    await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
  }
}

export function DevisForm() {
  const [client, setClient] = useState("");
  const [type, setType] = useState("");
  const [projet, setProjet] = useState("");
  const [echeance, setEcheance] = useState("");
  const [budget, setBudget] = useState("");
  const [contact, setContact] = useState("");
  // Piège à robots : champ invisible pour un humain. S'il est rempli, on
  // simule un succès sans jamais poster (ne rien apprendre au bot).
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [touched, setTouched] = useState(false);

  // Champs référencés pour porter le focus sur la première erreur (a11y).
  const clientRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const projetRef = useRef<HTMLTextAreaElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  // Contrôleur d'annulation lié à la vie du composant (fermeture de la modale).
  const unmountRef = useRef<AbortController | null>(null);
  useEffect(() => {
    const ctrl = new AbortController();
    unmountRef.current = ctrl;
    return () => ctrl.abort();
  }, []);

  function unmountSignal(): AbortSignal {
    let ctrl = unmountRef.current;
    if (!ctrl) {
      ctrl = new AbortController();
      unmountRef.current = ctrl;
    }
    return ctrl.signal;
  }

  const errors = {
    client: !client.trim(),
    type: !type.trim(),
    projet: !projet.trim(),
    contact: !contact.trim(),
  };
  const invalid =
    errors.client || errors.type || errors.projet || errors.contact;

  function reset() {
    setClient("");
    setType("");
    setProjet("");
    setEcheance("");
    setBudget("");
    setContact("");
    setWebsite("");
    setTouched(false);
    setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (invalid) {
      // On force le rendu des messages d'erreur AVANT de déplacer le focus,
      // pour que l'aria-describedby soit en place quand le lecteur d'écran
      // annonce le champ.
      flushSync(() => setTouched(true));
      const first = errors.client
        ? clientRef.current
        : errors.type
          ? typeRef.current
          : errors.projet
            ? projetRef.current
            : contactRef.current;
      first?.focus();
      return;
    }
    setTouched(true);

    // Champ piège rempli → robot. On mime un envoi normal, sans requête.
    if (website.trim()) {
      setStatus("sending");
      await new Promise((r) => setTimeout(r, 700));
      if (unmountSignal().aborted) return;
      setStatus("success");
      return;
    }

    // On ne transmet que les champs non vides, dans l'ordre attendu.
    // Le champ piège n'est jamais envoyé : l'API ne le prévoit pas.
    const data: Record<string, string> = {
      client: client.trim(),
      type: type.trim(),
      projet: projet.trim(),
    };
    if (echeance.trim()) data.echeance = echeance.trim();
    if (budget.trim()) data.budget = budget.trim();
    data.contact = contact.trim();

    setStatus("sending");
    const result = await postDevis(
      {
        data,
        site: typeof window !== "undefined" ? window.location.hostname : "",
      },
      unmountSignal(),
    );
    // Composant démonté entre-temps : plus rien à mettre à jour.
    if (result === "aborted") return;
    setStatus(result === "ok" ? "success" : "error");
  }

  // Écran de confirmation
  if (status === "success") {
    return (
      <div
        className="max-w-[560px] py-4"
        role="status"
        aria-live="polite"
      >
        <p className="t-legend text-[var(--color-terra)]">Demande envoyée</p>
        <h3 className="t-title mt-4">Merci. On revient vers vous très vite.</h3>
        <button type="button" onClick={reset} className="u-draw t-legend mt-10 text-[var(--color-text)]">
          Faire une autre demande
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-[640px] text-left"
    >
      <div className="flex flex-col gap-8">
        {/* Nom / société — pré-remplit le client dans le cockpit */}
        <div>
          <label htmlFor="devis-client" className={labelClass}>
            Votre nom ou société{" "}
            <span className="text-[var(--color-terra)]">*</span>
          </label>
          <input
            id="devis-client"
            ref={clientRef}
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            aria-invalid={touched && errors.client}
            aria-describedby={
              touched && errors.client ? "devis-client-error" : undefined
            }
            placeholder="Prénom Nom, ou raison sociale"
            className={fieldClass}
          />
          {touched && errors.client && (
            <p
              id="devis-client-error"
              className="t-legend mt-2 text-[var(--color-terra)]"
            >
              Champ requis
            </p>
          )}
        </div>

        {/* Type de projet */}
        <div>
          <label htmlFor="devis-type" className={labelClass}>
            Type de projet <span className="text-[var(--color-terra)]">*</span>
          </label>
          <div className="relative">
            <select
              id="devis-type"
              ref={typeRef}
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-invalid={touched && errors.type}
              aria-describedby={
                touched && errors.type ? "devis-type-error" : undefined
              }
              className={`${fieldClass} appearance-none pr-10 ${type ? "" : "text-[var(--color-text-faint)]"}`}
            >
              <option value="" disabled>
                Choisir…
              </option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]"
            >
              ▾
            </span>
          </div>
          {touched && errors.type && (
            <p
              id="devis-type-error"
              className="t-legend mt-2 text-[var(--color-terra)]"
            >
              Champ requis
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="devis-projet" className={labelClass}>
            Décrivez votre projet{" "}
            <span className="text-[var(--color-terra)]">*</span>
          </label>
          <textarea
            id="devis-projet"
            ref={projetRef}
            value={projet}
            onChange={(e) => setProjet(e.target.value)}
            rows={5}
            aria-invalid={touched && errors.projet}
            aria-describedby={
              touched && errors.projet ? "devis-projet-error" : undefined
            }
            placeholder="Contexte, objectif, format, lieu…"
            className={`${fieldClass} resize-y`}
          />
          {touched && errors.projet && (
            <p
              id="devis-projet-error"
              className="t-legend mt-2 text-[var(--color-terra)]"
            >
              Champ requis
            </p>
          )}
        </div>

        {/* Échéance + budget */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor="devis-echeance" className={labelClass}>
              Échéance souhaitée
            </label>
            <input
              id="devis-echeance"
              type="text"
              value={echeance}
              onChange={(e) => setEcheance(e.target.value)}
              placeholder="Ex. septembre 2026"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="devis-budget" className={labelClass}>
              Budget indicatif
            </label>
            <input
              id="devis-budget"
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Ex. 2 000 – 5 000 €"
              className={fieldClass}
            />
          </div>
        </div>

        {/* Contact */}
        <div>
          <label htmlFor="devis-contact" className={labelClass}>
            Comment vous recontacter&nbsp;?{" "}
            <span className="text-[var(--color-terra)]">*</span>
          </label>
          <input
            id="devis-contact"
            ref={contactRef}
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            aria-invalid={touched && errors.contact}
            aria-describedby={
              touched && errors.contact ? "devis-contact-error" : undefined
            }
            placeholder="E-mail ou téléphone"
            className={fieldClass}
          />
          {touched && errors.contact && (
            <p
              id="devis-contact-error"
              className="t-legend mt-2 text-[var(--color-terra)]"
            >
              Champ requis
            </p>
          )}
        </div>

        {/* Champ piège (honeypot) — sorti de l'écran plutôt que display:none,
            pour rester « remplissable » par un robot et invisible pour un
            humain : hors flux, non focusable, hors lecteurs d'écran. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden"
        >
          <label htmlFor="devis-website">Ne pas remplir ce champ</label>
          <input
            id="devis-website"
            name="website"
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Envoi */}
        <div className="mt-4 flex flex-col items-start gap-5">
          <button
            type="submit"
            disabled={sending}
            className="t-legend inline-flex items-center gap-4 bg-[var(--color-text)] px-6 py-4 text-[var(--color-paper)] transition-colors duration-500 hover:bg-[var(--color-terra)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending
              ? "Envoi…"
              : status === "error"
                ? "Réessayer"
                : "Demander un devis"}
          </button>
          {status === "error" && (
            <div role="alert" aria-live="assertive">
              <p className="t-legend text-[var(--color-terra)]">
                L&apos;envoi a échoué. Réessayez dans un instant.
              </p>
              {/* Repli : on ne perd pas le contact si l'API reste muette. */}
              <p className="t-body mt-2 text-[15px]">
                Ou écrivez-nous directement&nbsp;:{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="u-draw text-[var(--color-text)] [overflow-wrap:anywhere]"
                >
                  {site.email}
                </a>{" "}
                ·{" "}
                <a
                  href={`tel:${site.phoneHref}`}
                  className="u-draw whitespace-nowrap text-[var(--color-text)]"
                >
                  {site.phone}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

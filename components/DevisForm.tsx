"use client";

import { useState } from "react";

const API_URL = "https://dashboard-mg.vercel.app/api/devis";

const TYPES = [
  "Film corporate",
  "Événement / captation",
  "Mariage",
  "Publicité / réseaux",
  "Autre",
] as const;

type Status = "idle" | "sending" | "success" | "error";

const fieldClass =
  "w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-ink-2)] px-4 py-3 font-sans text-[15px] text-[var(--color-bone)] placeholder:text-[var(--color-bone-faint)] outline-none transition-colors duration-300 focus:border-[var(--color-terra)]";
const labelClass =
  "font-cond mb-2 flex items-center gap-1 text-[11px] tracking-[0.18em] text-[var(--color-bone-dim)]";

// POST avec réessais : 2 tentatives supplémentaires sur erreur réseau ou 5xx,
// aucune sur 4xx. Renvoie true si l'API répond 200 { ok: true }.
async function postDevis(payload: unknown): Promise<boolean> {
  const maxRetries = 2;
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return true;
      // 4xx : erreur définitive, on n'insiste pas.
      if (res.status >= 400 && res.status < 500) return false;
      // 5xx : on relance (via le catch).
      throw new Error(`server_${res.status}`);
    } catch {
      if (attempt >= maxRetries) return false;
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
    }
  }
}

export function DevisForm() {
  const [client, setClient] = useState("");
  const [type, setType] = useState("");
  const [projet, setProjet] = useState("");
  const [echeance, setEcheance] = useState("");
  const [budget, setBudget] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [touched, setTouched] = useState(false);

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
    setTouched(false);
    setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (invalid) return;

    // On ne transmet que les champs non vides, dans l'ordre attendu.
    const data: Record<string, string> = {
      client: client.trim(),
      type: type.trim(),
      projet: projet.trim(),
    };
    if (echeance.trim()) data.echeance = echeance.trim();
    if (budget.trim()) data.budget = budget.trim();
    data.contact = contact.trim();

    setStatus("sending");
    const ok = await postDevis({
      data,
      site: typeof window !== "undefined" ? window.location.hostname : "",
    });
    setStatus(ok ? "success" : "error");
  }

  // Écran de confirmation
  if (status === "success") {
    return (
      <div
        className="mx-auto max-w-[560px] px-2 py-8 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="font-wide text-5xl leading-none text-[var(--color-terra)]">
          ✓
        </span>
        <h3 className="font-wide mt-5 text-[clamp(1.6rem,4vw,2.4rem)] text-[var(--color-cream)]">
          Demande envoyée. Merci&nbsp;!
        </h3>
        <p className="font-sans mx-auto mt-3 max-w-[38ch] text-sm leading-relaxed text-[var(--color-bone-dim)]">
          On revient vers vous très vite pour en parler.
        </p>
        <button
          type="button"
          onClick={reset}
          className="font-cond mt-8 rounded-full border border-[var(--color-line)] px-7 py-3 text-sm text-[var(--color-bone)] transition-colors duration-300 hover:border-[var(--color-terra)] hover:text-[var(--color-terra)]"
        >
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
      className="mx-auto max-w-[560px] text-left"
    >
      <div className="flex flex-col gap-6">
        {/* Nom / société — pré-remplit le client dans le cockpit */}
        <div>
          <label htmlFor="devis-client" className={labelClass}>
            Votre nom ou société{" "}
            <span className="text-[var(--color-terra)]">*</span>
          </label>
          <input
            id="devis-client"
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            aria-invalid={touched && errors.client}
            placeholder="Prénom Nom, ou raison sociale"
            className={fieldClass}
          />
          {touched && errors.client && (
            <p className="font-cond mt-2 text-[11px] tracking-[0.1em] text-[var(--color-terra)]">
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
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-invalid={touched && errors.type}
              className={`${fieldClass} appearance-none pr-10 ${type ? "" : "text-[var(--color-bone-faint)]"}`}
            >
              <option value="" disabled>
                Choisir…
              </option>
              {TYPES.map((t) => (
                <option key={t} value={t} className="text-[var(--color-ink)]">
                  {t}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-terra)]"
            >
              ▾
            </span>
          </div>
          {touched && errors.type && (
            <p className="font-cond mt-2 text-[11px] tracking-[0.1em] text-[var(--color-terra)]">
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
            value={projet}
            onChange={(e) => setProjet(e.target.value)}
            rows={5}
            aria-invalid={touched && errors.projet}
            placeholder="Contexte, objectif, format, lieu…"
            className={`${fieldClass} resize-y`}
          />
          {touched && errors.projet && (
            <p className="font-cond mt-2 text-[11px] tracking-[0.1em] text-[var(--color-terra)]">
              Champ requis
            </p>
          )}
        </div>

        {/* Échéance + budget */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            aria-invalid={touched && errors.contact}
            placeholder="E-mail ou téléphone"
            className={fieldClass}
          />
          {touched && errors.contact && (
            <p className="font-cond mt-2 text-[11px] tracking-[0.1em] text-[var(--color-terra)]">
              Champ requis
            </p>
          )}
        </div>

        {/* Envoi */}
        <div className="mt-2 flex flex-col items-center gap-4">
          <button
            type="submit"
            disabled={sending}
            className="btn-cta font-cond w-full rounded-full bg-[var(--color-terra)] px-9 py-4 text-sm text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {sending ? "Envoi…" : "Demander un devis"}
          </button>
          {status === "error" && (
            <p
              className="font-cond text-center text-[12px] tracking-[0.08em] text-[var(--color-terra)]"
              role="alert"
              aria-live="assertive"
            >
              L&apos;envoi a échoué, réessayez dans un instant.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

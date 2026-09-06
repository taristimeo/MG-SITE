"use client";

// Le contact : le montage du visiteur part avec le message. L'EDL est
// jointe au brief envoyé au tableau de bord du studio, avec un lien qui
// rejoue le montage sur le site.
import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, edlText, encodeClips, films, pad, plural, rushes, short, total } from "@/lib/montage";
import { site } from "@/lib/site";
import { useMontage } from "./store";

const API_URL = "https://dashboard-mg.vercel.app/api/devis";
const TIMEOUT_MS = 10_000;

type Status = "idle" | "sending" | "success" | "error";

async function post(payload: unknown): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) { const j = (await res.json().catch(() => ({}))) as { ok?: boolean }; if (j.ok !== false) return true; }
      if (res.status >= 400 && res.status < 500) return false;
    } catch {
      clearTimeout(timer);
    }
    await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
  }
  return false;
}

export function Contact() {
  const { state } = useMontage();
  const { clips } = state;
  const [nom, setNom] = useState("");
  const [societe, setSociete] = useState("");
  const [metier, setMetier] = useState<string>("Corporate");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // pot de miel
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [fold, setFold] = useState(false);

  const edl = edlText(clips);
  const lien = clips.length ? `${site.url}/?m=${encodeClips(clips)}` : "";
  const errors = { nom: !nom.trim(), email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), message: !message.trim() };
  const invalid = errors.nom || errors.email || errors.message;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (invalid) return;
    setStatus("sending");
    if (website.trim()) { await new Promise((r) => setTimeout(r, 600)); setStatus("success"); return; }
    const projet = [message.trim(), "", clips.length ? `--- MONTAGE JOINT (${plural(clips.length, "plan")}, ${short(total(clips))}) ---` : "--- Aucun montage joint ---", clips.length ? edl : "", lien ? `Rejouer : ${lien}` : ""].filter(Boolean).join("\n");
    const ok = await post({
      data: { client: societe.trim() ? `${nom.trim()} — ${societe.trim()}` : nom.trim(), type: metier, projet, contact: email.trim() },
      site: window.location.hostname,
    });
    setStatus(ok ? "success" : "error");
  }

  return (
    <section className="contact" aria-label="Contact">
      <div className="bande-m">
        <div className="bh cond">
          <span><b>Votre montage</b></span>
          <span>— {plural(clips.length, "plan")} — {short(total(clips))}</span>
          <span className="desk">Sera joint à votre demande</span>
          <Link className="edit" href="/">Retoucher le montage</Link>
        </div>
        <div className={`strip${clips.length ? "" : " vide"}`} aria-label="Plans du montage">
          {clips.length ? clips.map((c, i) => (
            <span key={`${i}-${c.r}`} style={{ width: Math.max(48, c.d * 22), backgroundImage: `url(${rushes[c.r].poster})` }} title={films[rushes[c.r].film].title}><em>{pad(i + 1)}</em><i>{c.d.toFixed(1)}s</i></span>
          )) : <span className="cond" style={{ border: 0, width: "auto" }}>Aucun plan — votre demande partira sans montage</span>}
        </div>
      </div>
      <div className="cgrid">
        <form className="cform" onSubmit={submit} noValidate>
          <h2 className="wide">Racontez-nous ce que vous avez en tête.</h2>
          <p className="lead">Votre montage part avec le message : le réalisateur reçoit un brief qui est déjà une référence filmée, avec vos plans et leurs durées.</p>
          {status === "success" ? (
            <div className="sent wide" role="status">Reçu. Votre montage est sur la table — on vous rappelle sous 48 h.</div>
          ) : (
            <>
              <div className="fields">
                <div className={`field${touched && errors.nom ? " err" : ""}`}><label className="cond" htmlFor="c-nom">Nom</label><input id="c-nom" name="nom" autoComplete="name" placeholder="Camille Durand" value={nom} onChange={(e) => setNom(e.target.value)} required />{touched && errors.nom ? <span className="msg">Votre nom, pour qu&apos;on sache à qui répondre.</span> : null}</div>
                <div className="field"><label className="cond" htmlFor="c-soc">Société</label><input id="c-soc" name="societe" autoComplete="organization" placeholder="Domaine, agence, collectivité…" value={societe} onChange={(e) => setSociete(e.target.value)} /></div>
                <div className="field"><label className="cond" htmlFor="c-met">Métier</label>
                  <select id="c-met" name="metier" value={metier} onChange={(e) => setMetier(e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className={`field${touched && errors.email ? " err" : ""}`}><label className="cond" htmlFor="c-mail">E-mail</label><input id="c-mail" name="email" type="email" autoComplete="email" placeholder="vous@exemple.fr" value={email} onChange={(e) => setEmail(e.target.value)} required />{touched && errors.email ? <span className="msg">Une adresse valide, pour la réponse.</span> : null}</div>
                <div className={`field full${touched && errors.message ? " err" : ""}`}><label className="cond" htmlFor="c-msg">Message</label><textarea id="c-msg" name="message" rows={3} placeholder="Le projet, le lieu, la période envisagée…" value={message} onChange={(e) => setMessage(e.target.value)} required />{touched && errors.message ? <span className="msg">Deux lignes suffisent : le projet, le lieu, la période.</span> : null}</div>
                <div className="field" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }} aria-hidden="true"><label htmlFor="c-web">Site web</label><input id="c-web" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></div>
                <textarea className="sr" name="montage" readOnly aria-label="Montage joint" value={edl} />
              </div>
              <div className="actions">
                <button className="btn terra cond" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Envoi…" : "Envoyer avec ma demande"}
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M1 7h11M8 3l4 4-4 4" /></svg>
                </button>
                <small className="cond">Réponse sous 48 h · <a href={`mailto:${site.email}`}>{site.email}</a> · <a href={`tel:${site.phoneHref}`}>{site.phone}</a></small>
              </div>
              {status === "error" ? <p className="errbox" role="alert">L&apos;envoi n&apos;est pas passé. Écrivez-nous directement à <a href={`mailto:${site.email}?subject=Montage&body=${encodeURIComponent(`${message}\n\n${edl}\n${lien}`)}`}>{site.email}</a> : le montage sera dans le mail.</p> : null}
            </>
          )}
        </form>
        <aside className={`edl${fold ? " open" : ""}`}>
          <div className="eh cond"><span>Pièce jointe · EDL</span><span>montage-v01.txt</span></div>
          <button className="fold cond" type="button" aria-expanded={fold} onClick={() => setFold(!fold)}>{fold ? "Replier la pièce jointe" : "Voir la pièce jointe"}</button>
          <pre>{edl}</pre>
          <p className="cond coord">
            Mauvais Grain · {site.street}<br />{site.postalCode} {site.city}<br />
            {site.socials.map((s, i) => <span key={s.label}>{i ? " · " : ""}<a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></span>)}
          </p>
        </aside>
      </div>
    </section>
  );
}

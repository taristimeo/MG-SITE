"use client";

// Le chutier complet : six bandes de rushes, un film déplié avec son
// approche. Sur téléphone, le détail se déplie sous la bande ouverte.
import Link from "next/link";
import { useState } from "react";
import { RUSHES_PER_FILM, films, pad, plural, rushes } from "@/lib/montage";
import { useIsMobile, useMontage } from "./store";

export function Films() {
  const { state, addClip, takeHand } = useMontage();
  const mobile = useIsMobile();
  const [open, setOpen] = useState(0);
  const f = films[open];
  const fr = rushes.filter((r) => r.film === open);
  const added = fr.every((r) => state.clips.some((c) => c.r === r.i));
  const addFilm = () => { takeHand(); fr.forEach((r, k) => setTimeout(() => addClip(r.i), k * 120)); };

  const detail = (
    <div className="fdetail">
      <div className="bande">
        {fr.map((r) => <span key={r.i} style={{ backgroundImage: `url(${r.poster})` }}><i>{r.code}</i></span>)}
      </div>
      <div className="meta cond">
        <span>Client <b>{f.client}</b></span>
        <span>Catégorie <b>{f.category}</b></span>
        <span>Année <b>{f.year}</b></span>
        <span>{RUSHES_PER_FILM} rushes · {fr.reduce((a, r) => a + r.nat, 0).toFixed(1)}s</span>
      </div>
      <div className="body">
        <h2 className="wide">{f.title}</h2>
        <p className="app"><strong>L&apos;approche</strong>{f.approach}</p>
        <button type="button" className={`btn cond${added ? " done" : ""}`} onClick={addFilm} disabled={added}>
          {added ? "Rushes déjà sur la timeline" : "Ajouter ces rushes au montage"}
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M7 1v12M1 7h12" /></svg>
        </button>
        <div className="links cond">
          <Link href={`/realisations/${f.slug}`}>Voir le film entier</Link>
          <Link href="/contact">Envoyer mon montage</Link>
        </div>
      </div>
    </div>
  );

  return (
    <section className="films" aria-label="Films">
      <div className="flist">
        <div className="fh cond"><span><b>Chutier complet</b> · {films.length} films · {rushes.length} rushes</span><span>Ouvrir une bande</span></div>
        <div className="mob-fh cond"><span>Toucher une bande pour la déplier</span><span>{plural(state.clips.length, "plan")} sur la timeline</span></div>
        {films.map((fi, i) => (
          <div key={fi.slug}>
            <button type="button" className={`fband${i === open ? " open" : ""}`} aria-expanded={i === open} onClick={() => setOpen(i)}>
              <span className="no cond">{pad(i + 1)}</span>
              <span><span className="wide t">{fi.title}</span><div className="m cond">{fi.client} · {fi.category} · {fi.year}</div></span>
              <span className="strip">{rushes.filter((r) => r.film === i).map((r) => <span key={r.i} style={{ backgroundImage: `url(${r.poster})` }} />)}</span>
            </button>
            {mobile && i === open ? detail : null}
          </div>
        ))}
      </div>
      {!mobile ? detail : null}
    </section>
  );
}

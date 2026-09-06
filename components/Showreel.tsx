"use client";

// L'accueil des grandes maisons de production : un film à la fois, plein
// écran, et un index numéroté avec sa ligne de progression. Rien d'autre.
// Les extraits jouent en boucle, muets ; la lecture passe au film suivant
// quand l'extrait se termine.
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { projectPreview, projectThumb, projects, type Project } from "@/lib/site";

const HOLD_MS = 7000; // durée d'un film quand l'extrait ne peut pas jouer
const FADE_MS = 900;

export function Showreel({ films = projects }: { films?: Project[] }) {
  const [i, setI] = useState(0);
  const [reduced, setReduced] = useState(false);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const bar = useRef<HTMLSpanElement>(null);
  const timer = useRef(0);
  const iRef = useRef(0);
  iRef.current = i;
  const n = films.length;

  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);
  const next = useCallback(() => go(iRef.current + 1), [go]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Lecture du film courant, préchargement du suivant, repli minuté.
  useEffect(() => {
    clearTimeout(timer.current);
    videos.current.forEach((v, k) => {
      if (!v) return;
      if (k === i) {
        v.currentTime = 0;
        if (!reduced) v.play().catch(() => {});
      } else {
        v.pause();
        if (k === (i + 1) % n && v.preload === "none") v.preload = "auto";
      }
    });
    if (!reduced) timer.current = window.setTimeout(next, HOLD_MS + 500);
    return () => clearTimeout(timer.current);
  }, [i, n, next, reduced]);

  // Ligne de progression : suit l'extrait s'il joue, le minuteur sinon.
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      const v = videos.current[i];
      let p = (performance.now() - t0) / (HOLD_MS + 500);
      if (v && v.duration && !v.paused) p = v.currentTime / v.duration;
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, p)})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [i]);

  // Clavier et geste horizontal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(iRef.current + 1);
      if (e.key === "ArrowLeft") go(iRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const f = films[i];

  return (
    <section
      className="showreel"
      aria-roledescription="carrousel"
      aria-label="Les films du studio"
      onPointerDown={(e) => { swipe.current = { x: e.clientX, y: e.clientY }; }}
      onPointerUp={(e) => {
        const s = swipe.current; swipe.current = null;
        if (!s) return;
        const dx = e.clientX - s.x, dy = e.clientY - s.y;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) go(iRef.current + (dx < 0 ? 1 : -1));
      }}
    >
      {films.map((p, k) => {
        const src = projectPreview(p);
        return (
          <div key={p.slug} className={`showreel-slide${k === i ? " is-on" : ""}`} aria-hidden={k !== i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={projectThumb(p)} alt="" className="showreel-poster" loading={k === 0 ? "eager" : "lazy"} />
            {src ? (
              <video
                ref={(el) => { videos.current[k] = el; }}
                className="showreel-video"
                src={src}
                muted
                playsInline
                loop={false}
                preload={k === 0 ? "auto" : "none"}
                poster={projectThumb(p)}
                onEnded={() => { if (k === iRef.current) next(); }}
                onPlaying={(e) => e.currentTarget.classList.add("is-playing")}
              />
            ) : null}
          </div>
        );
      })}
      <div className="showreel-scrim" aria-hidden="true" />

      <button type="button" className="showreel-zone is-prev" onClick={() => go(i - 1)} aria-label="Film précédent" />
      <button type="button" className="showreel-zone is-next" onClick={() => go(i + 1)} aria-label="Film suivant" />

      <div className="showreel-caption">
        <p className="font-cond showreel-meta" aria-live="polite">
          <span className="text-[var(--color-terra)]">{String(i + 1).padStart(2, "0")}</span>
          <span aria-hidden="true"> — </span>
          {f.client} · {f.category} · {f.year}
        </p>
        <h1 className="font-wide showreel-title">
          <Link href={`/realisations/${f.slug}`}>{f.title}</Link>
        </h1>
        <Link href={`/realisations/${f.slug}`} className="font-cond showreel-cta link-underline">Voir le film</Link>
      </div>

      <nav className="showreel-index font-cond" aria-label="Choisir un film">
        {films.map((p, k) => (
          <button key={p.slug} type="button" className={`showreel-num${k === i ? " is-active" : ""}`} onClick={() => go(k)} aria-label={`${String(k + 1).padStart(2, "0")} — ${p.title}`} aria-current={k === i ? "true" : undefined}>
            {String(k + 1).padStart(2, "0")}
            {k === i ? <span className="showreel-bar"><span ref={bar} /></span> : null}
          </button>
        ))}
      </nav>
    </section>
  );
}

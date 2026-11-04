"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/site";
import { projectPreview, projectThumb } from "@/lib/site";
import { FilmCanvas, type FilmHandle } from "./FilmCanvas";

/**
 * LA SCÈNE — six films, un seul cadre.
 *
 * Le défilement ne fait pas défiler : il change de plan. La scène reste
 * collée à l'écran pendant six hauteurs d'écran ; à chaque chapitre, le
 * tirage passe au film suivant par déplacement, l'extrait démarre, le titre
 * géant se repose. Un film à la fois, en grand.
 */
export function Stage({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<FilmHandle>(null);
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const [inStage, setInStage] = useState(false);
  const n = projects.length;

  // Le chapitre courant suit la position dans la section.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const b = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = b.height - vh;
      const p = total > 0 ? Math.min(1, Math.max(0, -b.top / total)) : 0;
      const i = Math.min(n - 1, Math.floor(p * n + 0.0001));
      if (i !== idxRef.current) {
        idxRef.current = i;
        setIdx(i);
      }
      setInStage(b.top < vh && b.bottom > 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n]);

  // Changement de plan : déplacement + extrait du nouveau film.
  const first = useRef(true);
  useEffect(() => {
    const film = filmRef.current;
    const p = projects[idx];
    if (!film || !p) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (first.current) {
      first.current = false;
    } else {
      film.go(projectThumb(p), 1000);
    }
    // Arrêt des autres extraits, lecture de celui-ci.
    videosRef.current.forEach((v, i) => {
      if (!v) return;
      if (i === idx) return;
      v.pause();
    });
    const v = videosRef.current[idx];
    const src = projectPreview(p);
    if (v && src && !reduced && inStage) {
      if (!v.src) v.src = src;
      // On attend la fin du déplacement pour que l'extrait prenne la place.
      const t = setTimeout(() => {
        film.attachVideo(v);
        v.play().catch(() => {});
      }, 700);
      return () => clearTimeout(t);
    }
    film.attachVideo(null);
  }, [idx, projects, inStage]);

  // Hors scène : tout s'arrête.
  useEffect(() => {
    if (!inStage) videosRef.current.forEach((v) => v?.pause());
  }, [inStage]);

  const p = projects[idx];
  const num = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <section ref={rootRef} className="stage" style={{ height: `${n * 100}dvh` }} aria-label="Films">
      <div className="stage-sticky">
        {/* Sur mobile : une colonne centrée (tirage, puis titre). Sur grand
            écran : chaque élément à sa place sur la feuille. */}
        <div className="flex h-full flex-col justify-center gap-7 px-[var(--gutter)] pt-[var(--nav-h)] md:contents">
          {/* Le tirage. */}
          <div className="md:absolute md:right-[var(--gutter)] md:top-1/2 md:w-[58vw] md:-translate-y-1/2 lg:w-[56vw]">
            <Link href={`/realisations/${p.slug}`} aria-label={`Voir le film ${p.title}`} className="block">
              <FilmCanvas
                ref={filmRef}
                src={projectThumb(projects[0])}
                alt={projects[0].title}
                className="aspect-video w-full"
                videoMode="none"
              />
            </Link>
          </div>

          {/* Le titre géant, qui se repose à chaque plan. */}
          <div className="md:absolute md:bottom-[calc(var(--gutter)*0.9)] md:left-[var(--gutter)] md:max-w-[62vw]">
            <div key={p.slug}>
              <p className="stage-legend t-legend mb-3 md:mb-5">
                <span className="inline-block w-[2.6em] text-[var(--color-terra)]">{num(idx)}</span>
                {p.client} · {p.category} · {p.year}
              </p>
              <h2 className="stage-title t-display m-0">
                <Link href={`/realisations/${p.slug}`} className="row-link">
                  {p.title}
                </Link>
              </h2>
            </div>
          </div>
        </div>

        {/* Index, en haut à gauche. */}
        <div className="absolute left-[var(--gutter)] top-[calc(var(--nav-h)+8px)] hidden md:block">
          <ol className="t-legend space-y-[6px]">
            {projects.map((f, i) => (
              <li key={f.slug} className={`transition-opacity duration-500 ${i === idx ? "opacity-100" : "opacity-35"}`}>
                <span className="inline-block w-[2.6em]">{num(i)}</span>
                {f.title}
              </li>
            ))}
          </ol>
        </div>

        {/* Compteur. */}
        <div className="absolute bottom-[calc(var(--gutter)*0.9)] right-[var(--gutter)] hidden md:block">
          <p className="t-legend text-right">
            {num(idx)} <span className="opacity-40">/ {num(n - 1)}</span>
          </p>
          <div className="mt-2 h-px w-[120px] bg-[var(--color-line)]">
            <div
              className="h-px bg-[var(--color-text)] transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${((idx + 1) / n) * 100}%` }}
            />
          </div>
        </div>
        <p className="t-legend absolute bottom-[calc(var(--gutter)*0.9)] right-[var(--gutter)] md:hidden">
          {num(idx)} <span className="opacity-40">/ {num(n - 1)}</span>
        </p>

        {/* Les extraits, hors écran : ils alimentent la texture du tirage. */}
        {projects.map((f, i) => (
          <video
            key={f.slug}
            ref={(el) => {
              videosRef.current[i] = el;
            }}
            muted
            loop
            playsInline
            preload="none"
            className="pointer-events-none absolute h-px w-px opacity-0"
            aria-hidden
            tabIndex={-1}
          />
        ))}
      </div>
    </section>
  );
}

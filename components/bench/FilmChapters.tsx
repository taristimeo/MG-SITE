"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projectPreview, projectThumb, type Project } from "@/lib/site";

/**
 * LA SALLE.
 *
 * On éteint la lumière : les films phares sont projetés plein cadre, un par
 * écran, épinglés le temps qu'on les regarde. Les volets s'ouvrent à l'entrée
 * du chapitre, le texte se pose par-dessus, et l'extrait ne se charge qu'au
 * moment d'être vu.
 */
export function FilmChapters({ films }: { films: Project[] }) {
  return (
    <div data-tone="dark" className="relative">
      {films.map((f, i) => (
        <Chapter key={f.slug} film={f} n={i + 1} />
      ))}
    </div>
  );
}

function Chapter({ film, n }: { film: Project; n: number }) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Deux seuils : un large pour précharger l'extrait, un serré pour ouvrir
    // les volets et lancer la lecture pile au bon moment.
    const pre = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          pre.disconnect();
        }
      },
      { rootMargin: "60% 0px" },
    );
    const cue = new IntersectionObserver(
      ([e]) => {
        setOpen(e.isIntersecting);
        const v = videoRef.current;
        if (!v) return;
        if (e.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      {
        // La section fait plus d'un écran de haut : son taux d'intersection
        // ne dépasse jamais ~0,5. Un seuil bas ouvre les volets dès qu'elle
        // entre dans le champ, au lieu d'attendre le milieu du chapitre.
        threshold: 0.12,
      },
    );

    pre.observe(el);
    cue.observe(el);
    return () => {
      pre.disconnect();
      cue.disconnect();
    };
  }, []);

  return (
    <section
      ref={ref}
      data-chapter={film.category}
      data-chapter-index={String(n + 2).padStart(2, "0")}
      className="relative h-[155svh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className={`relative h-full w-full ${open ? "is-open" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={projectThumb(film)}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
          {load && (
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="metadata"
              poster={projectThumb(film)}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={projectPreview(film)} type="video/mp4" />
            </video>
          )}

          {/* Assombrissement bas — le texte doit rester lisible sur tout plan */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[rgba(7,6,5,0.88)] via-[rgba(7,6,5,0.18)] to-[rgba(7,6,5,0.42)]"
          />

          <div className="gate gate-top" aria-hidden />
          <div className="gate gate-bottom" aria-hidden />

          {/* Numéro de bobine, en haut à gauche */}
          <p className="absolute left-5 top-24 z-[3] font-cond text-[10px] tracking-[0.24em] text-[#e8e4d8]/55 sm:left-10 sm:top-28 sm:text-[11px]">
            Bobine {String(n).padStart(2, "0")} / {film.year}
          </p>

          {/* Le cartouche */}
          <div className="absolute inset-x-0 bottom-0 z-[3] px-5 pb-14 sm:px-10 sm:pb-20">
            <div className="mx-auto max-w-[1400px]">
              <p className="font-cond text-[10px] tracking-[0.24em] text-[var(--color-terra)] sm:text-[11px]">
                {film.category} — {film.client}
              </p>
              <h3 className="font-wide mt-3 text-[clamp(2.1rem,6.5vw,5.4rem)] leading-[0.98] text-[#f2efe6]">
                {film.title}
              </h3>
              <div className="mt-5 flex flex-col gap-5 sm:mt-7 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
                <p className="max-w-[46ch] font-sans text-[0.98rem] leading-[1.7] text-[#e8e4d8]/75 sm:text-[1.05rem]">
                  {film.approach}
                </p>
                <Link
                  href={`/realisations/${film.slug}`}
                  className="font-cond shrink-0 rounded-full border border-[#e8e4d8]/30 px-6 py-3 text-[12px] text-[#f2efe6] transition-colors duration-300 hover:border-[var(--color-terra)] hover:bg-[var(--color-terra)] hover:text-[#14100b]"
                >
                  Voir le film
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

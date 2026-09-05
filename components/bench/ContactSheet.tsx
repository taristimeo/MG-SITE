"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  projectPreview,
  projectStills,
  projectThumb,
  projects,
  type Project,
} from "@/lib/site";

/**
 * LA PLANCHE-CONTACT.
 *
 * L'index des films tiré comme une planche de labo : les vignettes alignées,
 * numérotées, perforées — et le film qu'on regarde se cercle au crayon gras,
 * comme le faisait le tireur pour marquer les prises retenues. Au survol, la
 * vignette s'anime : la planche est vivante.
 */
const CATS = ["Tout", "Tourisme", "Clip", "Événementiel"] as const;

export function ContactSheet() {
  const [cat, setCat] = useState<string>("Tout");

  const shown = useMemo(
    () => (cat === "Tout" ? projects : projects.filter((p) => p.category === cat)),
    [cat],
  );

  return (
    <div>
      {/* Onglets de tri — les intercalaires du classeur */}
      <div className="mb-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-[var(--color-line-soft)] pb-4 sm:mb-12">
        {CATS.map((c) => {
          const n =
            c === "Tout"
              ? projects.length
              : projects.filter((p) => p.category === c).length;
          if (n === 0) return null;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`filter-chip font-cond text-[11px] tracking-[0.18em] transition-colors duration-300 ${
                cat === c
                  ? "is-active text-[var(--color-bone)]"
                  : "text-[var(--color-bone-faint)] hover:text-[var(--color-bone-dim)]"
              }`}
            >
              {c}{" "}
              <span className="text-[var(--color-terra)]">
                {String(n).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <div
        key={cat}
        className="grid-fade grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-14"
      >
        {shown.map((p, i) => (
          <Cell key={p.slug} film={p} n={i + 1} />
        ))}
      </div>
    </div>
  );
}

function Cell({ film, n }: { film: Project; n: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);

  const stills = projectStills(film);
  // Repère de tirage : bobine + numéro de prise, comme une vraie annotation.
  const ref = `MG-${film.year} · ${String(n).padStart(2, "0")}${
    ["A", "B", "C"][n % 3]
  }`;

  return (
    <article>
      <Link
        href={`/realisations/${film.slug}`}
        onMouseEnter={() => {
          setLoad(true);
          const v = videoRef.current;
          if (v) void v.play().catch(() => {});
        }}
        onMouseLeave={() => {
          const v = videoRef.current;
          if (v) {
            v.pause();
            v.currentTime = 0;
          }
        }}
        className="contact-cell group relative block"
      >
        {/* La vignette : perforations + image, dans un bloc qui sert d'ancre
            au cercle de crayon gras (il doit l'entourer, pas la traverser). */}
        <div className="relative">
        <div className="sprocket opacity-40" aria-hidden />

        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-ink-2)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={projectThumb(film)}
            alt={`${film.title} — ${film.category}`}
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
          {load && (
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            >
              <source src={projectPreview(film)} type="video/mp4" />
            </video>
          )}

        </div>

        {/* Le crayon gras : l'ovale se trace AUTOUR de la vignette, comme
            l'annotation d'un tireur sur sa planche — donc hors du cadre, qui
            lui rogne son image. */}
        <svg
          className="grease"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            pathLength={1}
            d="M50 3 C79 3 97 22 97 50 C97 78 79 97 50 97 C21 97 3 78 3 50 C3 22 21 3 50 3 C63 3 76 6 85 13"
            stroke="var(--color-terra)"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>

        <div className="sprocket rotate-180 opacity-40" aria-hidden />
        </div>

        {/* L'annotation sous la vignette */}
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <h2 className="font-wide text-[1.35rem] leading-tight text-[var(--color-bone)] transition-colors duration-300 group-hover:text-[var(--color-terra)] sm:text-[1.5rem]">
            {film.title}
          </h2>
          <span className="font-cond shrink-0 text-[10px] tracking-[0.16em] text-[var(--color-bone-faint)]">
            {ref}
          </span>
        </div>
        <p className="mt-1 font-cond text-[10px] tracking-[0.18em] text-[var(--color-bone-dim)]">
          {film.category} — {film.client} · {stills.length} photogrammes
        </p>
      </Link>
    </article>
  );
}

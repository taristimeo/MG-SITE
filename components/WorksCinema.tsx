"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CardMedia } from "@/components/CardMedia";
import { projects, projectThumb, projectPreview } from "@/lib/site";

// Catalogue immersif : chaque film occupe un écran entier (sa preview vidéo en
// plein cadre, titre en générique bas de cadre) et le scroll s'aimante de film
// en film — l'expérience d'une salle, pas d'une grille. Les filtres restent
// au-dessus ; « proximity » guide sans emprisonner le scroll, et se désactive
// en prefers-reduced-motion (voir globals.css).
export function WorksCinema() {
  const categories = useMemo(
    () => ["Tout", ...Array.from(new Set(projects.map((p) => p.category)))],
    [],
  );
  const [filter, setFilter] = useState("Tout");

  // Aimantation du scroll, active seulement tant que cette page est montée.
  useEffect(() => {
    document.documentElement.classList.add("snap-films");
    return () => document.documentElement.classList.remove("snap-films");
  }, []);

  const visible =
    filter === "Tout"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <div>
      {/* Filtres */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 px-5 pb-16">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            aria-pressed={filter === c}
            className={`filter-chip font-cond text-[11px] tracking-[0.18em] transition-colors duration-300 ${
              filter === c
                ? "is-active text-[var(--color-cream)]"
                : "text-[var(--color-bone-faint)] hover:text-[var(--color-bone)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Salles — un film par écran */}
      <div key={filter} className="grid-fade">
        {visible.map((p, i) => (
          <Link
            key={p.slug}
            href={`/realisations/${p.slug}`}
            className="snap-panel group relative block h-svh w-full overflow-hidden"
          >
            {/* Image / preview plein cadre */}
            <div className="absolute inset-0 transition-transform duration-[1.6s] ease-out group-hover:scale-[1.03]">
              <CardMedia
                src={projectThumb(p)}
                videoSrc={projectPreview(p)}
                alt={`${p.title} — ${p.category} · film Mauvais Grain, studio vidéo à Bordeaux`}
              />
            </div>

            {/* Voiles : lisibilité du générique sans éteindre l'image */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-[rgba(10,9,8,0.55)] via-transparent to-transparent"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[rgba(10,9,8,0.92)] via-[rgba(10,9,8,0.18)] to-transparent"
            />

            {/* Générique bas de cadre */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 pb-10 sm:p-12 sm:pb-14">
              <div>
                <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-terra)]">
                  {String(i + 1).padStart(2, "0")}
                  <span className="text-[var(--color-bone-faint)]">
                    {" "}
                    / {String(visible.length).padStart(2, "0")}
                  </span>
                </p>
                <h2 className="font-wide mt-3 max-w-[14ch] text-[clamp(2.2rem,7vw,6.5rem)] leading-[0.95] text-[var(--color-cream)]">
                  {p.title}
                </h2>
                <p className="font-cond mt-4 text-[11px] tracking-[0.22em] text-[var(--color-bone-dim)]">
                  {p.category} · {p.year}
                </p>
              </div>
              <p className="hidden shrink-0 pb-2 font-cond text-[11px] tracking-[0.2em] text-[var(--color-bone-dim)] transition-colors duration-300 group-hover:text-[var(--color-terra)] sm:block">
                Voir le film <span aria-hidden>→</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

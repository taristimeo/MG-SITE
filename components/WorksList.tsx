"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PlayBadge } from "@/components/Poster";
import { CardMedia } from "@/components/CardMedia";
import { CardCursor } from "@/components/CardCursor";
import { projects, projectThumb, projectPreview } from "@/lib/site";

// Réalisations : filtres par catégorie + grille de cartes (comme l'accueil).
export function WorksList() {
  const categories = useMemo(
    () => ["Tout", ...Array.from(new Set(projects.map((p) => p.category)))],
    [],
  );
  const [filter, setFilter] = useState("Tout");

  const visible =
    filter === "Tout"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <div>
      {/* Filtres par catégorie : soulignement terracotta qui se trace */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
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

      {/* Grille de cartes — remontée en fondu à chaque changement de filtre */}
      <CardCursor
        key={filter}
        className="grid-fade mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((p) => (
          <Link
            key={p.slug}
            href={`/realisations/${p.slug}`}
            data-card
            className="group block"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--color-ink-2)]">
              <div className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-105">
                <CardMedia
                  src={projectThumb(p)}
                  videoSrc={projectPreview(p)}
                  alt={`${p.title} — ${p.category} · film Mauvais Grain, studio vidéo à Bordeaux`}
                />
              </div>
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="card-play-badge absolute inset-0 flex items-center justify-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <PlayBadge />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between px-1 pb-2">
              <span className="font-cond text-base text-[var(--color-bone)] transition-colors group-hover:text-[var(--color-terra)]">
                {p.title}
              </span>
              <span className="font-cond text-xs text-[var(--color-bone-faint)]">
                {p.category}
              </span>
            </div>
          </Link>
        ))}
      </CardCursor>
    </div>
  );
}

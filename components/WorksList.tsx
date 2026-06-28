"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PlayBadge } from "@/components/Poster";
import { CardMedia } from "@/components/CardMedia";
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
      {/* Filtres par catégorie (centrés) */}
      <div className="flex flex-wrap justify-center gap-x-7 gap-y-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`font-cond text-xs transition-colors ${
              filter === c
                ? "text-[var(--color-terra)]"
                : "text-[var(--color-bone-faint)] hover:text-[var(--color-bone)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grille de cartes */}
      <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <Link
            key={p.slug}
            href={`/realisations/${p.slug}`}
            className="group block"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--color-ink-2)]">
              <div className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-105">
                <CardMedia
                  src={projectThumb(p)}
                  videoSrc={projectPreview(p)}
                  alt={`${p.title} — ${p.category}`}
                />
              </div>
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
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
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CardCursor } from "@/components/CardCursor";
import { CardMedia } from "@/components/CardMedia";
import { DevisModal } from "@/components/DevisModal";
import { Parallax } from "@/components/Parallax";
import { Reveal } from "@/components/Reveal";
import { projects, projectThumb, projectPreview } from "@/lib/site";
import type { Project } from "@/lib/site";

// « La colonne montée » — mosaïque éditoriale en deux colonnes décalées.
// Les films filtrés sont alternés gauche/droite (0→G, 1→D, 2→G…) et chaque
// colonne alterne un format large (16/10) et un format portrait (4/5) poussé
// vers le bord extérieur. La colonne droite démarre plus bas et glisse un peu
// plus vite (Parallax différentiel) — de la profondeur, pas de scrolljack.
// Cartouche toujours SOUS le média, jamais en overlay.

const EASE_EXPO = "ease-[cubic-bezier(0.16,1,0.3,1)]";

type Entry = { project: Project; index: number };

// Une carte : un seul <Link> (data-card → curseur « VOIR » via CardCursor),
// média puis cartouche. Le hover est porté par `group` : zoom très lent du
// média (CardMedia lance la preview mp4), titre qui glisse, numéro qui passe
// du terracotta au crème. Aucun gradient overlay.
function MosaicCard({
  project: p,
  index,
  total,
  format,
  className = "",
}: {
  project: Project;
  index: number;
  total: number;
  format: "wide" | "tall";
  className?: string;
}) {
  return (
    <Link
      href={`/realisations/${p.slug}`}
      data-card
      className={`group block ${className}`}
    >
      <div
        className={`overflow-hidden ${
          format === "wide" ? "aspect-[16/10]" : "aspect-[4/5]"
        }`}
      >
        <CardMedia
          src={projectThumb(p)}
          videoSrc={projectPreview(p)}
          alt={`${p.title} — ${p.category} · film Mauvais Grain, studio vidéo à Bordeaux`}
          className={`transition-transform duration-[1200ms] ${EASE_EXPO} group-hover:scale-[1.03]`}
        />
      </div>

      {/* Cartouche sous le média */}
      <div className="mt-6">
        <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-terra)] transition-colors duration-500 group-hover:text-[var(--color-cream)]">
          {String(index + 1).padStart(2, "0")} —{" "}
          {String(total).padStart(2, "0")}
        </p>
        <h2
          className={`font-wide mt-4 text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.05] text-[var(--color-cream)] transition-transform duration-500 ${EASE_EXPO} group-hover:translate-x-[6px]`}
        >
          {p.title}
        </h2>
        <p className="font-cond mt-3 text-[11px] tracking-[0.2em] text-[var(--color-bone-faint)]">
          {p.category} · {p.year}
        </p>
      </div>
    </Link>
  );
}

export function WorksMosaic() {
  const categories = useMemo(
    () => ["Tout", ...Array.from(new Set(projects.map((p) => p.category)))],
    [],
  );
  const [filter, setFilter] = useState("Tout");

  const visible =
    filter === "Tout"
      ? projects
      : projects.filter((p) => p.category === filter);
  const total = visible.length;

  // Répartition desktop : indices pairs → colonne gauche, impairs → droite.
  // On garde l'index dans la sélection pour la numérotation (01 — 0n).
  const entries: Entry[] = visible.map((project, index) => ({ project, index }));
  const leftCol = entries.filter((_, i) => i % 2 === 0);
  const rightCol = entries.filter((_, i) => i % 2 === 1);

  return (
    <section className="px-5 pb-24 sm:px-8 sm:pb-32">
      <div className="mx-auto max-w-[1400px]">
        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 pb-12">
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

        <CardCursor>
          {/* Re-key au changement de filtre : la mosaïque refond en entier */}
          <div key={filter} className="grid-fade">
            {/* Mobile : une colonne, zigzag 16/10 puis 4/5 à 86 % */}
            <div className="flex flex-col gap-y-[4.5rem] lg:hidden">
              {entries.map(({ project, index }) => {
                const tall = index % 2 === 1;
                const tallPos = (index - 1) / 2;
                return (
                  <Reveal key={project.slug}>
                    <MosaicCard
                      project={project}
                      index={index}
                      total={total}
                      format={tall ? "tall" : "wide"}
                      className={
                        tall
                          ? tallPos % 2 === 0
                            ? "w-[86%]"
                            : "ml-auto w-[86%]"
                          : "w-full"
                      }
                    />
                  </Reveal>
                );
              })}
            </div>

            {/* Desktop : deux colonnes décalées, parallaxe différentielle */}
            <div className="hidden items-start gap-x-[clamp(2.5rem,5vw,6rem)] lg:grid lg:grid-cols-2">
              <Parallax
                amount={0}
                className="flex flex-col gap-y-[clamp(5rem,12vh,9rem)]"
              >
                {leftCol.map(({ project, index }, pos) => (
                  <Reveal key={project.slug}>
                    <MosaicCard
                      project={project}
                      index={index}
                      total={total}
                      format={pos % 2 === 0 ? "wide" : "tall"}
                      className={pos % 2 === 0 ? "w-full" : "w-[78%]"}
                    />
                  </Reveal>
                ))}
              </Parallax>

              <Parallax
                amount={64}
                className="mt-[clamp(8rem,22vh,14rem)] flex flex-col gap-y-[clamp(5rem,12vh,9rem)]"
              >
                {rightCol.map(({ project, index }, pos) => (
                  // Léger différé sur la première carte droite (premier écran)
                  <Reveal key={project.slug} delay={pos === 0 ? 90 : 0}>
                    <MosaicCard
                      project={project}
                      index={index}
                      total={total}
                      format={pos % 2 === 0 ? "wide" : "tall"}
                      className={pos % 2 === 0 ? "w-full" : "ml-auto w-[78%]"}
                    />
                  </Reveal>
                ))}
              </Parallax>
            </div>
          </div>
        </CardCursor>

        {/* Fin de page — l'appel */}
        <div className="pt-24 text-center">
          <p className="font-cond text-[11px] tracking-[0.25em] text-[var(--color-bone-faint)]">
            Un projet en tête ?
          </p>
          <div className="mt-8 flex justify-center">
            <DevisModal label="Demander un devis" />
          </div>
        </div>
      </div>
    </section>
  );
}

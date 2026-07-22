"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { CardCursor } from "@/components/CardCursor";
import { CardMedia } from "@/components/CardMedia";
import { DevisModal } from "@/components/DevisModal";
import { Parallax } from "@/components/Parallax";
import { projects, projectThumb, projectPreview } from "@/lib/site";
import type { Project } from "@/lib/site";

// « La colonne montée » — mosaïque éditoriale en deux colonnes décalées.
// Les films filtrés sont alternés gauche/droite (0→G, 1→D, 2→G…). Toutes les
// vignettes sont en 16:9 : on respecte le cadrage cinéma d'origine, aucun
// recadrage portrait. La colonne droite démarre plus bas et glisse un peu plus
// vite (Parallax différentiel) — de la profondeur, pas de scrolljack.
// Cartouche toujours SOUS le média, jamais en overlay.

const EASE_EXPO = "ease-[cubic-bezier(0.16,1,0.3,1)]";
// Même courbe signature, côté JS (styles inline transitionnés).
const EASE = "cubic-bezier(0.16,1,0.3,1)";

type Entry = { project: Project; index: number };

// Une carte : un seul <Link> (data-card → curseur « VOIR » via CardCursor),
// média puis cartouche.
//
// ENTRÉE (à l'entrée du viewport, orchestrée par une IO propre à la carte) :
// le média se DÉVOILE — rideau clip-path de haut en bas + léger settle
// d'échelle (1.06→1) — puis la cartouche monte SOUS lui, décalée en trois
// temps (numéro → titre → catégorie). Uniquement transform / opacity / clip-path,
// aucun layout shift : le cadre 16:9 réserve sa place, on ne fait que révéler
// son contenu.
//
// HOVER (porté par `group`) : zoom très lent du média (CardMedia lance la
// preview mp4), titre qui glisse, numéro qui passe du terracotta au crème.
// Aucun gradient overlay.
//
// prefers-reduced-motion : l'IO n'installe aucun état masqué (tout est rendu
// visible d'emblée, styles inline neutres) — repli statique complet.
function MosaicCard({
  project: p,
  index,
  total,
  delay = 0,
  className = "",
}: {
  project: Project;
  index: number;
  total: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setInView(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const anim = !reduced;
  const shown = inView;

  // Repli mouvement réduit → objets vides = rien n'est masqué, aucun transition.
  const mediaStyle: CSSProperties = anim
    ? {
        clipPath: shown ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        opacity: shown ? 1 : 0,
        transition: `clip-path 1.15s ${EASE} ${delay}ms, opacity 0.85s ${EASE} ${delay}ms`,
        willChange: "clip-path, opacity",
      }
    : {};

  const mediaInnerStyle: CSSProperties = anim
    ? {
        transform: shown ? "scale(1)" : "scale(1.06)",
        transition: `transform 1.3s ${EASE} ${delay}ms`,
        willChange: "transform",
      }
    : {};

  // Cartouche : montée + fondu décalés APRÈS le dévoilé du média.
  const line = (offset: number, extra = ""): CSSProperties =>
    anim
      ? {
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0)" : "translateY(16px)",
          transition:
            `opacity 0.85s ${EASE} ${delay + offset}ms, ` +
            `transform 0.95s ${EASE} ${delay + offset}ms` +
            (extra ? `, ${extra}` : ""),
        }
      : {};

  return (
    <Link
      ref={ref}
      href={`/realisations/${p.slug}`}
      data-card
      className={`group block ${className}`}
    >
      {/* 16:9 — cadrage cinéma respecté, l'image entière sans recadrage */}
      <div className="aspect-video overflow-hidden" style={mediaStyle}>
        <div className="h-full w-full" style={mediaInnerStyle}>
          <CardMedia
            src={projectThumb(p)}
            videoSrc={projectPreview(p)}
            alt={`${p.title} — ${p.category} · film Mauvais Grain, studio vidéo à Bordeaux`}
            className={`transition-transform duration-[1400ms] ${EASE_EXPO} group-hover:scale-[1.03]`}
          />
        </div>
      </div>

      {/* Cartouche sous le média */}
      <div className="mt-6">
        <p
          style={line(200, `color 0.55s ${EASE}`)}
          className="font-cond text-xs tracking-[0.25em] text-[var(--color-terra)] group-hover:text-[var(--color-cream)]"
        >
          {String(index + 1).padStart(2, "0")} —{" "}
          {String(total).padStart(2, "0")}
        </p>
        <h2
          style={line(280)}
          className="font-wide mt-4 text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.05] text-[var(--color-cream)]"
        >
          {/* Le glissé de hover vit sur un span dédié : le transform inline de
              révélation reste sur le <h2>, aucun conflit entre les deux. */}
          <span
            className={`inline-block transition-transform duration-[700ms] ${EASE_EXPO} group-hover:translate-x-[6px]`}
          >
            {p.title}
          </span>
        </h2>
        <p
          style={line(360)}
          className="font-cond mt-3 text-[11px] tracking-[0.2em] text-[var(--color-bone-faint)]"
        >
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
            {/* Mobile : une colonne, toutes les vignettes en 16:9 pleine largeur.
                Chaque carte s'orchestre elle-même à son entrée dans le viewport. */}
            <div className="flex flex-col gap-y-[4.5rem] lg:hidden">
              {entries.map(({ project, index }) => (
                <MosaicCard
                  key={project.slug}
                  project={project}
                  index={index}
                  total={total}
                  className="w-full"
                />
              ))}
            </div>

            {/* Desktop : deux colonnes décalées, parallaxe différentielle */}
            <div className="hidden items-start gap-x-[clamp(2.5rem,5vw,6rem)] lg:grid lg:grid-cols-2">
              <Parallax
                amount={0}
                className="flex flex-col gap-y-[clamp(5rem,12vh,9rem)]"
              >
                {leftCol.map(({ project, index }) => (
                  <MosaicCard
                    key={project.slug}
                    project={project}
                    index={index}
                    total={total}
                    className="w-full"
                  />
                ))}
              </Parallax>

              <Parallax
                amount={64}
                className="mt-[clamp(8rem,22vh,14rem)] flex flex-col gap-y-[clamp(5rem,12vh,9rem)]"
              >
                {rightCol.map(({ project, index }, pos) => (
                  // Léger différé sur la première carte droite : au premier écran,
                  // le dévoilé de la colonne droite suit celui de la gauche.
                  <MosaicCard
                    key={project.slug}
                    project={project}
                    index={index}
                    total={total}
                    delay={pos === 0 ? 110 : 0}
                    className="w-full"
                  />
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

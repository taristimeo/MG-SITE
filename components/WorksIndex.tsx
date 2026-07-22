"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CardMedia } from "@/components/CardMedia";
import { projects, projectThumb, projectPreview } from "@/lib/site";

// Index des réalisations façon programmation de festival : grandes lignes
// typographiques (numéro, titre Gloock, méta), et au survol un APERÇU VIDÉO
// FLOTTANT qui suit le curseur (desktop pointeur fin uniquement). Sur mobile,
// chaque ligne embarque sa vignette. Filtres par catégorie au-dessus, liste
// remontée en fondu à chaque changement.
export function WorksIndex() {
  const categories = useMemo(
    () => ["Tout", ...Array.from(new Set(projects.map((p) => p.category)))],
    [],
  );
  const [filter, setFilter] = useState("Tout");
  const [hovered, setHovered] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef(0);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const hasPos = useRef(false);

  // Aperçu flottant : uniquement pointeur fin, jamais en mouvement réduit.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(fine.matches && !reduce.matches);
    sync();
    fine.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  // Suivi du curseur avec un léger retard (lerp) — l'aperçu « flotte ».
  useEffect(() => {
    if (!enabled || !hovered) return;
    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!hasPos.current) {
        pos.current = { ...target.current };
        hasPos.current = true;
      }
    };
    const paint = () => {
      const panel = panelRef.current;
      if (panel && hasPos.current) {
        pos.current.x += (target.current.x - pos.current.x) * 0.16;
        pos.current.y += (target.current.y - pos.current.y) * 0.16;
        const w = panel.offsetWidth;
        const x = Math.min(pos.current.x + 28, window.innerWidth - w - 16);
        const y = pos.current.y - panel.offsetHeight / 2;
        panel.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(paint);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(rafRef.current);
      hasPos.current = false;
    };
  }, [enabled, hovered]);

  const visible =
    filter === "Tout"
      ? projects
      : projects.filter((p) => p.category === filter);
  const hoveredProject = projects.find((p) => p.slug === hovered);

  return (
    <div>
      {/* Filtres par catégorie */}
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

      {/* Index — grandes lignes, façon générique */}
      <ol
        key={filter}
        className="grid-fade mt-14 border-t border-[var(--color-line-soft)] text-left"
        onMouseLeave={() => setHovered(null)}
      >
        {visible.map((p, i) => (
          <li key={p.slug}>
            <Link
              href={`/realisations/${p.slug}`}
              onMouseEnter={() => setHovered(p.slug)}
              className="group flex flex-wrap items-baseline gap-x-6 gap-y-4 border-b border-[var(--color-line-soft)] py-7 sm:py-9"
            >
              <span className="font-cond w-8 shrink-0 text-xs tracking-[0.2em] text-[var(--color-terra)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-wide min-w-0 flex-1 text-[clamp(1.7rem,5.5vw,4rem)] leading-[1.02] text-[var(--color-bone)] transition-all duration-500 group-hover:translate-x-2 group-hover:text-[var(--color-cream)]">
                {p.title}
              </span>
              <span className="font-cond ml-auto shrink-0 text-[11px] tracking-[0.2em] text-[var(--color-bone-faint)] transition-colors duration-300 group-hover:text-[var(--color-bone-dim)]">
                {p.category} · {p.year}
              </span>

              {/* Vignette embarquée — mobile / tactile uniquement */}
              <span className="mt-1 block w-full overflow-hidden rounded-xl bg-[var(--color-ink-2)] md:hidden">
                <span className="block aspect-[16/9]">
                  <CardMedia
                    src={projectThumb(p)}
                    videoSrc={projectPreview(p)}
                    alt={`${p.title} — ${p.category} · film Mauvais Grain, studio vidéo à Bordeaux`}
                  />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {/* Aperçu flottant (desktop) — la preview du film sous le curseur */}
      {enabled && hoveredProject && (
        <div
          ref={panelRef}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[80] w-[min(400px,32vw)] overflow-hidden rounded-xl border border-[var(--color-line-soft)] shadow-2xl"
          style={{ transform: "translate3d(-200%, -200%, 0)" }}
        >
          <div key={hoveredProject.slug} className="grid-fade aspect-video bg-[var(--color-ink-2)]">
            <CardMedia
              src={projectThumb(hoveredProject)}
              videoSrc={projectPreview(hoveredProject)}
              alt=""
            />
          </div>
        </div>
      )}
    </div>
  );
}

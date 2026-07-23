"use client";

import { useMemo, useState } from "react";
import { StackedWorks } from "@/components/StackedWorks";
import { projects } from "@/lib/site";

// Vitrine des réalisations avec filtre par catégorie. Les puces (« Tout » +
// chaque catégorie) pilotent la liste passée à WorksApple ; au changement de
// filtre, la vitrine refond doucement (grid-fade). Le soulignement terracotta
// des puces et le fondu sont gérés par .filter-chip / .grid-fade (globals.css).
export function WorksFiltered() {
  const categories = useMemo(
    () => ["Tout", ...Array.from(new Set(projects.map((p) => p.category)))],
    [],
  );
  const [filter, setFilter] = useState("Tout");

  const items =
    filter === "Tout"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <div>
      {/* Filtres par catégorie */}
      <div className="mx-auto mb-12 flex max-w-[1080px] flex-wrap justify-center gap-x-8 gap-y-3 sm:mb-16">
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

      {/* Re-key au changement de filtre : la vitrine refond en entier */}
      <div key={filter} className="grid-fade">
        <StackedWorks items={items} />
      </div>
    </div>
  );
}

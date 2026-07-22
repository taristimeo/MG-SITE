"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

export type StatItem = {
  // Soit une valeur numérique à compter, soit un affichage statique (ex. « 2022 »).
  value?: number;
  display?: string;
  decimals?: number;
  label: string;
  // suffix rendu en terracotta (ex. ★) — un seul accent, avec parcimonie.
  accent?: string;
};

const fmt = (v: number, decimals = 0) =>
  v.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

// Chiffres-clés : chaque colonne monte en fondu (léger décalage entre colonnes)
// et les valeurs comptent de 0 à leur cible (décélération expo). Le comptage est
// écrit directement dans le DOM — pas de re-render par frame. Un seul re-render
// (au déclenchement) pilote le fondu-montée via transition CSS staggerée.
// prefers-reduced-motion : valeurs finales, aucune transition.
export function Stats({ items }: { items: StatItem[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [started, setStarted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Repli statique : valeurs finales, visibles, sans transition.
      items.forEach((s, i) => {
        const n = numRefs.current[i];
        if (n && s.value !== undefined) n.textContent = fmt(s.value, s.decimals);
      });
      setReduced(true);
      setStarted(true);
      return;
    }

    let raf = 0;
    const DUR = 1400; // durée du roll-up d'une colonne
    const STAGGER = 150; // décalage d'entrée entre colonnes
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setStarted(true);
        let start = 0;
        const tick = (ts: number) => {
          if (!start) start = ts;
          const t = ts - start;
          let done = true;
          items.forEach((s, i) => {
            if (s.value === undefined) return; // valeur statique (ex. 2022)
            const local = Math.min(1, Math.max(0, (t - i * STAGGER) / DUR));
            // Décélération expo : file vite puis se pose.
            const eased = local >= 1 ? 1 : 1 - Math.pow(2, -10 * local);
            const n = numRefs.current[i];
            if (n) n.textContent = fmt(s.value * eased, s.decimals);
            if (local < 1) done = false;
          });
          if (!done) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-x-6 gap-y-12 text-center lg:grid-cols-4"
    >
      {items.map((s, i) => {
        // Contenu initial : l'affichage statique, ou un zéro formaté que le
        // rAF fera monter (évite tout flash de la valeur finale).
        const initial =
          s.display ?? (s.value !== undefined ? fmt(0, s.decimals) : "");
        return (
          <div
            key={s.label}
            style={
              {
                opacity: started ? 1 : 0,
                transform: started ? "none" : "translateY(16px)",
                transition: reduced
                  ? "none"
                  : "opacity 0.9s var(--ease-out-soft), transform 1s var(--ease-out-expo)",
                transitionDelay: `${i * 90}ms`,
                willChange: "opacity, transform",
              } as CSSProperties
            }
          >
            <p className="font-wide text-[clamp(2.4rem,6vw,4.4rem)] leading-none text-[var(--color-cream)]">
              <span
                ref={(el) => {
                  numRefs.current[i] = el;
                }}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {initial}
              </span>
              {s.accent && (
                <span className="ml-1 align-middle text-[0.45em] text-[var(--color-terra)]">
                  {s.accent}
                </span>
              )}
            </p>
            <p className="font-cond mx-auto mt-4 max-w-[18ch] text-[11px] leading-relaxed tracking-[0.18em] text-[var(--color-bone-dim)]">
              {s.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

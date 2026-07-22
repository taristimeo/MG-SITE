"use client";

import { useEffect, useRef, useState } from "react";

export type StatItem = {
  // Soit une valeur numérique à compter, soit un affichage statique (ex. « 2022 »).
  value?: number;
  display?: string;
  decimals?: number;
  label: string;
  // suffix rendu en terracotta (ex. ★) — un seul accent, avec parcimonie.
  accent?: string;
};

// Chiffres-clés : les valeurs comptent de 0 à leur cible quand la rangée entre
// dans le champ (~1,4 s, décélération expo). reduced-motion : valeurs finales.
export function Stats({ items }: { items: StatItem[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [t, setT] = useState(0); // progression 0 → 1 de l'animation

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(1);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        let start = 0;
        const tick = (ts: number) => {
          if (!start) start = ts;
          const x = Math.min(1, (ts - start) / 1400);
          // Décélération expo : file vite puis se pose.
          setT(x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
          if (x < 1) raf = requestAnimationFrame(tick);
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
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-x-6 gap-y-12 text-center lg:grid-cols-4"
    >
      {items.map((s) => {
        const shown =
          s.display ??
          (s.value !== undefined
            ? (s.value * t).toLocaleString("fr-FR", {
                minimumFractionDigits: s.decimals ?? 0,
                maximumFractionDigits: s.decimals ?? 0,
              })
            : "");
        return (
          <div key={s.label}>
            <p
              className="font-wide text-[clamp(2.4rem,6vw,4.4rem)] leading-none text-[var(--color-cream)]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {s.display ? (
                s.display
              ) : (
                <span style={{ opacity: t === 0 ? 0 : 1 }}>{shown}</span>
              )}
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

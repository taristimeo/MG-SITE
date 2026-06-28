"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

// Déplace très légèrement son contenu en fonction de la position de scroll,
// pendant que l'élément traverse la fenêtre. `amount` = amplitude totale en px
// (par défaut 36 → de +18px à -18px). Volontairement subtil.
export function Parallax({
  children,
  amount = 36,
  className = "",
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 quand l'élément entre par le bas, 1 quand il sort par le haut.
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      const y = (0.5 - p) * amount;
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [amount]);

  return (
    <div ref={ref} className={`parallax will-change-transform ${className}`}>
      {children}
    </div>
  );
}

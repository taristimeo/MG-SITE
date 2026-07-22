"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

// Déplace très légèrement son contenu en fonction de la position de scroll,
// pendant que l'élément traverse la fenêtre. `amount` = amplitude totale en px
// (par défaut 36 → de +18px à -18px). Volontairement subtil : la position est
// lissée (lerp) vers sa cible pour un mouvement traînant et soyeux, écrit
// directement dans le DOM via rAF. Inactif en prefers-reduced-motion.
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
    let current = 0;
    let target = 0;
    let running = false;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 quand l'élément entre par le bas, 1 quand il sort par le haut.
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      target = (0.5 - p) * amount;
    };

    const tick = () => {
      // Lissage exponentiel : approche douce de la cible, sans osciller.
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.05) {
        current = target;
        running = false;
      }
      el.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`;
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const ensureRunning = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      measure();
      ensureRunning();
    };

    // Position initiale posée sans traîne (pas de saut à l'apparition).
    measure();
    current = target;
    el.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`;

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      running = false;
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

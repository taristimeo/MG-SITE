"use client";

import { useEffect, useRef } from "react";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// Le hero s'estompe et recule légèrement quand on commence à scroller — la page
// « avale » l'écran-titre avant d'entrer dans le récit. Purement visuel (le
// contenu reste rendu côté serveur) ; inactif en prefers-reduced-motion.
export function HeroFade({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const render = () => {
      raf = 0;
      const p = clamp01(window.scrollY / (window.innerHeight * 0.85));
      el.style.opacity = String(1 - p);
      el.style.transform = `translateY(${(-36 * p).toFixed(1)}px) scale(${(1 - 0.05 * p).toFixed(4)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}

"use client";

import { useEffect, useRef, useState } from "react";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// Le hero s'estompe et recule légèrement quand on commence à scroller — la page
// « avale » l'écran-titre avant d'entrer dans le récit. À l'arrivée, il se pose
// en douceur (fondu + très léger scale/translate, flou qui se dissipe). Purement
// visuel (le contenu reste rendu côté serveur) ; inactif en prefers-reduced-motion.
export function HeroFade({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [entered, setEntered] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setEntered(true);
      return;
    }
    // Entrée : laisse peindre l'état initial, puis relâche sur la frame suivante.
    const raf = requestAnimationFrame(() => setEntered(true));

    const el = ref.current;
    if (!el) return () => cancelAnimationFrame(raf);
    let sraf = 0;
    const render = () => {
      sraf = 0;
      const p = clamp01(window.scrollY / (window.innerHeight * 0.85));
      el.style.opacity = String(1 - p);
      el.style.transform = `translateY(${(-36 * p).toFixed(1)}px) scale(${(1 - 0.05 * p).toFixed(4)})`;
    };
    const onScroll = () => {
      if (!sraf) sraf = requestAnimationFrame(render);
    };
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (sraf) cancelAnimationFrame(sraf);
    };
  }, []);

  return (
    <div ref={ref}>
      <div
        style={
          reduced
            ? undefined
            : {
                opacity: entered ? 1 : 0,
                transform: entered
                  ? "none"
                  : "translateY(22px) scale(0.985)",
                filter: entered ? "blur(0)" : "blur(6px)",
                transition:
                  "opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s cubic-bezier(0.22, 0.61, 0.36, 1)",
                willChange: "opacity, transform, filter",
              }
        }
      >
        {children}
      </div>
    </div>
  );
}

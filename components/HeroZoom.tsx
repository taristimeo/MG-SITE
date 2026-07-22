"use client";

import { useEffect, useRef } from "react";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// Zoom arrière scroll-réactif pour les images de hero : l'image démarre
// légèrement grossie (1.12) et se pose à l'échelle 1 pendant le premier écran
// de scroll — l'image « respire » sans coûter une vidéo. Inactif en
// prefers-reduced-motion.
export function HeroZoom({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "none";
      return;
    }
    let raf = 0;
    const render = () => {
      raf = 0;
      const p = clamp01(window.scrollY / window.innerHeight);
      el.style.transform = `scale(${(1.12 - 0.12 * p).toFixed(4)})`;
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

  return (
    <div
      ref={ref}
      className="h-full w-full will-change-transform"
      style={{ transform: "scale(1.12)" }}
    >
      {children}
    </div>
  );
}

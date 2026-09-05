"use client";

import { useEffect } from "react";

/**
 * Le header est en `position: fixed` : il ne peut pas hériter du ton de la
 * section qu'il survole. Cet observateur regarde ce qui passe sous la barre et
 * pose `data-header-tone` sur <html> — le CSS rebascule alors les variables de
 * la charte dans le header, et la barre d'état du navigateur (mobile) suit le
 * fond réel de la page.
 *
 * Lecture throttlée en rAF, écouteur passif : rien ne touche au layout pendant
 * le défilement.
 */
export function ToneWatcher() {
  useEffect(() => {
    const root = document.documentElement;
    // Ligne de lecture : le milieu vertical de la barre (56 px environ).
    const PROBE_Y = 44;

    let raf = 0;
    let current: "light" | "dark" | null = null;

    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

    const read = () => {
      raf = 0;
      const zones = document.querySelectorAll<HTMLElement>('[data-tone="dark"]');
      let dark = false;
      for (const z of zones) {
        const r = z.getBoundingClientRect();
        if (r.top <= PROBE_Y && r.bottom >= PROBE_Y) {
          dark = true;
          break;
        }
      }
      const next = dark ? "dark" : "light";
      if (next === current) return;
      current = next;
      root.dataset.headerTone = next;
      if (meta) meta.content = dark ? "#0a0908" : "#f6f3ec";
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      delete root.dataset.headerTone;
    };
  }, []);

  return null;
}

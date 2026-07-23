"use client";

import { useEffect, useRef } from "react";

type Props = {
  text: string;
  className?: string;
};

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

// Parse un token couleur hex (#rgb / #rrggbb) en [r,g,b]. null si échec.
function parseHex(raw: string): [number, number, number] | null {
  const s = raw.trim().replace(/^#/, "");
  if (s.length === 3) {
    const r = parseInt(s[0] + s[0], 16);
    const g = parseInt(s[1] + s[1], 16);
    const b = parseInt(s[2] + s[2], 16);
    return [r, g, b];
  }
  if (s.length === 6) {
    const r = parseInt(s.slice(0, 2), 16);
    const g = parseInt(s.slice(2, 4), 16);
    const b = parseInt(s.slice(4, 6), 16);
    if ([r, g, b].every((n) => !Number.isNaN(n))) return [r, g, b];
  }
  return null;
}

// Corps de texte « façon Apple » : les mots passent progressivement de terne
// (bone-faint) à clair (cream) selon l'avancée de l'élément dans le viewport.
// Un front de balayage mot-à-mot piloté au scroll, écrit directement dans le
// DOM en requestAnimationFrame (aucun re-render React par frame).
// prefers-reduced-motion : tout en clair d'emblée, aucun listener.
export function ScrollText({ text, className = "" }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(
      el.querySelectorAll<HTMLSpanElement>("[data-word]"),
    );
    const N = spans.length;
    if (!N) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const s of spans) s.style.color = "var(--color-cream)";
      return;
    }

    const css = getComputedStyle(document.documentElement);
    const from = parseHex(css.getPropertyValue("--color-bone-faint")) ?? [
      110, 104, 92,
    ];
    const to = parseHex(css.getPropertyValue("--color-cream")) ?? [
      232, 228, 216,
    ];

    // Largeur du front (en nombre de mots simultanément en transition).
    const spread = 9;

    const render = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.9; // le balayage démarre quand le haut passe 90%
      const end = vh * 0.35; // et se termine à 35%
      const p = clamp01((start - rect.top) / (start - end));
      const scan = p * (N + spread);
      for (let i = 0; i < N; i++) {
        const t = clamp01((scan - i) / spread);
        const r = Math.round(from[0] + (to[0] - from[0]) * t);
        const g = Math.round(from[1] + (to[1] - from[1]) * t);
        const b = Math.round(from[2] + (to[2] - from[2]) * t);
        spans[i].style.color = `rgb(${r},${g},${b})`;
      }
    };

    let raf = 0;
    let running = false;
    const loop = () => {
      render();
      running = false;
      raf = 0;
    };
    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    render();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          data-word
          style={{ color: "var(--color-bone-faint)" }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

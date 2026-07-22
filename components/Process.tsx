"use client";

import { useEffect, useRef } from "react";
import { processSteps } from "@/lib/site";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// Frise du process, du repérage à l'étalonnage. Horizontale sur desktop,
// verticale sur mobile. Le trait de liaison se TRACE au scroll (scaleX / scaleY
// avec origine, comme .story-rule) et un seul point terracotta reste actif — le
// front de progression. En prefers-reduced-motion : trait plein, dernier point
// actif, aucun mouvement (voir globals.css + garde JS ci-dessous).
export function Process() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hFillRef = useRef<HTMLSpanElement | null>(null);
  const vFillRef = useRef<HTMLSpanElement | null>(null);
  const dotsH = useRef<(HTMLSpanElement | null)[]>([]);
  const dotsV = useRef<(HTMLSpanElement | null)[]>([]);
  const n = processSteps.length;
  // Inset des traits horizontaux : ils partent du 1er point et finissent au
  // dernier (chaque colonne fait 1/n de large, le point est en son centre).
  const inset = `${100 / (2 * n)}%`;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const paintDots = (active: number, done: (i: number) => boolean) => {
      for (let i = 0; i < n; i++) {
        const state = i === active ? "active" : done(i) ? "done" : "todo";
        if (dotsH.current[i]) dotsH.current[i]!.dataset.state = state;
        if (dotsV.current[i]) dotsV.current[i]!.dataset.state = state;
      }
    };

    // Repli sans animation : trait plein, dernier point actif.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (hFillRef.current) hFillRef.current.style.transform = "scaleX(1)";
      if (vFillRef.current) vFillRef.current.style.transform = "scaleY(1)";
      paintDots(n - 1, () => true);
      return;
    }

    let raf = 0;
    const render = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progression : 0 quand la frise entre par le bas, 1 quand elle atteint
      // le tiers haut de l'écran.
      const p = clamp01((vh * 0.82 - rect.top) / (vh * 0.82 - vh * 0.32));
      if (hFillRef.current) hFillRef.current.style.transform = `scaleX(${p})`;
      if (vFillRef.current) vFillRef.current.style.transform = `scaleY(${p})`;
      const active = Math.min(n - 1, Math.round(p * (n - 1)));
      paintDots(active, (i) => p >= i / (n - 1) - 0.02);
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
  }, [n]);

  return (
    <div ref={sectionRef}>
      {/* Desktop : frise horizontale */}
      <div className="relative hidden sm:block">
        <div
          aria-hidden
          className="absolute top-[6px] h-px bg-[var(--color-line-soft)]"
          style={{ left: inset, right: inset }}
        />
        <span
          ref={hFillRef}
          aria-hidden
          className="process-fill absolute top-[6px] h-px bg-[var(--color-terra)]"
          style={{ left: inset, right: inset }}
        />
        <ol
          className="grid"
          style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        >
          {processSteps.map((s, i) => (
            <li
              key={s.label}
              className="flex flex-col items-center px-3 text-center"
            >
              <span
                ref={(el) => {
                  dotsH.current[i] = el;
                }}
                data-state="todo"
                className="process-dot h-3 w-3 rounded-full"
              />
              <p className="font-cond mt-6 text-xs tracking-[0.18em] text-[var(--color-bone)]">
                {s.label}
              </p>
              <p className="font-sans mt-3 max-w-[20ch] text-xs leading-relaxed text-[var(--color-bone-dim)]">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile : frise verticale */}
      <div className="relative sm:hidden">
        <div
          aria-hidden
          className="absolute top-1 bottom-1 left-[5px] w-px bg-[var(--color-line-soft)]"
        />
        <span
          ref={vFillRef}
          aria-hidden
          className="process-fill-v absolute top-1 bottom-1 left-[5px] w-px bg-[var(--color-terra)]"
        />
        <ol className="flex flex-col gap-9">
          {processSteps.map((s, i) => (
            <li key={s.label} className="relative pl-9">
              <span
                ref={(el) => {
                  dotsV.current[i] = el;
                }}
                data-state="todo"
                className="process-dot absolute left-0 top-[5px] h-3 w-3 rounded-full"
              />
              <p className="font-cond text-xs tracking-[0.18em] text-[var(--color-bone)]">
                {s.label}
              </p>
              <p className="font-sans mt-2 max-w-[42ch] text-sm leading-relaxed text-[var(--color-bone-dim)]">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

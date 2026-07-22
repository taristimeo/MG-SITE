"use client";

import { useEffect, useRef } from "react";
import { processSteps } from "@/lib/site";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// Frise du process, du repérage à l'étalonnage. Horizontale sur desktop,
// verticale sur mobile. Quand la frise entre à l'écran, une tête de lecture
// AVANCE DANS LE TEMPS : le trait se remplit progressivement et chaque étape
// s'allume l'une après l'autre (le point actif « ping »). En
// prefers-reduced-motion : trait plein, dernier point actif, aucun mouvement.
export function Process() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hFillRef = useRef<HTMLSpanElement | null>(null);
  const vFillRef = useRef<HTMLSpanElement | null>(null);
  const dotsH = useRef<(HTMLSpanElement | null)[]>([]);
  const dotsV = useRef<(HTMLSpanElement | null)[]>([]);
  const textH = useRef<(HTMLDivElement | null)[]>([]);
  const textV = useRef<(HTMLDivElement | null)[]>([]);
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
        // Le texte se révèle dès que la tête de lecture a atteint l'étape.
        const revealed = state === "todo" ? "false" : "true";
        if (textH.current[i]) textH.current[i]!.dataset.in = revealed;
        if (textV.current[i]) textV.current[i]!.dataset.in = revealed;
      }
    };

    // Applique une progression p ∈ [0,1] : remplit le trait et allume les points
    // jusqu'à la tête de lecture.
    const setProgress = (p: number) => {
      if (hFillRef.current) hFillRef.current.style.transform = `scaleX(${p})`;
      if (vFillRef.current) vFillRef.current.style.transform = `scaleY(${p})`;
      const active = Math.min(n - 1, Math.round(p * (n - 1)));
      paintDots(active, (i) => p >= i / (n - 1) - 0.02);
    };

    // Repli sans animation : trait plein, dernier point actif.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }

    // Adoucissement (easeInOutSine) : départ et arrivée en douceur, vitesse
    // régulière au milieu — comme une horloge qui avance.
    const ease = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
    // Durée calée sur le nombre d'étapes (~0,5 s par étape) pour qu'on voie
    // chaque étape s'allumer tour à tour.
    const duration = Math.max(2400, n * 500);

    let raf = 0;
    let startTs = 0;
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const t = clamp01((ts - startTs) / duration);
      setProgress(ease(t));
      raf = t < 1 ? requestAnimationFrame(tick) : 0;
    };

    // On ne lance la progression que lorsque la frise entre dans le champ.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(section);

    return () => {
      io.disconnect();
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
              <div
                ref={(el) => {
                  textH.current[i] = el;
                }}
                data-in="false"
                className="process-text flex flex-col items-center"
              >
                <p className="font-cond mt-6 text-xs tracking-[0.18em] text-[var(--color-bone)]">
                  {s.label}
                </p>
                <p className="font-sans mt-3 max-w-[20ch] text-xs leading-relaxed text-[var(--color-bone-dim)]">
                  {s.text}
                </p>
              </div>
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
              <div
                ref={(el) => {
                  textV.current[i] = el;
                }}
                data-in="false"
                className="process-text"
              >
                <p className="font-cond text-xs tracking-[0.18em] text-[var(--color-bone)]">
                  {s.label}
                </p>
                <p className="font-sans mt-2 max-w-[42ch] text-sm leading-relaxed text-[var(--color-bone-dim)]">
                  {s.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

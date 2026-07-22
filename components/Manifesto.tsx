"use client";

import { useEffect, useRef, useState } from "react";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const strip = (w: string) => w.replace(/[.,!?;:«»'']/g, "").toLowerCase();

// Manifeste « scrollytelling » : la section fait ~2 écrans de haut, le texte
// reste épinglé au centre pendant que chaque mot s'éclaire au fil du scroll
// (de quasi-éteint → crème ; les mots accents → terracotta). En
// prefers-reduced-motion : simple section statique, tout le texte visible.
export function Manifesto({
  kicker,
  text,
  accents = [],
  pinned = true,
}: {
  kicker: string;
  text: string;
  accents?: string[];
  // pinned=false : rendu statique (tout le texte visible, pas d'épinglage) —
  // le scrollytelling mot-à-mot reste un moment unique de l'accueil.
  pinned?: boolean;
}) {
  const outerRef = useRef<HTMLElement | null>(null);
  const [p, setP] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setP(1);
      return;
    }
    let raf = 0;
    const render = () => {
      raf = 0;
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      setP(span > 0 ? clamp01(-rect.top / span) : 1);
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

  // Mode « plat » : mouvement réduit OU manifeste non épinglé (Studio).
  const flat = reduced || !pinned;
  const words = text.split(/\s+/);
  const accentSet = new Set(accents.map((a) => a.toLowerCase()));
  // Légère avance pour que la phrase soit complète juste avant le dépin.
  const shown = flat ? words.length : Math.floor(p * words.length * 1.15);

  return (
    <section ref={outerRef} className={flat ? "py-28 sm:py-36" : "h-[190vh]"}>
      <div
        className={
          flat
            ? "flex items-center justify-center"
            : "sticky top-0 flex h-svh items-center justify-center"
        }
      >
        <div className="px-6 text-center">
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            {kicker}
          </p>
          <p className="font-wide mx-auto mt-8 max-w-[21ch] text-[clamp(1.7rem,4.8vw,3.8rem)] leading-[1.16]">
            {words.map((w, i) => {
              const on = i < shown;
              const accent = accentSet.has(strip(w));
              return (
                <span
                  key={i}
                  style={{
                    color: on
                      ? accent
                        ? "var(--color-terra)"
                        : "var(--color-cream)"
                      : "rgba(232, 228, 216, 0.14)",
                    transition: flat ? "none" : "color 0.35s ease-out",
                  }}
                >
                  {w}{" "}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const strip = (w: string) => w.replace(/[.,!?;:«»'']/g, "").toLowerCase();

// Illumination continue d'un mot : facteur f ∈ [0,1]. Le mot passe d'un crème
// quasi éteint (alpha 0.14) à sa couleur pleine — crème, ou terracotta pour les
// accents. On interpole aussi la teinte des accents pour un « allumage » tendre.
function litColor(f: number, accent: boolean): string {
  const a = 0.14 + 0.86 * f;
  if (accent) {
    const r = Math.round(232 + (183 - 232) * f);
    const g = Math.round(228 + (110 - 228) * f);
    const b = Math.round(216 + (78 - 216) * f);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return `rgba(232, 228, 216, ${a})`;
}

// Manifeste « scrollytelling » : la section fait ~2 écrans de haut, le texte
// reste épinglé au centre pendant que chaque mot s'éclaire au fil du scroll.
// L'illumination n'est plus un interrupteur (mot allumé / éteint) mais une
// vague douce : une « tête de lecture » balaie la phrase et chaque mot fond de
// l'éteint au vif sur une bande de ~2 mots (courbe smoothstep). L'écriture des
// couleurs se fait directement dans le DOM (aucun re-render par frame).
// En prefers-reduced-motion : section statique, tout le texte visible.
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
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);

  const words = text.split(/\s+/);
  const accentSet = new Set(accents.map((a) => a.toLowerCase()));
  // Mode « plat » : mouvement réduit OU manifeste non épinglé (Studio).
  const flat = reduced || !pinned;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    // Non épinglé : rendu plat, tout est déjà allumé côté rendu — pas de rAF.
    if (!pinned) return;

    const N = words.length;
    const band = 1.8; // largeur (en mots) du dégradé d'allumage
    let raf = 0;
    const render = () => {
      raf = 0;
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? clamp01(-rect.top / span) : 1;
      // Légère avance (×1.12) pour que la phrase soit complète juste avant le
      // dépin. La tête balaie de -band (rien d'allumé) à N (tout allumé).
      const head = p * 1.12 * N;
      for (let i = 0; i < N; i++) {
        const s = wordRefs.current[i];
        if (!s) continue;
        const x = clamp01((head - i) / band);
        const f = x * x * (3 - 2 * x); // smoothstep : bords adoucis
        s.style.color = litColor(f, s.dataset.accent === "1");
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinned]);

  return (
    <section ref={outerRef} className={flat ? "py-28 sm:py-36" : "h-[150vh] sm:h-[190vh]"}>
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
              const accent = accentSet.has(strip(w));
              return (
                <span
                  key={i}
                  ref={(el) => {
                    wordRefs.current[i] = el;
                  }}
                  data-accent={accent ? "1" : "0"}
                  style={{
                    color: litColor(flat ? 1 : 0, accent),
                    // Tout est piloté par le rAF (continu, calé sur le scroll) :
                    // aucune transition CSS, la douceur vient du dégradé.
                    transition: "none",
                  } as CSSProperties}
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

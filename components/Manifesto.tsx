"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const strip = (w: string) => w.replace(/[.,!?;:«»'']/g, "").toLowerCase();

type RGB = [number, number, number];

// Replis : valeurs du thème sombre, servant uniquement au rendu serveur et à
// la toute première frame — les vraies couleurs sont lues sur les tokens CSS
// côté client, ce qui rend le composant identique sur les deux thèmes.
const CREAM_FALLBACK: RGB = [232, 228, 216];
const TERRA_FALLBACK: RGB = [183, 110, 78];

// Parse un token couleur hex (#rgb / #rrggbb) en [r,g,b]. null si échec.
function parseHex(raw: string): RGB | null {
  const s = raw.trim().replace(/^#/, "");
  if (s.length === 3) {
    const r = parseInt(s[0] + s[0], 16);
    const g = parseInt(s[1] + s[1], 16);
    const b = parseInt(s[2] + s[2], 16);
    if ([r, g, b].every((n) => !Number.isNaN(n))) return [r, g, b];
  }
  if (s.length === 6) {
    const r = parseInt(s.slice(0, 2), 16);
    const g = parseInt(s.slice(2, 4), 16);
    const b = parseInt(s.slice(4, 6), 16);
    if ([r, g, b].every((n) => !Number.isNaN(n))) return [r, g, b];
  }
  return null;
}

// Lit un token de couleur sur :root (client uniquement), repli si vide.
function readToken(name: string, fallback: RGB): RGB {
  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  return parseHex(raw) ?? fallback;
}

// Illumination continue d'un mot : facteur f ∈ [0,1]. Le mot passe d'un crème
// quasi éteint (alpha 0.14) à sa couleur pleine — crème, ou terracotta pour les
// accents. On interpole aussi la teinte des accents pour un « allumage » tendre.
// Les deux teintes viennent des tokens (--color-cream / --color-terra) : une
// seule implémentation, valable en thème sombre comme en thème clair.
function litColor(f: number, accent: boolean, cream: RGB, terra: RGB): string {
  const a = 0.14 + 0.86 * f;
  const to = accent ? terra : cream;
  const r = Math.round(cream[0] + (to[0] - cream[0]) * f);
  const g = Math.round(cream[1] + (to[1] - cream[1]) * f);
  const b = Math.round(cream[2] + (to[2] - cream[2]) * f);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
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
    // Couleurs lues sur les tokens au montage (et relues au resize, au cas où
    // la feuille de style arriverait après le premier rendu).
    let cream = readToken("--color-cream", CREAM_FALLBACK);
    let terra = readToken("--color-terra", TERRA_FALLBACK);
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
        s.style.color = litColor(f, s.dataset.accent === "1", cream, terra);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const onResize = () => {
      cream = readToken("--color-cream", CREAM_FALLBACK);
      terra = readToken("--color-terra", TERRA_FALLBACK);
      onScroll();
    };
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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
                    // Mode plat : couleur pleine, directement le token (aucun
                    // JS ne repassera derrière). Mode animé : état « éteint »
                    // le temps d'une frame, le rAF prend le relais avec les
                    // teintes lues sur les tokens.
                    color: flat
                      ? accent
                        ? "var(--color-terra)"
                        : "var(--color-cream)"
                      : litColor(0, accent, CREAM_FALLBACK, TERRA_FALLBACK),
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

"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Still } from "@/components/Poster";

export type StoryChapter = {
  index: string;
  kicker: string;
  title: string;
  text: string;
};

type Props = {
  chapters: StoryChapter[];
  imageSrc: string;
  imageAlt: string;
};

// Course de scroll (en svh) : intro = révélation de l'image seule, puis un
// palier par chapitre.
const SVH_INTRO = 70;
const SVH_PER_CHAPTER = 110;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const clamp = (n: number, lo: number, hi: number) =>
  n < lo ? lo : n > hi ? hi : n;
// smoothstep — fondu doux plutôt que linéaire
const smooth = (n: number) => {
  const x = clamp01(n);
  return x * x * (3 - 2 * x);
};

export function StudioStory({ chapters, imageSrc, imageAlt }: Props) {
  const [reduced, setReduced] = useState(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const ghostRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tickRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const steps = chapters.length;
  const totalScroll = SVH_INTRO + steps * SVH_PER_CHAPTER;
  const introFrac = SVH_INTRO / totalScroll;
  const textSpan = 1 - introFrac;
  const textSeg = textSpan / steps;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const section = sectionRef.current;
    if (!section) return;

    // Écrit l'état pour une progression p — directement sur le DOM (pas de
    // re-render React), donc fluide même à 60fps.
    const render = (p: number) => {
      // Image : révélation à l'intro (fondu + montée + léger zoom), puis
      // « breathing » lent. Tout en transform/opacity → composité GPU.
      const ip = clamp01(p / introFrac);
      const rev = smooth(ip);
      const imgOpacity = smooth(clamp01(ip / 0.55));
      const imgY = (1 - rev) * 56;
      const revealScale = 0.94 + 0.06 * rev;
      const afterIntro = clamp01((p - introFrac) / textSpan);
      const breathScale = 1 + 0.05 * afterIntro;

      const frame = frameRef.current;
      if (frame) {
        frame.style.opacity = String(imgOpacity);
        frame.style.transform = `translate3d(0,${imgY}px,0) scale(${revealScale})`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `scale(${breathScale})`;
      }

      // Textes : plateau lisible large au centre, sortie en fondu + glissement
      // + scale (pas de blur par frame : filter force des repaints coûteux).
      // Le grand chiffre fantôme dérive un peu plus que le texte → profondeur.
      for (let i = 0; i < steps; i++) {
        const center = introFrac + (i + 0.5) * textSeg;
        const t = (p - center) / textSeg;
        const a = Math.abs(t);
        // Plateau élargi (|t|<0.19) : le bloc reste posé plus longtemps avant
        // de s'effacer — lecture plus calme, moins de va-et-vient.
        const fade = smooth((a - 0.19) / (0.68 - 0.19));
        const opacity = clamp01(1 - fade);
        const tc = clamp(t, -0.5, 0.5);
        const y = -tc * 118;
        const x = tc * (i % 2 === 0 ? 20 : -20);
        const scale = 1 - a * 0.05;

        const layer = layerRefs.current[i];
        const art = articleRefs.current[i];
        const ghost = ghostRefs.current[i];
        const tick = tickRefs.current[i];
        if (layer) {
          layer.style.opacity = String(opacity);
          layer.style.pointerEvents = opacity < 0.05 ? "none" : "auto";
        }
        if (art) {
          art.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
        }
        // Parallaxe : dérive additionnelle du chiffre (composée à celle de
        // l'article) pour un léger décollement en Z.
        if (ghost) {
          ghost.style.transform = `translate3d(${tc * (i % 2 === 0 ? 14 : -14)}px,${-tc * 34}px,0)`;
        }
        if (tick) tick.style.transform = `scaleX(${opacity})`;
      }
    };

    const readTarget = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      return clamp01(total > 0 ? -rect.top / total : 0);
    };

    let raf = 0;
    let running = false;
    let current = readTarget();

    // Boucle de lissage : on interpole la valeur affichée vers la cible, ce qui
    // gomme les à-coups du scroll. S'arrête une fois stabilisée.
    const loop = () => {
      const target = readTarget();
      current += (target - current) * 0.15;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        render(current);
        running = false;
        raf = 0;
        return;
      }
      render(current);
      raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    render(current);
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [introFrac, steps, textSeg, textSpan]);

  // --- Repli sans animation (prefers-reduced-motion) ----------------------
  if (reduced) {
    return (
      <section className="px-5 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1300px] items-start gap-x-16 gap-y-12 lg:grid-cols-2">
          <div className="lg:sticky lg:top-[12vh]">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--color-ink-2)]">
              <Still src={imageSrc} alt={imageAlt} />
            </div>
          </div>
          <div className="flex flex-col gap-16">
            {chapters.map((c) => (
              <Reveal key={c.index}>
                <article className="max-w-[46ch]">
                  <p className="font-cond text-xs tracking-[0.18em] text-[var(--color-terra)]">
                    {c.index}{" "}
                    <span className="text-[var(--color-bone-faint)]">/ {c.kicker}</span>
                  </p>
                  <h2 className="font-wide mt-4 text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight text-[var(--color-bone)]">
                    {c.title}
                  </h2>
                  <p className="font-sans mt-5 text-[1rem] leading-[1.7] text-[var(--color-bone-dim)]">
                    {c.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // --- Version animée : intro image, puis textes en fondu -----------------
  return (
    <section
      ref={sectionRef}
      aria-label="Le studio en trois temps"
      style={{ height: `${totalScroll + 40}svh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* Image centrée — se révèle à l'intro, puis reste fixe */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={frameRef}
            className="relative aspect-[3/4] w-[74vw] max-w-[19rem] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] will-change-[transform,opacity] sm:w-[46vw] sm:max-w-[23rem] lg:w-[31vw] lg:max-w-[26rem]"
            style={{ opacity: 0 }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-2xl bg-[var(--color-ink-2)] ring-1 ring-[var(--color-line-soft)]">
              <div ref={innerRef} className="h-full w-full will-change-transform">
                <Still src={imageSrc} alt={imageAlt} />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(10,9,8,0.55)] via-transparent to-[rgba(10,9,8,0.18)]" />
            </div>
          </div>
        </div>

        {/* Textes : gauche → droite → gauche, fondu + glissement + scale */}
        {chapters.map((c, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          const colClass =
            side === "left"
              ? "col-span-12 sm:col-span-6 lg:col-span-4"
              : "col-span-12 sm:col-span-6 sm:col-start-7 lg:col-span-4 lg:col-start-9";
          const num = String(i + 1).padStart(2, "0");
          return (
            <div
              key={c.index}
              ref={(el) => {
                layerRefs.current[i] = el;
              }}
              className="absolute inset-0 flex items-center"
              style={{ opacity: 0 }}
              aria-hidden
            >
              <div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 gap-x-6 px-5 sm:px-8 lg:px-12">
                <article
                  ref={(el) => {
                    articleRefs.current[i] = el;
                  }}
                  className={`${colClass} relative rounded-2xl bg-[rgba(10,9,8,0.6)] p-5 backdrop-blur-sm will-change-transform sm:bg-transparent sm:p-0 sm:backdrop-blur-none`}
                >
                  <span
                    ref={(el) => {
                      ghostRefs.current[i] = el;
                    }}
                    aria-hidden
                    className={`pointer-events-none absolute -top-[0.5em] -z-10 hidden select-none font-wide text-[clamp(6rem,11vw,11rem)] leading-none text-[rgba(183,110,78,0.08)] will-change-transform sm:block ${side === "left" ? "-left-3" : "-right-3"}`}
                  >
                    {num}
                  </span>
                  <p className="font-cond text-xs tracking-[0.18em] text-[var(--color-terra)]">
                    {c.index}{" "}
                    <span className="text-[var(--color-bone-faint)]">/ {c.kicker}</span>
                  </p>
                  <h2 className="font-wide mt-4 text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.08] text-[var(--color-bone)]">
                    {c.title}
                  </h2>
                  <p className="font-sans mt-5 max-w-[44ch] text-[1rem] leading-[1.7] text-[var(--color-bone-dim)]">
                    {c.text}
                  </p>
                </article>
              </div>
            </div>
          );
        })}

        {/* Indicateur de progression : trois traits, l'actif en terracotta */}
        <div className="pointer-events-none absolute bottom-[6vh] left-1/2 flex -translate-x-1/2 gap-2">
          {chapters.map((c, i) => (
            <span
              key={c.index}
              className="block h-[2px] w-8 overflow-hidden rounded-full bg-[rgba(110,104,92,0.3)]"
            >
              <span
                ref={(el) => {
                  tickRefs.current[i] = el;
                }}
                className="block h-full origin-left rounded-full bg-[var(--color-terra)]"
                style={{ transform: "scaleX(0)" }}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

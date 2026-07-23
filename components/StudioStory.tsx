"use client";

import { useEffect, useRef, useState } from "react";
import { MaskTitle } from "@/components/MaskTitle";
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

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

// Un chapitre du récit — révélé à l'entrée dans le champ selon la grammaire
// unifiée : filet terracotta qui se trace, label mono qui se resserre, titre
// Gloock en masque ligne-à-ligne, corps qui monte en fondu.
function Chapter({ c, i }: { c: StoryChapter; i: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className={`ss-block ${inView ? "ss-in" : ""} relative max-w-[46ch]`}
    >
      {/* 1 — filet terracotta qui se trace */}
      <span aria-hidden className="ss-rule block h-px w-14 bg-[var(--color-terra)]" />
      {/* 2 — label mono majuscules, letter-spacing qui se resserre */}
      <p className="ss-label font-cond mt-6 text-xs uppercase text-[var(--color-terra)]">
        {c.index}{" "}
        <span className="text-[var(--color-bone-faint)]">/ {c.kicker}</span>
      </p>
      {/* 3 — titre Gloock en révélation par masque */}
      <h2 className="font-wide mt-4 text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.08] text-[var(--color-bone)]">
        <MaskTitle delay={i === 0 ? 120 : 90}>{c.title}</MaskTitle>
      </h2>
      {/* 4 — corps qui monte en fondu */}
      <p className="ss-body font-sans mt-5 text-[1rem] leading-[1.7] text-[var(--color-bone-dim)]">
        {c.text}
      </p>
    </article>
  );
}

// Récit du studio en trois temps. Progression VERTICALE fluide, scroll libre :
// l'image accompagne les chapitres (sticky éditorial, parallaxe douce +
// léger scale piloté en rAF, écriture DOM directe), aucun pin qui retient le
// scroll. Repli statique complet en prefers-reduced-motion.
export function StudioStory({ chapters, imageSrc, imageAlt }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;

    // Parallaxe : dérive verticale douce + léger scale de l'image intérieure,
    // en fonction de l'avancée du récit dans le viewport. Transform seul → GPU.
    const render = () => {
      const rect = section.getBoundingClientRect();
      const span = rect.height + window.innerHeight;
      const p = clamp01((window.innerHeight - rect.top) / span);
      const y = (p - 0.5) * 7; // ±3.5% de dérive
      const scale = 1.04 + p * 0.05;
      inner.style.transform = `translate3d(0,${y.toFixed(2)}%,0) scale(${scale.toFixed(4)})`;
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
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Le studio en trois temps"
      className="px-5 pb-24 sm:px-8 lg:px-10"
    >
      <div className="mx-auto grid max-w-[1300px] items-start gap-x-16 gap-y-14 lg:grid-cols-2">
        {/* Image — sticky éditoriale (le scroll reste libre, l'image suit) */}
        <div className="lg:sticky lg:top-[14vh]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--color-ink-2)] shadow-[0_40px_120px_-50px_rgba(0,0,0,0.8)] ring-1 ring-[var(--color-line-soft)]">
            <div
              ref={innerRef}
              className="h-full w-full will-change-transform"
              style={{ transform: "translate3d(0,0,0) scale(1.06)" }}
            >
              <Still src={imageSrc} alt={imageAlt} />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(10,9,8,0.55)] via-transparent to-[rgba(10,9,8,0.18)]" />
          </div>
        </div>

        {/* Chapitres — révélés l'un après l'autre au scroll naturel */}
        <div className="flex flex-col gap-[16vh] py-[6vh] lg:gap-[26vh] lg:py-[12vh]">
          {chapters.map((c, i) => (
            <Chapter key={c.index} c={c} i={i} />
          ))}
        </div>
      </div>

      <style>{`
        .ss-rule {
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 1.1s var(--ease-out-expo);
        }
        .ss-in .ss-rule { transform: scaleX(1); }
        .ss-label {
          opacity: 0;
          letter-spacing: 0.42em;
          transition:
            opacity 0.9s var(--ease-out-soft) 0.14s,
            letter-spacing 1.1s var(--ease-out-expo) 0.14s;
        }
        .ss-in .ss-label { opacity: 1; letter-spacing: 0.2em; }
        .ss-body {
          opacity: 0;
          transform: translateY(22px);
          filter: blur(6px);
          transition:
            opacity 1s var(--ease-out-soft) 0.32s,
            transform 1.1s var(--ease-out-expo) 0.32s,
            filter 0.9s var(--ease-out-soft) 0.32s;
        }
        .ss-in .ss-body { opacity: 1; transform: none; filter: blur(0); }
        @media (prefers-reduced-motion: reduce) {
          .ss-rule, .ss-label, .ss-body {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            letter-spacing: 0.2em !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { MaskTitle } from "@/components/MaskTitle";
import { values } from "@/lib/site";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// Un « temps » de la méthode — révélé à l'entrée dans le champ selon la
// grammaire unifiée (numéro, titre Gloock masqué, corps en fondu). Le point
// s'allume en terracotta quand la tête de lecture de la ligne l'atteint.
function Temps({
  v,
  i,
  registerDot,
}: {
  v: (typeof values)[number];
  i: number;
  registerDot: (i: number, el: HTMLSpanElement | null) => void;
}) {
  const ref = useRef<HTMLLIElement | null>(null);
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
      { threshold: 0.4, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className={`mr-block ${inView ? "mr-in" : ""} relative pl-14 sm:pl-20`}
    >
      {/* Point sur la ligne — s'allume au passage de la tête de lecture */}
      <span
        ref={(el) => registerDot(i, el)}
        data-state="todo"
        aria-hidden
        className="mr-dot absolute left-[-5px] top-[6px] h-3 w-3 rounded-full sm:left-[3px]"
      />
      <span className="mr-num font-cond block text-xs tracking-[0.2em] text-[var(--color-terra)]">
        0{i + 1}
      </span>
      <h3 className="font-wide mt-3 text-2xl text-[var(--color-bone)] sm:text-3xl">
        <MaskTitle delay={90}>{v.title}</MaskTitle>
      </h3>
      <p className="mr-body font-sans mt-4 max-w-[52ch] text-sm leading-relaxed text-[var(--color-bone-dim)] sm:text-base">
        {v.text}
      </p>
    </li>
  );
}

// « Notre méthode » — séquence VERTICALE, scroll libre. Les quatre temps se
// révèlent un par un à l'entrée, reliés par une ligne terracotta qui se trace
// vers le bas au fil du scroll (tête de lecture = centre du viewport, écriture
// DOM directe en rAF, aucun scroll capturé). Repli statique en reduced-motion.
export function MethodRail() {
  const headRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [headIn, setHeadIn] = useState(false);

  const registerDot = (i: number, el: HTMLSpanElement | null) => {
    dotsRef.current[i] = el;
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = headRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHeadIn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!track || !fill) return;

    // La tête de lecture = centre du viewport, projetée sur la hauteur de la
    // ligne. Le remplissage suit (scaleY), les points passent en actif/done
    // quand la tête les dépasse. Zéro pin : la page défile normalement.
    const render = () => {
      const rect = track.getBoundingClientRect();
      const head = window.innerHeight * 0.5 - rect.top;
      const p = clamp01(head / rect.height);
      fill.style.transform = `scaleY(${p.toFixed(4)})`;

      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        const el = dots[i];
        if (!el) continue;
        const dc = el.getBoundingClientRect();
        const dotHead = window.innerHeight * 0.5 - (dc.top + dc.height / 2);
        el.dataset.state = dotHead >= 0 ? "active" : "todo";
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
  }, []);

  return (
    <section className="mt-28 sm:mt-40">
      <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8 lg:px-10">
        {/* En-tête — grammaire unifiée */}
        <div ref={headRef} className={headIn ? "mr-head-in" : ""}>
          <span
            aria-hidden
            className="mr-head-rule block h-px w-14 bg-[var(--color-terra)]"
          />
        <p className="mr-head-label font-cond mt-6 text-xs uppercase text-[var(--color-bone-faint)]">
          Notre méthode
        </p>
          <h2 className="font-wide mt-4 text-[clamp(2rem,5vw,4rem)] leading-[0.99] text-[var(--color-cream)]">
            <MaskTitle delay={120}>
              Quatre temps, une exigence<span className="dot">.</span>
            </MaskTitle>
          </h2>
        </div>

        {/* Timeline verticale */}
        <div ref={trackRef} className="relative mt-16 sm:mt-20">
          {/* Rail de fond */}
          <span
            aria-hidden
            className="absolute left-0 top-2 bottom-2 w-px bg-[var(--color-line-soft)] sm:left-2"
          />
          {/* Rail terracotta qui se trace vers le bas */}
          <span
            ref={fillRef}
            aria-hidden
            className="mr-fill absolute left-0 top-2 bottom-2 w-px origin-top bg-[var(--color-terra)] sm:left-2"
          />
          <ol className="flex flex-col gap-16 sm:gap-24">
            {values.map((v, i) => (
              <Temps key={v.title} v={v} i={i} registerDot={registerDot} />
            ))}
          </ol>
        </div>
      </div>

      <style>{`
        .mr-fill { transform: scaleY(0); }
        .mr-dot {
          background: var(--color-bone-faint);
          transition:
            background-color 0.5s var(--ease-out-expo),
            transform 0.5s var(--ease-out-expo),
            box-shadow 0.5s var(--ease-out-expo);
        }
        .mr-dot[data-state="active"] {
          background: var(--color-terra);
          transform: scale(1.3);
          box-shadow: 0 0 0 5px rgba(183, 110, 78, 0.12);
        }
        .mr-head-rule {
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 1.1s var(--ease-out-expo);
        }
        .mr-head-in .mr-head-rule { transform: scaleX(1); }
        .mr-head-label {
          opacity: 0;
          letter-spacing: 0.42em;
          transition:
            opacity 0.9s var(--ease-out-soft) 0.14s,
            letter-spacing 1.1s var(--ease-out-expo) 0.14s;
        }
        .mr-head-in .mr-head-label { opacity: 1; letter-spacing: 0.2em; }
        .mr-num, .mr-body {
          opacity: 0;
          transform: translateY(20px);
          transition:
            opacity 1s var(--ease-out-soft),
            transform 1.1s var(--ease-out-expo);
        }
        .mr-num { transition-delay: 0.1s; }
        .mr-body { transition-delay: 0.34s; filter: blur(6px); }
        .mr-in .mr-num, .mr-in .mr-body {
          opacity: 1;
          transform: none;
          filter: blur(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .mr-fill { transform: scaleY(1) !important; }
          .mr-dot {
            background: var(--color-terra) !important;
            transition: none !important;
          }
          .mr-head-rule { transform: scaleX(1) !important; transition: none !important; }
          .mr-head-label {
            opacity: 1 !important;
            letter-spacing: 0.2em !important;
            transition: none !important;
          }
          .mr-num, .mr-body {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

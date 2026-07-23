"use client";

import { useEffect, useRef, useState } from "react";

export type FriseStep = { title: string; text: string };

type Props = {
  steps: FriseStep[];
};

// « Notre méthode » en frise façon Apple : une ligne de connexion, des nœuds
// numérotés (pastille terracotta), chaque étape avec son titre Gloock + un
// texte court. Mobile : défilement horizontal avec scroll-snap et une
// indication discrète. iOS-safe : transform/opacity/overflow/background
// uniquement. prefers-reduced-motion : entrée neutralisée.
export function MethodFrise({ steps }: Props) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      setScrolled(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Masque l'indication de défilement dès que l'utilisateur fait défiler la frise.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      if (track.scrollLeft > 8) setScrolled(true);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={sectionRef} className={`frise ${inView ? "frise-in" : ""}`}>
      <div
        ref={trackRef}
        className="frise-track flex snap-x snap-mandatory gap-0 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible"
      >
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="frise-step relative w-[78vw] max-w-[19rem] shrink-0 snap-start pr-8 sm:w-auto sm:max-w-none sm:pr-8"
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            {/* Ligne de connexion vers le nœud suivant (sauf le dernier) */}
            {i < steps.length - 1 && (
              <span aria-hidden className="frise-line" />
            )}
            {/* Nœud numéroté — pastille terracotta */}
            <span className="frise-node font-cond">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-wide mt-6 text-2xl leading-[1.1] text-[var(--color-bone)]">
              {s.title}
            </h3>
            <p className="font-sans mt-3 text-sm leading-relaxed text-[var(--color-bone-dim)]">
              {s.text}
            </p>
          </div>
        ))}
      </div>

      {/* Indication de défilement — mobile uniquement */}
      <p
        className={`frise-hint font-cond mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[var(--color-bone-faint)] sm:hidden ${
          scrolled ? "frise-hint-off" : ""
        }`}
      >
        Faites défiler <span aria-hidden>→</span>
      </p>

      <style>{`
        .frise-track {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .frise-track::-webkit-scrollbar { display: none; }

        .frise-node {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          background: var(--color-terra);
          color: var(--color-ink);
          font-size: 0.7rem;
          letter-spacing: 0.12em;
        }

        /* Ligne de connexion : part du centre du nœud et rejoint le nœud
           suivant. Largeur 100% = une colonne d'étape (les colonnes sont de
           largeur égale, en scroll mobile comme en grille desktop). */
        .frise-line {
          position: absolute;
          top: 1.25rem;            /* centre vertical du nœud (2.5rem / 2) */
          left: 1.25rem;           /* centre horizontal du nœud */
          width: 100%;
          height: 1px;
          background: var(--color-line-soft);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 1s var(--ease-out-expo);
        }
        .frise-in .frise-line { transform: scaleX(1); }

        .frise-step {
          opacity: 0;
          transform: translateY(16px);
          transition:
            opacity 0.8s var(--ease-out-soft),
            transform 0.9s var(--ease-out-expo);
        }
        .frise-in .frise-step { opacity: 1; transform: none; }

        .frise-hint {
          opacity: 1;
          transition: opacity 0.5s var(--ease-out-soft);
        }
        .frise-hint-off { opacity: 0; }

        @media (prefers-reduced-motion: reduce) {
          .frise-step, .frise-line, .frise-hint {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .frise-line { transform: scaleX(1) !important; }
        }
      `}</style>
    </div>
  );
}

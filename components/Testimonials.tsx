"use client";

import { useEffect, useRef, useState } from "react";
import { MaskTitle } from "@/components/MaskTitle";
import { testimonials, type Testimonial } from "@/lib/site";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

// Étoile (chemin unique, réutilisé pour le fond terne et le remplissage terra).
function Star({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 17.3l-6.16 3.7 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.48 4.73 1.64 7.03z" />
    </svg>
  );
}

// Carte animée : au scroll, le texte apparaît, les étoiles se remplissent
// une à une (1→5), puis le trait terracotta se déroule et le nom apparaît.
function Card({ t, index }: { t: Testimonial; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // prefers-reduced-motion : on affiche tout immédiatement, sans transitions.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setOn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const base = index * 140; // léger décalage entre les cartes
  const starsStart = base + 220; // les étoiles suivent de près le texte
  const lineStart = starsStart + 5 * 90 + 100; // après la dernière étoile
  const nameStart = lineStart + 160; // séquence totale < 1,3 s

  return (
    <figure
      ref={ref}
      className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-line-soft)] bg-[var(--color-ink-2)] p-8 will-change-[transform,opacity] sm:p-9"
      style={{
        transition: reduced
          ? "none"
          : `opacity 900ms ${EASE}, transform 900ms ${EASE}`,
        transitionDelay: on ? `${base}ms` : "0ms",
        opacity: on ? 1 : 0,
        transform: on ? "translateY(0)" : "translateY(22px)",
      }}
    >
      {/* Étoiles — remplissage séquentiel */}
      <div
        className="mb-6 flex gap-1.5"
        role="img"
        aria-label="Note : 5 sur 5"
      >
        {Array.from({ length: 5 }).map((_, s) => (
          <span key={s} className="relative inline-flex">
            <Star className="text-[var(--color-line)]" />
            <span
              className="absolute inset-0 inline-flex text-[var(--color-terra)]"
              style={{
                transition: reduced
                  ? "none"
                  : `opacity 360ms ${EASE}, transform 420ms ${EASE}`,
                transitionDelay: on ? `${starsStart + s * 90}ms` : "0ms",
                opacity: on ? 1 : 0,
                transformOrigin: "bottom center",
                transform: on
                  ? "scale(1) translateY(0)"
                  : "scale(0.55) translateY(3px)",
              }}
            >
              <Star />
            </span>
          </span>
        ))}
      </div>

      {/* Témoignage — apparaît en premier */}
      <blockquote
        className="font-sans text-[15px] leading-relaxed text-[var(--color-cream)] sm:text-base"
        style={{
          transition: reduced
            ? "none"
            : `opacity 760ms ${EASE}, transform 760ms ${EASE}, filter 640ms ${EASE}`,
          transitionDelay: on ? `${base + 120}ms` : "0ms",
          opacity: on ? 1 : 0,
          filter: on || reduced ? "blur(0)" : "blur(6px)",
          transform: on ? "translateY(0)" : "translateY(8px)",
        }}
      >
        <span
          aria-hidden
          className="font-wide mr-1 align-[-0.15em] text-xl text-[var(--color-terra)]"
        >
          &laquo;
        </span>
        {t.quote}
        <span
          aria-hidden
          className="font-wide ml-1 align-[-0.15em] text-xl text-[var(--color-terra)]"
        >
          &raquo;
        </span>
      </blockquote>

      {/* Trait terracotta (se déroule) puis nom du client */}
      <figcaption className="mt-auto flex items-center gap-3 pt-9">
        <span
          className="h-px w-7 origin-left bg-[var(--color-terra)]"
          style={{
            transition: reduced ? "none" : `transform 560ms ${EASE}`,
            transitionDelay: on ? `${lineStart}ms` : "0ms",
            transform: on ? "scaleX(1)" : "scaleX(0)",
          }}
        />
        <span
          className="font-cond text-sm text-[var(--color-bone)]"
          style={{
            transition: reduced
              ? "none"
              : `opacity 520ms ${EASE}, transform 520ms ${EASE}`,
            transitionDelay: on ? `${nameStart}ms` : "0ms",
            opacity: on ? 1 : 0,
            transform: on ? "translateX(0)" : "translateX(-8px)",
          }}
        >
          {t.name}
        </span>
      </figcaption>
    </figure>
  );
}

// Section preuve sociale : avis clients (Google) en cartes éditoriales.
// En-tête aligné sur la grammaire unifiée (filet terracotta qui se trace, label
// mono qui se resserre, titre Gloock en masque), cartes conservées avec leur
// remplissage d'étoiles séquentiel.
export function Testimonials() {
  const headRef = useRef<HTMLDivElement | null>(null);
  const [headIn, setHeadIn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHeadIn(true);
      return;
    }
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

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1600px]">
        <div
          ref={headRef}
          className={`${headIn ? "tm-head-in" : ""} flex flex-col items-center text-center`}
        >
          <span
            aria-hidden
            className="tm-head-rule block h-px w-14 bg-[var(--color-terra)]"
          />
          <p className="tm-head-label font-cond mt-6 text-xs uppercase text-[var(--color-bone-faint)]">
            Ils nous font confiance
          </p>
          <h2 className="font-wide mt-4 text-[clamp(2rem,6vw,4rem)] leading-[1] text-[var(--color-bone)]">
            <MaskTitle delay={120} className="text-center">
              Ce qu&apos;ils en disent<span className="dot">.</span>
            </MaskTitle>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-20 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Card key={t.name} t={t} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        .tm-head-rule {
          transform: scaleX(0);
          transition: transform 1.1s var(--ease-out-expo);
        }
        .tm-head-in .tm-head-rule { transform: scaleX(1); }
        .tm-head-label {
          opacity: 0;
          letter-spacing: 0.42em;
          transition:
            opacity 0.9s var(--ease-out-soft) 0.14s,
            letter-spacing 1.1s var(--ease-out-expo) 0.14s;
        }
        .tm-head-in .tm-head-label { opacity: 1; letter-spacing: 0.2em; }
        @media (prefers-reduced-motion: reduce) {
          .tm-head-rule { transform: scaleX(1) !important; transition: none !important; }
          .tm-head-label {
            opacity: 1 !important;
            letter-spacing: 0.2em !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

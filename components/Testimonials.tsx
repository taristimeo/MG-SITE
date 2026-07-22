"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
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
  const lineStart = starsStart + 5 * 120 + 120; // après la dernière étoile
  const nameStart = lineStart + 260;

  return (
    <figure
      ref={ref}
      className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-line-soft)] bg-[var(--color-ink-2)] p-8 sm:p-9"
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
                  : `opacity 340ms ${EASE}, transform 340ms ${EASE}`,
                transitionDelay: on ? `${starsStart + s * 120}ms` : "0ms",
                opacity: on ? 1 : 0,
                transform: on ? "scale(1)" : "scale(0.3)",
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
            : `opacity 700ms ${EASE}, transform 700ms ${EASE}`,
          transitionDelay: on ? `${base}ms` : "0ms",
          opacity: on ? 1 : 0,
          transform: on ? "translateY(0)" : "translateY(12px)",
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
export function Testimonials() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <p className="font-cond text-center text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Ils nous font confiance
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="font-wide mt-4 text-center text-[clamp(2rem,6vw,4rem)] leading-[1] text-[var(--color-bone)]">
            Ce qu&apos;ils en disent<span className="dot">.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-20 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Card key={t.name} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

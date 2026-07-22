"use client";

import { useEffect, useRef, useState } from "react";
import { DevisModal } from "@/components/DevisModal";

// La bande devis + un liseré terracotta qui SE TRACE (0.6 s expo) quand la
// bande entre dans le champ : elle « s'arme » avant même le survol. Le liseré
// s'efface au survol (la bande devient alors tout terracotta). En
// prefers-reduced-motion : liseré visible d'emblée, sans animation.
export function ContactBand() {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setArmed(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="group relative">
      <DevisModal
        label={
          <span className="inline-flex items-baseline justify-center gap-4 sm:gap-6">
            Demander un devis
            <span
              aria-hidden
              className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-hover:text-[var(--color-ink)]"
            >
              →
            </span>
          </span>
        }
        className="group font-wide block w-full rounded-3xl border border-[var(--color-line-soft)] bg-[var(--color-ink-2)] px-6 py-16 text-center text-[clamp(1.7rem,5.5vw,4.2rem)] leading-none text-[var(--color-cream)] transition-[background-color,border-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[var(--color-terra)] hover:bg-[var(--color-terra)] hover:text-[var(--color-ink)] active:scale-[0.995] sm:py-24"
      />
      {/* Liseré « armé » — inséré des coins arrondis pour ne pas déborder */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-10 right-10 h-[2px] origin-left bg-[var(--color-terra)] transition-[transform,opacity] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-0"
        style={{ transform: armed ? "scaleX(1)" : "scaleX(0)" }}
      />
    </div>
  );
}

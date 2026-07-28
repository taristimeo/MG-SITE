"use client";

import { useEffect, useRef, useState } from "react";
import { DevisModal } from "@/components/DevisModal";

// La bande devis + un liseré terracotta qui SE TRACE (expo, origine gauche)
// quand la bande entre dans le champ : elle « s'arme » avant même le survol.
// Au survol, la bande se remplit de terracotta et le liseré se dissout en se
// soulevant — comme absorbé par la teinte. En prefers-reduced-motion : liseré
// visible d'emblée, sans aucune animation (repli statique complet).
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
    <div ref={ref} data-armed={armed} className="cb-band group relative">
      <DevisModal
        ariaLabel="Demander un devis"
        label={
          <span className="flex flex-col items-center gap-4 sm:gap-5">
            {/* Surtitre : lève l'objection avant même le clic */}
            <span className="font-cond cb-sub text-[10px] tracking-[0.28em] text-[var(--color-bone-faint)] sm:text-[11px]">
              Gratuit et sans engagement
            </span>
            <span className="inline-flex items-baseline justify-center gap-4 sm:gap-6">
              Demander un devis
              <span
                aria-hidden
                className="cb-arrow inline-block group-hover:translate-x-4 group-hover:text-[var(--color-ink)]"
              >
                →
              </span>
            </span>
            {/* Rappel court : ce qu'on attend de vous, et sous quel délai */}
            <span className="font-sans cb-sub max-w-[46ch] text-[13px] leading-relaxed text-[var(--color-bone-dim)] sm:text-[15px]">
              Quelques lignes sur votre projet suffisent — on vous répond sous
              24&nbsp;h.
            </span>
          </span>
        }
        className="group font-wide block w-full rounded-3xl border border-[var(--color-line-soft)] bg-[var(--color-ink-2)] px-6 py-14 text-center text-[clamp(1.7rem,5.5vw,4.2rem)] leading-none text-[var(--color-cream)] transition-[background-color,border-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[var(--color-terra)] hover:bg-[var(--color-terra)] hover:text-[var(--color-ink)] active:scale-[0.995] sm:py-16"
      />
      {/* Liseré « armé » — inséré des coins arrondis pour ne pas déborder. Le
          mouvement (trace + dissolution) est piloté par le <style> ci-dessous. */}
      <span
        aria-hidden
        className="cb-liser pointer-events-none absolute bottom-3 left-10 right-10 h-[2px] bg-[var(--color-terra)]"
      />
      <style>{cbStyles}</style>
    </div>
  );
}

// CSS statique, scopé sous .cb-band : transform + opacity uniquement.
// Le liseré se trace de la gauche (expo, léger retard pour orchestrer après
// l'entrée de la bande) et se dissout vers le haut au survol, sans retard.
const cbStyles = `
.cb-band .cb-liser {
  transform: scaleX(0);
  transform-origin: left center;
  opacity: 1;
  will-change: transform, opacity;
  transition:
    transform 0.72s cubic-bezier(0.16, 1, 0.3, 1) 0.14s,
    opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.cb-band[data-armed="true"] .cb-liser {
  transform: scaleX(1);
}
.cb-band:hover .cb-liser {
  transform: scaleX(1) translateY(-3px);
  opacity: 0;
  transition-delay: 0s;
}
/* Surtitre et rappel : ils suivent la bascule terracotta au survol. */
.cb-band .cb-sub {
  transition: color 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.cb-band:hover .cb-sub {
  color: var(--color-ink);
}
/* La flèche file vers l'avant au survol (seul mouvement du bloc). */
.cb-band .cb-arrow {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
@media (prefers-reduced-motion: reduce) {
  .cb-band .cb-liser {
    transition: none;
    transform: scaleX(1);
    opacity: 1;
  }
  .cb-band:hover .cb-liser {
    transform: scaleX(1);
    opacity: 0;
  }
  .cb-band .cb-sub,
  .cb-band .cb-arrow {
    transition: none;
  }
  /* Pas de déplacement de la flèche si le mouvement est refusé. */
  .cb-band:hover .cb-arrow {
    transform: none;
  }
}
`;

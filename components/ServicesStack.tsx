"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { services } from "@/lib/site";

// « Ce qu'on fait » : les 5 prestations en INDEX DÉPLIANT.
// On abandonne ici l'empilement collant (déjà porté par le manifeste et les
// réalisations) au profit d'un autre langage : une table des matières
// éditoriale. Chaque prestation est une ligne pleine largeur ouverte par un
// filet qui se TRACE de gauche à droite ; le contenu se déplie ensuite en
// cascade (repère, phrase, appel). En desktop les lignes alternent de colonne
// (quinconce) et entrent latéralement — la page occupe toute sa largeur et le
// regard zigzague au lieu de subir une pile. Au survol, la ligne se déplie
// franchement : fond qui s'allume, contenu qui glisse, filet en terracotta.
// 100 % transform / opacity / background → robuste iOS (aucun filter ni
// clip-path). prefers-reduced-motion : tout est posé d'emblée, sans transition.
export function ServicesStack() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-row]"));
    if (!rows.length) return;

    // Mouvement réduit : on révèle tout immédiatement, aucun observateur.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const row of rows) row.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    for (const row of rows) io.observe(row);
    return () => io.disconnect();
  }, []);

  return (
    <section className="px-5 py-14 sm:px-8 sm:py-32 lg:px-10">
      <style>{SERVICES_CSS}</style>

      <div className="mx-auto max-w-[1400px]">
        <div className="text-center">
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Ce qu&apos;on fait
          </p>
          <h2 className="font-wide mt-4 text-[clamp(1.9rem,5vw,3.6rem)] leading-[1] text-[var(--color-bone)]">
            Cinq façons de raconter<span className="dot">.</span>
          </h2>
        </div>

        <div ref={rootRef} className="mt-10 sm:mt-20">
          <ol>
            {services.map((s, i) => {
              // Quinconce desktop : une ligne sur deux bascule dans la colonne
              // de droite, et entre depuis le côté correspondant.
              const right = i % 2 === 1;
              return (
                <li
                  key={s.id}
                  data-row
                  className="svc-row"
                  style={{ "--svc-x": right ? "26px" : "-26px" } as CSSProperties}
                >
                  {/* Filet d'ouverture : se trace au moment où la ligne entre */}
                  <span
                    aria-hidden
                    className="svc-rule block h-px w-full bg-[var(--color-line-soft)]"
                  />

                  <Link
                    href="/banc/realisations"
                    aria-label={`Voir les films — ${s.title}`}
                    className="svc-link relative block py-8 sm:py-12"
                  >
                    {/* Fond qui s'allume au survol (desktop) */}
                    <span
                      aria-hidden
                      className="svc-glow pointer-events-none absolute inset-0 -mx-4 rounded-2xl bg-[var(--color-ink-2)] sm:-mx-6"
                    />

                    <span className="svc-fold relative block lg:grid lg:grid-cols-2 lg:gap-x-16">
                      <span
                        className={`block ${right ? "lg:col-start-2" : "lg:col-start-1"}`}
                      >
                        {/* Repère : numéro + intitulé de la prestation */}
                        <span className="svc-in svc-meta font-cond flex items-baseline gap-4 text-[11px] tracking-[0.22em]">
                          <span className="text-[var(--color-terra)]">
                            {s.index}
                          </span>
                          <span className="text-[var(--color-bone-faint)]">
                            {s.title}
                          </span>
                        </span>

                        {/* La phrase — le cœur de la ligne */}
                        <span className="svc-in svc-phrase font-wide mt-4 block max-w-[24ch] text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.14] text-[var(--color-cream)]">
                          {s.line}
                        </span>

                        {/* L'appel, conservé sur chaque ligne */}
                        <span className="svc-in svc-cta font-cond mt-5 block text-[11px] tracking-[0.2em] text-[var(--color-bone-dim)]">
                          Voir les films{" "}
                          <span aria-hidden className="svc-arrow inline-block">
                            →
                          </span>
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>

          {/* Filet de clôture de l'index */}
          <div data-row className="svc-row">
            <span
              aria-hidden
              className="svc-rule block h-px w-full bg-[var(--color-line-soft)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CSS local à l'index dépliant — gardé ici (pas dans globals.css) car il
   n'existe que pour ce composant. Uniquement transform / opacity /
   background-color : rien qui puisse casser un rendu iOS. */
const SERVICES_CSS = `
.svc-rule {
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 1.1s var(--ease-out-expo), background-color 0.4s var(--ease-out-expo);
}
.svc-row.is-in .svc-rule { transform: scaleX(1); }

.svc-in {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 0.9s var(--ease-out-soft),
    transform 1s var(--ease-out-expo);
  will-change: opacity, transform;
}
.svc-row.is-in .svc-in { opacity: 1; transform: none; }
.svc-meta { transition-delay: 0.1s; }
.svc-phrase { transition-delay: 0.2s; }
.svc-cta { transition-delay: 0.34s; }

/* Desktop : entrée latérale, dans le sens de la colonne (quinconce) */
@media (min-width: 1024px) {
  .svc-in { transform: translateY(18px) translateX(var(--svc-x, 0px)); }
  .svc-row.is-in .svc-in { transform: none; }
}

/* Survol (pointeur fin uniquement) : la ligne se déplie */
.svc-glow {
  opacity: 0;
  transition: opacity 0.5s var(--ease-out-expo);
}
.svc-fold {
  transition: transform 0.6s var(--ease-out-expo);
}
.svc-arrow {
  transition: transform 0.5s var(--ease-out-expo);
}
@media (hover: hover) and (pointer: fine) {
  .svc-link:hover .svc-glow { opacity: 1; }
  .svc-link:hover .svc-fold { transform: translateX(14px); }
  .svc-link:hover .svc-arrow { transform: translateX(6px); }
  .svc-link:hover .svc-cta { color: var(--color-terra); }
  .svc-row:hover .svc-rule { background-color: var(--color-terra); }
}
.svc-link:focus-visible .svc-glow { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .svc-rule { transform: scaleX(1); transition: none; }
  .svc-in { opacity: 1; transform: none; transition: none; }
  .svc-fold, .svc-arrow, .svc-glow { transition: none; }
}
`;

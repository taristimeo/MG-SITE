import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { RevealTitle } from "@/components/RevealTitle";
import { WorksMosaic } from "@/components/WorksMosaic";
import { projects, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Réalisations — Films & vidéos",
  description: `Portfolio de ${site.name}, studio de production vidéo à ${site.city} : films corporate, événementiel, clips, tourisme et publicité. Découvrez nos réalisations.`,
  alternates: { canonical: "/realisations" },
};

// Page « Réalisations » : écran-titre resserré (le catalogue affleure sous le
// pli), puis « la colonne montée » — mosaïque éditoriale en deux colonnes
// décalées, cartouches sous les médias, parallaxe différentielle.
export default function RealisationsPage() {
  return (
    <>
      <section className="px-5 pb-10 pt-24 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-[1100px] text-center">
          {/* Entrée en trois temps : surtitre, puis le mot (RevealTitle), puis
              le compteur — chacun légèrement décalé pour une pose feutrée. */}
          <Reveal>
            <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
              Le travail
            </p>
          </Reveal>
          <RevealTitle
            text="Réalisations"
            className="mt-3 text-[clamp(2.4rem,7vw,6rem)] text-[var(--color-cream)]"
          />
          <Reveal delay={300}>
            <p className="font-cond mt-6 text-[11px] tracking-[0.3em] text-[var(--color-bone-faint)]">
              ({String(projects.length).padStart(2, "0")} films) · Défiler{" "}
              {/* Indice de défilement : dérive verticale très douce, courbe de
                  pulse (pas expo), coupée en mouvement réduit. */}
              <span aria-hidden className="scroll-hint inline-block">
                ↓
              </span>
            </p>
          </Reveal>
        </div>
        <style>{`
          .scroll-hint {
            animation: mg-scroll-hint 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes mg-scroll-hint {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(3px); }
          }
          @media (prefers-reduced-motion: reduce) {
            .scroll-hint { animation: none; }
          }
        `}</style>
      </section>

      <WorksMosaic />
    </>
  );
}

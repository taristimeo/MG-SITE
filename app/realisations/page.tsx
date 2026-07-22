import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { RevealTitle } from "@/components/RevealTitle";
import { WorksList } from "@/components/WorksList";
import { projects, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Réalisations — Films & vidéos",
  description: `Portfolio de ${site.name}, studio de production vidéo à ${site.city} : films corporate, événementiel, clips, tourisme et publicité. Découvrez nos réalisations.`,
  alternates: { canonical: "/realisations" },
};

// Page dédiée « Réalisations » : index aligné à gauche, type de projet à
// droite, aperçu de l'image au survol.
export default function RealisationsPage() {
  return (
    <section className="px-5 pb-20 pt-24 sm:px-8 sm:pb-28 sm:pt-32 lg:px-10 lg:pt-40">
      <div className="mx-auto max-w-[1100px] text-center">
        <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
          Le travail
        </p>
        <RevealTitle
          text="Réalisations"
          className="mt-3 text-[clamp(2.4rem,7vw,6rem)] text-[var(--color-cream)]"
        />
        <Reveal delay={300}>
          <p className="font-cond mt-6 text-[11px] tracking-[0.3em] text-[var(--color-bone-faint)]">
            ({String(projects.length).padStart(2, "0")} films)
          </p>
        </Reveal>

        <div className="mt-14">
          <WorksList />
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { RevealTitle } from "@/components/RevealTitle";
import { WorksCinema } from "@/components/WorksCinema";
import { projects, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Réalisations — Films & vidéos",
  description: `Portfolio de ${site.name}, studio de production vidéo à ${site.city} : films corporate, événementiel, clips, tourisme et publicité. Découvrez nos réalisations.`,
  alternates: { canonical: "/realisations" },
};

// Page « Réalisations » : après l'écran-titre, chaque film occupe un écran
// entier (preview plein cadre, générique bas de cadre) et le scroll s'aimante
// de film en film — comme on passe d'une salle à l'autre.
export default function RealisationsPage() {
  return (
    <>
      <section className="px-5 pb-4 pt-24 sm:px-8 sm:pt-32 lg:pt-40">
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
              ({String(projects.length).padStart(2, "0")} films) · Défiler{" "}
              <span aria-hidden>↓</span>
            </p>
          </Reveal>
        </div>
      </section>

      <WorksCinema />
    </>
  );
}

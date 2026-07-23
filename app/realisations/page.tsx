import type { Metadata } from "next";
import { RevealTitle } from "@/components/RevealTitle";
import { Reveal } from "@/components/Reveal";
import { WorksApple } from "@/components/WorksApple";
import { projects, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Réalisations — Films & vidéos",
  description: `Portfolio de ${site.name}, studio de production vidéo à ${site.city} : films corporate, événementiel, clips, tourisme et publicité. Découvrez nos réalisations.`,
  alternates: { canonical: "/realisations" },
};

// Page « Réalisations » — vitrine VISUELLE : un en-tête court et animé, puis les
// films en GRANDES dalles immersives (WorksApple), aperçu vidéo en vue. L'image
// et le mouvement portent la page ; le texte se réduit à l'essentiel.
// 100 % transform + opacity → robuste iOS (aucun filter/clip-path sur les vidéos).
export default function RealisationsPage() {
  // Bornes d'années dérivées des données — pour la ligne de compte, sans texte superflu.
  const years = projects.map((p) => Number(p.year));
  const from = Math.min(...years);
  const to = Math.max(...years);
  const span = from === to ? `${from}` : `${from}–${to}`;

  return (
    <section className="px-5 pb-24 pt-28 sm:px-8 sm:pt-36 lg:px-10">
      {/* En-tête court, centré, animé */}
      <header className="mx-auto mb-14 max-w-[1080px] text-center sm:mb-20">
        <Reveal>
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Le travail
          </p>
        </Reveal>

        <RevealTitle
          text="Réalisations"
          className="mt-4 text-[clamp(2.6rem,10vw,5.5rem)] leading-[1] text-[var(--color-cream)]"
        />

        <Reveal delay={700}>
          <p className="font-cond mt-6 text-[11px] tracking-[0.25em] text-[var(--color-bone-dim)]">
            {projects.length} films <span className="text-[var(--color-terra)]">·</span> {span}
          </p>
        </Reveal>
      </header>

      {/* Vitrine — grandes dalles immersives, aperçu vidéo, entrée au scroll */}
      <WorksApple items={projects} />
    </section>
  );
}

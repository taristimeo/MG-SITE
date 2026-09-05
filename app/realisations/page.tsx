import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { RevealTitle } from "@/components/RevealTitle";
import { ContactSheet } from "@/components/bench/ContactSheet";
import { projects, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Réalisations — Films & vidéos",
  description: `Portfolio de ${site.name}, studio de production vidéo à ${site.city} : films corporate, événementiel, clips, tourisme et publicité. Découvrez nos réalisations.`,
  alternates: { canonical: "/realisations" },
};

/**
 * RÉALISATIONS — la planche-contact.
 *
 * L'index n'est pas une grille de plus : c'est la planche de tirage du studio.
 * Une amorce de bobine en tête de page, les films alignés, numérotés, perforés,
 * et le crayon gras qui cercle celui qu'on regarde.
 */
export default function RealisationsPage() {
  const years = projects.map((p) => Number(p.year));
  const span = `${Math.min(...years)}–${Math.max(...years)}`;

  return (
    <section className="px-5 pb-24 pt-28 sm:px-8 sm:pt-36 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        {/* En-tête : l'amorce de bobine */}
        <header className="mb-14 flex flex-col items-center gap-8 sm:mb-20 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-center sm:text-left">
            <Reveal>
              <p className="font-cond text-[11px] tracking-[0.25em] text-[var(--color-bone-faint)]">
                Planche-contact — {span}
              </p>
            </Reveal>
            <RevealTitle
              text="Réalisations"
              className="mt-3 text-[clamp(2.6rem,9vw,5.5rem)] leading-[1] text-[var(--color-cream)]"
            />
          </div>

          <Reveal delay={420}>
            <Leader count={projects.length} />
          </Reveal>
        </header>

        <ContactSheet />
      </div>
    </section>
  );
}

/**
 * L'amorce : la mire de début de bobine, avec le nombre de films au centre.
 * Tracée en SVG — nette à toute taille, sans un octet d'image.
 */
function Leader({ count }: { count: number }) {
  return (
    <div
      className="relative h-[104px] w-[104px] shrink-0"
      aria-label={`${count} films`}
      role="img"
    >
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
        <circle
          cx="50"
          cy="50"
          r="47"
          stroke="var(--color-line)"
          strokeWidth="1"
        />
        <circle
          cx="50"
          cy="50"
          r="34"
          stroke="var(--color-line-soft)"
          strokeWidth="1"
        />
        {/* La croix de visée */}
        <path
          d="M50 0V26M50 74v26M0 50h26M74 50h26"
          stroke="var(--color-line)"
          strokeWidth="1"
        />
        {/* Le balai qui tourne, comme un décompte d'amorce */}
        <g className="leader-sweep">
          <path
            d="M50 50V3"
            stroke="var(--color-terra)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
      <span
        aria-hidden
        className="font-wide absolute inset-0 flex items-center justify-center text-[2.1rem] leading-none text-[var(--color-bone)]"
      >
        {count}
      </span>
    </div>
  );
}

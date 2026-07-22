import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { CardMedia } from "@/components/CardMedia";
import { CardCursor } from "@/components/CardCursor";
import {
  projectPreview,
  projectThumb,
  type Project,
} from "@/lib/site";

// Sélection éditoriale de l'accueil : chaque film est une grande rangée cinéma
// (média 16/10 + bloc titre), alternée gauche/droite comme une programmation de
// festival. Le film vedette (FeatureReel) porte le n° 01 ; la numérotation ici
// reprend à startIndex. Aperçu vidéo au survol (CardMedia), curseur « VOIR ».
export function WorksShowcase({
  items,
  startIndex = 2,
}: {
  items: Project[];
  startIndex?: number;
}) {
  return (
    <CardCursor>
      <div className="flex flex-col gap-16 sm:gap-24 lg:gap-28">
        {items.map((p, i) => {
          const flipped = i % 2 === 1;
          return (
            <Reveal key={p.slug}>
              <Link
                href={`/realisations/${p.slug}`}
                data-card
                className="group grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-12"
              >
                {/* Média — large, cinéma */}
                <div
                  className={`relative aspect-[16/10] overflow-hidden rounded-2xl bg-[var(--color-ink-2)] lg:col-span-8 ${
                    flipped ? "lg:order-2" : ""
                  }`}
                >
                  <div className="h-full w-full transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]">
                    <CardMedia
                      src={projectThumb(p)}
                      videoSrc={projectPreview(p)}
                      alt={`${p.title} — ${p.category} · film Mauvais Grain, studio vidéo à Bordeaux`}
                    />
                  </div>
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>

                {/* Bloc titre — numéroté, aligné sur le bord du média */}
                <div
                  className={`lg:col-span-4 ${
                    flipped ? "lg:order-1 lg:text-right" : ""
                  }`}
                >
                  <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-terra)]">
                    {String(startIndex + i).padStart(2, "0")}
                  </p>
                  <h3 className="font-wide mt-4 text-[clamp(1.8rem,4.5vw,3.3rem)] leading-[1.02] text-[var(--color-bone)] transition-colors duration-300 group-hover:text-[var(--color-cream)]">
                    {p.title}
                  </h3>
                  <p className="font-cond mt-4 text-[11px] tracking-[0.2em] text-[var(--color-bone-faint)]">
                    {p.category} · {p.year}
                  </p>
                  <p className="font-cond mt-7 text-[11px] tracking-[0.2em] text-[var(--color-bone-dim)] transition-colors duration-300 group-hover:text-[var(--color-terra)]">
                    Voir le film <span aria-hidden>→</span>
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </CardCursor>
  );
}

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Parallax } from "@/components/Parallax";
import { CardMedia } from "@/components/CardMedia";
import { CardCursor } from "@/components/CardCursor";
import {
  projectPreview,
  projectThumb,
  type Project,
} from "@/lib/site";

// Sélection éditoriale de l'accueil : chaque film est une grande rangée cinéma
// (média 16/10 + bloc titre), alternée gauche/droite comme une programmation de
// festival, numérotée à partir de startIndex. Aperçu vidéo au survol
// (CardMedia), curseur « VOIR ».
//
// Chorégraphie d'entrée : le média se dévoile (Reveal), et le bloc titre suit
// en cascade échelonnée (numéro → titre → méta → lien). Au scroll, le média
// dérive en micro-parallaxe (Parallax, ±7px) dans son cadre — d'où un léger
// sur-cadrage de base (scale 1.06) pour ne jamais découvrir les bords, même sur
// mobile ; le survol pousse le zoom à 1.1.
export function WorksShowcase({
  items,
  startIndex = 1,
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
            <Link
              key={p.slug}
              href={`/realisations/${p.slug}`}
              data-card
              className="group grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-12"
            >
              {/* Média — large, cinéma. Entre en premier ; le Reveal EST la
                  cellule de grille pour ne pas casser le layout. */}
              <Reveal
                className={`relative aspect-[16/10] overflow-hidden rounded-2xl bg-[var(--color-ink-2)] lg:col-span-8 ${
                  flipped ? "lg:order-2" : ""
                }`}
              >
                <Parallax amount={14} className="h-full w-full">
                  <div className="h-full w-full scale-[1.06] transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.1]">
                    <CardMedia
                      src={projectThumb(p)}
                      videoSrc={projectPreview(p)}
                      alt={`${p.title} — ${p.category} · film Mauvais Grain, studio vidéo à Bordeaux`}
                    />
                  </div>
                </Parallax>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              </Reveal>

              {/* Bloc titre — numéroté, aligné sur le bord du média ; entre en
                  cascade échelonnée après le média. */}
              <div
                className={`lg:col-span-4 ${
                  flipped ? "lg:order-1 lg:text-right" : ""
                }`}
              >
                <Reveal
                  as="p"
                  delay={140}
                  className="font-cond text-xs tracking-[0.25em] text-[var(--color-terra)]"
                >
                  {String(startIndex + i).padStart(2, "0")}
                </Reveal>
                {/* Le hover (transition-colors) reste sur l'enfant : ne pas le
                    poser sur l'élément .reveal, dont il écraserait la transition
                    d'entrée (opacity/transform/filter). */}
                <Reveal delay={230} className="mt-4">
                  <h3 className="font-wide text-[clamp(1.8rem,4.5vw,3.3rem)] leading-[1.02] text-[var(--color-bone)] transition-colors duration-300 group-hover:text-[var(--color-cream)]">
                    {p.title}
                  </h3>
                </Reveal>
                <Reveal
                  as="p"
                  delay={340}
                  className="font-cond mt-4 text-[11px] tracking-[0.2em] text-[var(--color-bone-faint)]"
                >
                  {p.category} · {p.year}
                </Reveal>
                <Reveal delay={440} className="mt-7">
                  <p className="font-cond text-[11px] tracking-[0.2em] text-[var(--color-bone-dim)] transition-colors duration-300 group-hover:text-[var(--color-terra)]">
                    Voir le film <span aria-hidden>→</span>
                  </p>
                </Reveal>
              </div>
            </Link>
          );
        })}
      </div>
    </CardCursor>
  );
}

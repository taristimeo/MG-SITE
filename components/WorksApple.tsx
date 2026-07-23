import Link from "next/link";
import { FilmReveal } from "@/components/FilmReveal";
import { CardMedia } from "@/components/CardMedia";
import { CardCursor } from "@/components/CardCursor";
import { projectThumb, projectPreview, type Project } from "@/lib/site";

// Vitrine « façon Apple » : chaque film en grande dalle immersive, plein
// cadre, coins très arrondis, titre posé en bas sur un dégradé — l'image
// domine, le texte respire. Aperçu vidéo en vue (CardMedia), curseur « VOIR ».
// Entrée en fondu-montée quand la dalle arrive à l'écran (FilmReveal → is-in) :
// les films se révèlent l'un après l'autre au scroll. 100 % transform +
// opacity → robuste iOS.
export function WorksApple({
  items,
  startIndex = 1,
}: {
  items: Project[];
  startIndex?: number;
}) {
  return (
    <CardCursor>
      <div className="mx-auto flex max-w-[1080px] flex-col gap-4 sm:gap-6">
        {items.map((p, i) => (
          <FilmReveal key={p.slug} className="apple-rise">
            <Link
              href={`/realisations/${p.slug}`}
              data-card
              className="group relative block aspect-[4/5] overflow-hidden rounded-[26px] bg-[var(--color-ink-2)] ring-1 ring-white/[0.08] sm:aspect-[16/10]"
            >
              {/* Média — léger sur-cadrage de base, zoom doux au survol. */}
              <div className="absolute inset-0 scale-[1.05] transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.1]">
                <CardMedia
                  src={projectThumb(p)}
                  videoSrc={projectPreview(p)}
                  alt={`${p.title} — ${p.category} · film Mauvais Grain, studio vidéo à Bordeaux`}
                />
              </div>

              {/* Dégradé : lisibilité du titre en bas, léger voile en haut. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/25"
              />

              {/* Numéro discret en haut. */}
              <span className="font-cond absolute left-6 top-5 text-[11px] tracking-[0.22em] text-white/45">
                {String(startIndex + i).padStart(2, "0")}
              </span>

              {/* Bloc titre posé en bas. */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                <p className="font-cond text-[11px] tracking-[0.25em] text-[var(--color-terra)]">
                  {p.category} · {p.year}
                </p>
                <h3 className="font-wide mt-2 text-[clamp(1.7rem,7vw,2.9rem)] leading-[1.02] text-white">
                  {p.title}
                </h3>
                <p className="font-cond mt-4 text-[11px] tracking-[0.2em] text-white/60 transition-colors duration-300 group-hover:text-[var(--color-terra)]">
                  Voir le film <span aria-hidden>→</span>
                </p>
              </div>
            </Link>
          </FilmReveal>
        ))}
      </div>
    </CardCursor>
  );
}

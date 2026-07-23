import Link from "next/link";
import { FilmReveal } from "@/components/FilmReveal";
import { CardMedia } from "@/components/CardMedia";
import { CardCursor } from "@/components/CardCursor";
import { projectThumb, projectPreview, type Project } from "@/lib/site";

// Pellicule — les réalisations dans une bande de film qui SE DÉPLOIE d'un seul
// tenant : toute la bande (perforations + photogrammes) se déroule vers le bas
// comme un rouleau qui s'ouvre (scaleY depuis le haut), puis ses perforations
// continuent de défiler. Que du transform + background (aucun filtre) →
// robuste iOS. Aperçu vidéo au survol / en vue (CardMedia).
export function FilmStrip({ items }: { items: Project[] }) {
  return (
    <CardCursor>
      <FilmReveal className="film-strip-unfurl">
        <div className="film-strip">
          {items.map((p, i) => (
            <Link
              key={p.slug}
              href={`/realisations/${p.slug}`}
              data-card
              className="film-cell group block"
            >
              <div className="film-frame">
                <span className="film-edgecode">
                  MG · {String(i + 1).padStart(3, "0")}
                </span>
                <div className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
                  <CardMedia
                    src={projectThumb(p)}
                    videoSrc={projectPreview(p)}
                    alt={`${p.title} — ${p.category} · film Mauvais Grain, studio vidéo à Bordeaux`}
                  />
                </div>
              </div>
              <div className="film-caption">
                <span className="fc-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="fc-ttl">{p.title}</span>
                <span className="fc-meta">
                  {p.category} · {p.year}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </FilmReveal>
    </CardCursor>
  );
}

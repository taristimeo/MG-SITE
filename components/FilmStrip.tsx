import Link from "next/link";
import { FilmReveal } from "@/components/FilmReveal";
import { CardMedia } from "@/components/CardMedia";
import { CardCursor } from "@/components/CardCursor";
import { projectThumb, projectPreview, type Project } from "@/lib/site";

// Pellicule — les réalisations présentées comme une bande de film qui s'assemble
// vers le bas au scroll : perforations sur les bords, chaque film dans un
// photogramme, cartouche en interframe. Chaque photogramme se pose (FilmReveal,
// transform + opacité — robuste iOS). Aperçu vidéo au survol / en vue (CardMedia).
export function FilmStrip({ items }: { items: Project[] }) {
  return (
    <CardCursor>
      <div className="film-strip">
        {items.map((p, i) => (
          <FilmReveal key={p.slug} className="film-cell">
            <Link href={`/realisations/${p.slug}`} data-card className="group block">
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
          </FilmReveal>
        ))}
      </div>
    </CardCursor>
  );
}

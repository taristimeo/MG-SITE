import Link from "next/link";
import { FilmReveal } from "@/components/FilmReveal";
import { CardMedia } from "@/components/CardMedia";
import { CardCursor } from "@/components/CardCursor";
import { projectThumb, projectPreview, type Project } from "@/lib/site";

// Pellicule — les réalisations présentées comme une bande de film qui se DÉROULE
// vers le bas : perforations sur les bords, et chaque photogramme dont l'image
// descend dans sa fenêtre (comme la pellicule qui se déploie) quand il entre à
// l'écran, la légende suivant en interframe. Que du transform + overflow —
// robuste iOS. Aperçu vidéo au survol / en vue (CardMedia).
export function FilmStrip({ items }: { items: Project[] }) {
  return (
    <CardCursor>
      <div className="film-strip">
        {items.map((p, i) => (
          <FilmReveal key={p.slug} className="film-cell">
            <Link href={`/realisations/${p.slug}`} data-card className="group block">
              {/* Fenêtre du photogramme : masque (overflow) qui laisse
                  descendre l'image depuis le haut. */}
              <div className="film-frame">
                <div className="film-pull">
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
              </div>
              <div className="film-caption film-cap-reveal">
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

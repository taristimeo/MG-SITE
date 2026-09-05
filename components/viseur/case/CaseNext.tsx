import Link from "next/link";
import { projectThumb, type Project } from "@/lib/site";

/**
 * LE FILM SUIVANT.
 *
 * Une dalle pleine hauteur qui appelle le film d'après : on ne finit jamais
 * sur un cul-de-sac, on repart dans le viseur — mais un cran plus loin.
 */
export function CaseNext({ project }: { project: Project }) {
  return (
    <section className="vsc-next" aria-labelledby="vsc-next-h">
      <Link href={`/viseur/${project.slug}`} className="vsc-next-link">
        <span
          className="vsc-next-bg"
          style={{ backgroundImage: `url("${projectThumb(project)}")` }}
          aria-hidden
        />
        <span className="vsc-next-veil" aria-hidden />

        <span className="vsc-next-in">
          <span className="vsc-kicker" data-reveal>
            Film suivant
            <em aria-hidden />
            {project.category.toUpperCase()}
          </span>
          <h2 id="vsc-next-h" className="vsc-next-t" data-reveal>
            {project.title}
          </h2>
          <span className="vsc-next-m" data-reveal>
            {project.client}
            <em aria-hidden />
            {project.year}
          </span>
          <span className="vsc-next-go" data-reveal>
            Voir l&apos;étude de cas
            <u aria-hidden>→</u>
          </span>
        </span>
      </Link>
    </section>
  );
}

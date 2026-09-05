import { projectCredits, projectThumb, type Project } from "@/lib/site";

/**
 * L'OUVERTURE.
 *
 * Le plan du film tenu en fond, très assombri — c'est la même image que
 * celle cadrée dans le viseur une seconde plus tôt : on ne change pas de
 * lieu, on entre dedans. Par-dessus, les repères d'angle du viseur, le
 * titre en Gloock, la ligne de méta et le générique.
 */
export function CaseOpening({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const credits = projectCredits(project);
  const n = (v: number) => String(v).padStart(2, "0");

  return (
    <section className="vsc-open">
      <div
        className="vsc-open-bg"
        style={{ backgroundImage: `url("${projectThumb(project)}")` }}
        aria-hidden
      />
      <div className="vsc-open-veil" aria-hidden />

      <span className="vsc-corner tl" aria-hidden />
      <span className="vsc-corner tr" aria-hidden />
      <span className="vsc-corner bl" aria-hidden />
      <span className="vsc-corner br" aria-hidden />

      <div className="vsc-open-in">
        <p className="vsc-kicker" data-reveal>
          Étude de cas
          <em aria-hidden />
          <b>
            {n(index + 1)} / {n(total)}
          </b>
        </p>

        <h1 className="vsc-ttl" data-reveal>
          {project.title}
        </h1>

        <p className="vsc-marks" data-reveal>
          <b>{project.category.toUpperCase()}</b>
          <em aria-hidden />
          {project.client.toUpperCase()}
          <em aria-hidden />
          {project.year}
        </p>

        <dl className="vsc-credits" data-reveal>
          {credits.map((c) => (
            <div key={`${c.role}-${c.name}`} className="vsc-credit">
              <dt>{c.role}</dt>
              <dd>{c.name}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="vsc-scrollhint" aria-hidden>
        <span className="vsc-scrollhint-line" />
        Faites défiler
      </p>
    </section>
  );
}

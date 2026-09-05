/**
 * LE RÉCIT EN TROIS CHAPITRES.
 *
 * Le projet, notre approche, le résultat. C'est le cœur de l'étude de cas :
 * ce qui prouve qu'on réfléchit avant de filmer. Trois blocs numérotés,
 * chacun ouvert par un filet terracotta, révélés au défilement.
 */
export function CaseChapters({
  chapters,
}: {
  chapters: { label: string; body: string }[];
}) {
  return (
    <section className="vsc-story" aria-labelledby="vsc-story-h">
      <p className="vsc-seclabel" data-reveal>
        <span className="vsc-seclabel-n">Le récit</span>
      </p>
      <h2 id="vsc-story-h" className="sr-only">
        Le récit du film
      </h2>

      <ol className="vsc-chapters">
        {chapters.map((c, i) => (
          <li key={c.label} className="vsc-chapter" data-reveal>
            <div className="vsc-chapter-head">
              <span className="vsc-chapter-rule" aria-hidden />
              <span className="vsc-chapter-n" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="vsc-chapter-t">{c.label}</h3>
            </div>
            <p className="vsc-chapter-b">{c.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

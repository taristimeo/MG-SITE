import Link from "next/link";
import { NameGrain } from "@/components/grain/NameGrain";
import { Stage } from "@/components/grain/Stage";
import { Rise } from "@/components/Rise";
import { projects, services, site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* I. Le nom, en grain. */}
      <section className="relative h-[100dvh] w-full" aria-label="Mauvais Grain">
        <NameGrain />
        <div className="t-legend pointer-events-none absolute right-[var(--gutter)] top-[calc(var(--nav-h)+8px)] text-right">
          <p>Studio de production vidéo</p>
          <p>{site.city} — depuis {site.founded}</p>
        </div>
        <div className="t-legend pointer-events-none absolute bottom-[calc(var(--gutter)*1.15)] right-[var(--gutter)] hidden text-right md:block">
          <p>Films corporate, événementiels,</p>
          <p>immobiliers, tourisme, clips.</p>
        </div>
      </section>

      {/* II. Six films, un cadre. */}
      <Stage projects={projects} />

      {/* III. Une phrase. */}
      <section className="gutter pt-28 md:pt-44">
        <Rise>
          <p className="t-legend mb-6">Le regard</p>
          <p className="t-display max-w-[16ch]">
            Une histoire bien <span className="text-[var(--color-terra)]">racontée</span> ne s&apos;oublie pas.
          </p>
        </Rise>
        <Rise className="mt-10 max-w-[52ch] md:ml-[38%]">
          <p className="t-body">
            Mauvais Grain est un studio de production vidéo basé à Bordeaux. Un réalisateur,
            un interlocuteur unique, de l&apos;écoute au tirage final. On observe plutôt que de
            mettre en scène, on accompagne plutôt que de diriger, on raconte plutôt que de vendre.
          </p>
        </Rise>
      </section>

      {/* IV. Les métiers, en table. */}
      <section className="gutter pt-28 md:pt-44" aria-labelledby="metiers">
        <Rise>
          <p id="metiers" className="t-legend mb-6">
            Ce qu&apos;on filme
          </p>
          <div className="rule" />
        </Rise>
        <ol>
          {services.map((s, i) => (
            <Rise as="li" key={s.id} delay={Math.min(i, 4) * 60}>
              <Link
                href={`/realisations?f=${s.id}`}
                className="row-link grid grid-cols-[2.6em_1fr] items-baseline gap-x-4 py-5 md:grid-cols-[6rem_1fr_1fr] md:py-7"
              >
                <span className="t-legend">{s.index}</span>
                <span className="t-title">{s.title}</span>
                <span className="t-body col-start-2 mt-2 max-w-[42ch] md:col-start-3 md:mt-0">{s.line}</span>
              </Link>
              <div className="rule" />
            </Rise>
          ))}
        </ol>
      </section>
    </>
  );
}

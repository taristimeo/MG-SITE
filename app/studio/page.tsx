import type { Metadata } from "next";
import { FilmCanvas } from "@/components/grain/FilmCanvas";
import { Rise } from "@/components/Rise";
import { clients, founder, processSteps, site, testimonials, values } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio",
  description: `${site.name}, studio de production vidéo fondé par ${site.founder} à ${site.city}. Observer avant de filmer, de l'écoute à la livraison.`,
  alternates: { canonical: "/studio" },
};

export default function StudioPage() {
  return (
    <article className="pt-[calc(var(--nav-h)+24px)] md:pt-[calc(var(--nav-h)+48px)]">
      {/* L'affiche. */}
      <header className="gutter">
        <p className="t-legend mb-5">Le studio</p>
        <h1 className="t-giant m-0 max-w-[10ch]">Observer avant de filmer.</h1>
      </header>

      {/* Le portrait, développé. */}
      <section className="gutter mt-12 md:mt-20 md:grid md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-7">
          <FilmCanvas src="/photo-studio.jpg" alt={`${founder.name}, ${founder.role}`} className="aspect-[4/3] w-full md:aspect-video" />
        </div>
        <div className="mt-8 md:col-span-5 md:col-start-8 md:mt-0 md:self-end">
          <Rise>
            <p className="t-legend">{founder.name}</p>
            <p className="t-legend opacity-60">{founder.role}</p>
            <ul className="t-title mt-8 space-y-2">
              {founder.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </Rise>
        </div>
      </section>

      {/* Le texte. */}
      <section className="gutter mt-24 md:mt-40 md:grid md:grid-cols-12 md:gap-x-8">
        <Rise className="md:col-span-5">
          <p className="t-display max-w-[14ch]">Un réalisateur, un interlocuteur, un film.</p>
        </Rise>
        <Rise className="mt-10 md:col-span-6 md:col-start-7 md:mt-2">
          <p className="t-body max-w-[56ch]">
            {site.name} démarre à {site.city} en {site.founded} avec une idée simple : chaque
            commande mérite une vraie écriture. Clip, corporate, événement, territoire — le
            format change, l&apos;exigence reste. Avant de toucher une caméra, on pose des
            questions. Ce que vous faites, pourquoi vous le faites, à qui vous parlez. C&apos;est
            de là que vient le film.
          </p>
          <p className="t-body mt-6 max-w-[56ch]">
            L&apos;exigence ne se voit pas toujours. Elle est dans le repérage qu&apos;on refait,
            le plan qu&apos;on garde, la couleur qu&apos;on reprend image par image. Ce travail
            discret sépare une vidéo correcte d&apos;un film dont on se souvient.
          </p>
        </Rise>
      </section>

      {/* La méthode, en six temps. */}
      <section className="gutter mt-24 md:mt-40" aria-labelledby="methode">
        <Rise>
          <p id="methode" className="t-legend mb-6">
            La méthode
          </p>
          <div className="rule" />
        </Rise>
        <ol>
          {processSteps.map((s, i) => (
            <Rise as="li" key={s.label} delay={Math.min(i, 4) * 50}>
              <div className="grid grid-cols-[2.6em_1fr] items-baseline gap-x-4 py-5 md:grid-cols-[6rem_1fr_1fr] md:py-7">
                <span className="t-legend">{String(i + 1).padStart(2, "0")}</span>
                <span className="t-title">{s.label}</span>
                <span className="t-body col-start-2 mt-2 max-w-[44ch] md:col-start-3 md:mt-0">{s.text}</span>
              </div>
              <div className="rule" />
            </Rise>
          ))}
        </ol>
      </section>

      {/* Les engagements. */}
      <section className="gutter mt-24 md:mt-40 md:grid md:grid-cols-12 md:gap-x-8" aria-labelledby="valeurs">
        <Rise className="md:col-span-4">
          <p id="valeurs" className="t-legend">
            Ce qu&apos;on vous doit
          </p>
        </Rise>
        <div className="mt-6 grid grid-cols-1 gap-10 md:col-span-8 md:mt-0 md:grid-cols-2">
          {values.map((v, i) => (
            <Rise key={v.title} delay={(i % 2) * 80}>
              <p className="t-title">{v.title}</p>
              <p className="t-body mt-3 max-w-[40ch]">{v.text}</p>
            </Rise>
          ))}
        </div>
      </section>

      {/* Les clients : des noms, pas des logos. */}
      <section className="gutter mt-24 md:mt-40" aria-labelledby="clients">
        <Rise>
          <p id="clients" className="t-legend mb-6">
            Ils nous ont fait confiance
          </p>
          <p className="t-display max-w-[22ch] leading-[1.05]">
            {clients.map((c, i) => (
              <span key={c.name}>
                {c.name}
                {i < clients.length - 1 && <span className="text-[var(--color-terra)]">, </span>}
              </span>
            ))}
            .
          </p>
        </Rise>
      </section>

      {/* Ce qu'ils en disent. */}
      <section className="gutter mt-24 md:mt-40" aria-labelledby="avis">
        <Rise>
          <p id="avis" className="t-legend mb-6">
            Ce qu&apos;ils en disent
          </p>
          <div className="rule" />
        </Rise>
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-8">
          {testimonials.map((t, i) => (
            <Rise as="figure" key={t.name} className="m-0 py-8 md:py-10" delay={i * 80}>
              <blockquote className="m-0">
                <p className="t-body">« {t.quote} »</p>
              </blockquote>
              <figcaption className="t-legend mt-5">{t.name}</figcaption>
            </Rise>
          ))}
        </div>
        <div className="rule" />
      </section>
    </article>
  );
}

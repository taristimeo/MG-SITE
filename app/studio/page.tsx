import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { RevealTitle } from "@/components/RevealTitle";
import { MaskTitle } from "@/components/MaskTitle";
import { Still } from "@/components/Poster";
import { ScrollText } from "@/components/ScrollText";
import { MethodFrise } from "@/components/MethodFrise";
import { Process } from "@/components/Process";
import { Clients } from "@/components/Clients";
import { Testimonials } from "@/components/Testimonials";
import { site, values } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio — Vidéaste & réalisateur à Bordeaux",
  description: `${site.name}, studio de production vidéo fondé par ${site.founder} à ${site.city}. Notre approche : observer avant de filmer, du repérage à la post-production.`,
  alternates: { canonical: "/studio" },
};

const chapters = [
  {
    index: "(01)",
    kicker: "Notre approche",
    title: "D'abord, comprendre",
    text: "Avant de toucher une caméra, on pose des questions. Ce que vous faites, pourquoi vous le faites, à qui vous parlez. C'est de là que vient le film — pas d'un brief, pas d'un template.",
  },
  {
    index: "(02)",
    kicker: "Nos débuts",
    title: "Le commencement",
    text: `${site.name} démarre à ${site.city} avec une seule idée en tête : que chaque commande mérite une vraie écriture. Clip, corporate, territoire — le format change, l'exigence reste.`,
  },
  {
    index: "(03)",
    kicker: "Notre exigence",
    title: "Ce qui ne se voit pas",
    text: "L'exigence ne se voit pas toujours. Elle est dans le repérage qu'on refait, le plan qu'on garde, la couleur qu'on reprend image par image. Ce travail discret, c'est lui qui sépare une vidéo correcte d'un film dont on se souvient.",
  },
];

export default function StudioPage() {
  return (
    <>
      {/* Hero */}
      <section className="flex min-h-[80svh] flex-col justify-center px-5 pt-20 sm:min-h-[88svh] sm:px-8 sm:pt-24 lg:px-10">
        <div className="mx-auto w-full max-w-[1100px] text-center">
          <Reveal>
            <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
              Le studio — depuis{" "}
              <span className="text-[var(--color-terra)]">{site.founded}</span>
            </p>
          </Reveal>
          <RevealTitle
            text="Studio"
            className="mt-3 text-[clamp(2.4rem,7.5vw,6.5rem)] text-[var(--color-cream)]"
          />
          <Reveal delay={500}>
            <p className="font-cond mt-12 text-[0.7rem] tracking-[0.25em] text-[var(--color-bone-faint)]">
              Défiler <span aria-hidden>↓</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Photo du studio — sous le hero */}
      <section className="px-5 sm:px-8 lg:px-10">
        <Reveal>
          <div className="relative mx-auto aspect-[16/10] w-full max-w-[1100px] overflow-hidden rounded-2xl bg-[var(--color-ink-2)] shadow-[0_40px_120px_-50px_rgba(0,0,0,0.8)] ring-1 ring-[var(--color-line-soft)] sm:aspect-[21/9]">
            <Still
              src="/photo-studio.jpg"
              alt={`${site.founder} — ${site.name}`}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(10,9,8,0.5)] via-transparent to-transparent" />
          </div>
        </Reveal>
      </section>

      {/* Notre approche — récit en trois temps, corps animé au scroll */}
      <section
        aria-label="Le studio en trois temps"
        className="mx-auto max-w-[640px] px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
      >
        <div className="flex flex-col gap-[16vh] sm:gap-[20vh]">
          {chapters.map((c, i) => (
            <article key={c.index} className="max-w-[46ch]">
              <Reveal>
                <span
                  aria-hidden
                  className="block h-px w-14 bg-[var(--color-terra)]"
                />
              </Reveal>
              <p className="font-cond mt-6 text-xs uppercase tracking-[0.2em] text-[var(--color-terra)]">
                {c.index}{" "}
                <span className="text-[var(--color-bone-faint)]">
                  / {c.kicker}
                </span>
              </p>
              <h2 className="font-wide mt-4 text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.08] text-[var(--color-bone)]">
                <MaskTitle delay={i === 0 ? 120 : 90}>{c.title}</MaskTitle>
              </h2>
              <ScrollText
                text={c.text}
                className="font-sans mt-6 text-[1.15rem] leading-[1.75]"
              />
            </article>
          ))}
        </div>
      </section>

      {/* Clients */}
      <Clients />

      {/* Avis clients */}
      <Testimonials />

      {/* Énoncé */}
      <section className="px-5 sm:px-8 lg:px-10">
        <Reveal>
          <p className="font-wide mx-auto max-w-[24ch] text-center text-[clamp(1.5rem,3.6vw,3rem)] leading-[1.14] text-[var(--color-bone)]">
            {site.name} transforme une idée en histoire visuelle, du repérage à la
            post-production avec la même exigence.
          </p>
        </Reveal>
      </section>

      {/* ── Notre méthode ─────────────────────────────────────────────── */}
      <section className="mx-auto mt-32 max-w-[1100px] px-5 pb-4 sm:mt-40 sm:px-8 lg:px-10">
        {/* En-tête de section */}
        <div className="mb-16 sm:mb-20">
          <h2 className="font-wide overflow-hidden text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.99] text-[var(--color-cream)]">
            <MaskTitle delay={80}>Notre méthode</MaskTitle>
          </h2>
        </div>

        {/* 4 étapes en frise */}
        <MethodFrise steps={values} />
      </section>

      {/* ── Le process : du repérage à l'étalonnage ───────────────────── */}
      <section className="mx-auto mt-32 max-w-[1100px] px-5 pb-4 sm:mt-40 sm:px-8 lg:px-10">
        <div className="mb-16 sm:mb-20">
          <p className="font-cond mb-4 text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Le process
          </p>
          <h2 className="font-wide overflow-hidden text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.99] text-[var(--color-cream)]">
            <MaskTitle delay={80}>Du repérage à l&apos;étalonnage</MaskTitle>
          </h2>
        </div>
        <Process />
      </section>

    </>
  );
}

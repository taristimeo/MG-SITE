import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { RevealTitle } from "@/components/RevealTitle";
import { MaskTitle } from "@/components/MaskTitle";
import { StudioStory } from "@/components/StudioStory";
import { Process } from "@/components/Process";
import { Clients } from "@/components/Clients";
import { Testimonials } from "@/components/Testimonials";
import { DevisModal } from "@/components/DevisModal";
import { Still } from "@/components/Poster";
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
      {/* Hero — habité par une image du territoire du studio, très assombrie */}
      <section className="relative flex min-h-[80svh] flex-col justify-center overflow-hidden px-5 pt-20 sm:min-h-[88svh] sm:px-8 sm:pt-24 lg:px-10">
        <div aria-hidden className="absolute inset-0">
          <div className="h-full w-full opacity-30">
            <Still src="/projects/the-shape-of-vastness/1.jpg" alt="" />
          </div>
          <div className="absolute inset-0 bg-[rgba(10,9,8,0.4)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,9,8,0.85)] via-transparent to-[var(--color-ink)]" />
        </div>
        <div className="relative mx-auto w-full max-w-[1100px] text-center">
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

      {/* Scroll narratif */}
      <StudioStory
        chapters={chapters}
        imageSrc="/photo-studio.jpg"
        imageAlt={`${site.founder} — ${site.name}`}
      />

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

        {/* 4 étapes en grille */}
        <div className="grid grid-cols-1 gap-px bg-[var(--color-line-soft)] sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="group bg-[var(--color-ink)] p-8 transition-colors duration-500 hover:bg-[var(--color-ink-2)] sm:p-10">
                <div className="flex items-start justify-between">
                  <span className="font-cond text-xs tracking-[0.2em] text-[var(--color-terra)]">
                    0{i + 1}
                  </span>
                  <span className="font-cond text-[10px] tracking-[0.15em] text-[var(--color-bone-faint)] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    ↗
                  </span>
                </div>
                <h3 className="font-wide mt-6 text-2xl text-[var(--color-bone)] transition-colors duration-300 group-hover:text-[var(--color-terra)]">
                  {v.title}
                </h3>
                <p className="font-sans mt-4 text-sm leading-relaxed text-[var(--color-bone-dim)]">
                  {v.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
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

      {/* ── La suite s'écrit avec vous ────────────────────────────────── */}
      <section className="px-5 pb-10 pt-28 text-center sm:pt-40">
        <Reveal>
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Et maintenant ?
          </p>
          <p className="font-wide mx-auto mt-4 max-w-[16ch] text-[clamp(1.9rem,5vw,3.8rem)] leading-[1.08] text-[var(--color-cream)]">
            Écrivons votre histoire<span className="dot">.</span>
          </p>
          <div className="mt-10 flex justify-center">
            <DevisModal label="Démarrer un projet" />
          </div>
        </Reveal>
      </section>
    </>
  );
}

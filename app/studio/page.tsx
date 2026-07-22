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
import { HeroFade } from "@/components/HeroFade";
import { HeroZoom } from "@/components/HeroZoom";
import { Manifesto } from "@/components/Manifesto";
import { MethodRail } from "@/components/MethodRail";
import { Parallax } from "@/components/Parallax";
import { founder, site } from "@/lib/site";

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
            <HeroZoom>
              <Still src="/projects/the-shape-of-vastness/1.jpg" alt="" />
            </HeroZoom>
          </div>
          <div className="absolute inset-0 bg-[rgba(10,9,8,0.4)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,9,8,0.85)] via-transparent to-[var(--color-ink)]" />
        </div>
        <HeroFade>
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
        </HeroFade>
      </section>

      {/* Scroll narratif */}
      <StudioStory
        chapters={chapters}
        imageSrc="/projects/silhouette/1.jpg"
        imageAlt={`Silhouette — image extraite d'un film ${site.name}`}
      />

      {/* ── Le regard derrière la caméra ──────────────────────────────── */}
      <section className="px-5 py-28 sm:px-8 sm:py-40 lg:px-10">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <Parallax amount={30}>
              <div className="mx-auto aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-2xl bg-[var(--color-ink-2)]">
                <Still
                  src="/photo-studio.jpg"
                  alt={`${founder.name} — ${founder.role} de ${site.name}`}
                />
              </div>
            </Parallax>
          </Reveal>

          <div className="text-center lg:text-left">
            <Reveal>
              <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
                Le regard derrière la caméra
              </p>
            </Reveal>
            <div className="font-wide mt-8 text-[clamp(1.55rem,3.6vw,2.9rem)] leading-[1.16] text-[var(--color-cream)]">
              {founder.lines.map((l, i) => (
                <MaskTitle key={l} delay={140 + i * 150}>
                  <span>{l}</span>
                </MaskTitle>
              ))}
            </div>
            <Reveal delay={620}>
              <p className="font-cond mt-10 text-[11px] tracking-[0.22em] text-[var(--color-bone-dim)]">
                <span
                  aria-hidden
                  className="mr-3 inline-block h-px w-8 bg-[var(--color-terra)] align-middle"
                />
                {founder.name} · {founder.role}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Énoncé — révélé mot à mot, épinglé plein écran (scrollytelling) */}
      <Manifesto
        kicker="Le studio"
        text={`${site.name} transforme une idée en histoire visuelle, du repérage à la post-production, avec la même exigence.`}
        accents={["exigence"]}
      />

      {/* ── Notre méthode — rail horizontal piloté par le scroll ───────── */}
      <MethodRail />

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

      {/* Clients — défilé de logos */}
      <div className="mt-24 sm:mt-32">
        <Clients />
      </div>

      {/* Avis clients */}
      <Testimonials />

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

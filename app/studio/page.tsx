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
      {/* Hero — porté par un paysage du studio : coucher de soleil sur l'océan
          (The Shape of Vastness), déjà dans les tons terracotta de la marque. */}
      <section className="relative flex min-h-[80svh] flex-col justify-center overflow-hidden px-5 pt-20 sm:min-h-[88svh] sm:px-8 sm:pt-24 lg:px-10">
        <div aria-hidden className="absolute inset-0">
          <div className="h-full w-full">
            <HeroZoom>
              <Still src="/projects/the-shape-of-vastness/2.jpg" alt="" />
            </HeroZoom>
          </div>
          {/* Voiles légers : on garde la photo lumineuse, juste assez de contraste
              pour la lisibilité du titre, puis fondu vers l'encre en bas. */}
          <div className="absolute inset-0 bg-[rgba(10,9,8,0.28)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,9,8,0.4)] via-[rgba(10,9,8,0.12)] to-[var(--color-ink)]" />
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
            <Reveal delay={700}>
              <p className="font-cond mt-12 text-[0.7rem] tracking-[0.25em] text-[var(--color-bone-faint)]">
                Défiler{" "}
                <span aria-hidden className="studio-scroll-hint inline-block">
                  ↓
                </span>
              </p>
            </Reveal>
            {/* Indice de défilement : la flèche respire vers le bas, lentement,
                puis se retire. Repli statique en prefers-reduced-motion. */}
            <style>{`
              @keyframes studioScrollHint {
                0%, 100% { transform: translateY(0); opacity: .55; }
                50% { transform: translateY(5px); opacity: 1; }
              }
              .studio-scroll-hint {
                animation: studioScrollHint 2.4s var(--ease-out-soft, ease-in-out) 1.6s infinite;
                will-change: transform, opacity;
              }
              @media (prefers-reduced-motion: reduce) {
                .studio-scroll-hint { animation: none; }
              }
            `}</style>
          </div>
        </HeroFade>
      </section>

      {/* Scroll narratif — image intérim : la silhouette du studio (en attente
          de la vraie photo de Timéo, à intégrer ici dès réception). */}
      <StudioStory
        chapters={chapters}
        imageSrc="/photo-studio.jpg"
        imageAlt={`${founder.name} — ${founder.role} de ${site.name}`}
      />

      {/* ── Le regard derrière la caméra ──────────────────────────────────
          Énoncé centré : la photo de Timéo porte déjà le hero, on ne la
          redécoupe pas ici en portrait (ce qui trahirait son cadrage 16:9).
          Cette section affirme sa manière de faire, en toutes lettres. */}
      <section className="px-5 py-28 text-center sm:px-8 sm:py-40 lg:px-10">
        <div className="mx-auto max-w-[900px]">
          <Reveal>
            <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
              Le regard derrière la caméra
            </p>
          </Reveal>
          {/* Reveal (et non MaskTitle) : ces phrases reviennent à la ligne
              sur mobile — le masque ligne-à-ligne les ferait se chevaucher.
              gap explicite pour un rythme net quel que soit l'écran. */}
          <div className="mx-auto mt-8 flex max-w-[16ch] flex-col gap-3 font-wide text-[clamp(1.7rem,4.4vw,3.4rem)] leading-[1.18] text-[var(--color-cream)] sm:gap-2">
            {founder.lines.map((l, i) => (
              <Reveal key={l} delay={140 + i * 130}>
                {l}
              </Reveal>
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
      </section>

      {/* Énoncé — statique ici (le scrollytelling mot-à-mot reste propre à
          l'accueil) : simple révélation d'une phrase forte. */}
      <Manifesto
        kicker="Le studio"
        text={`${site.name} transforme une idée en histoire visuelle, du repérage à la post-production, avec la même exigence.`}
        accents={["exigence"]}
        pinned={false}
      />

      {/* ── Notre méthode — rail horizontal piloté par le scroll ───────── */}
      <MethodRail />

      {/* ── Le process : du repérage à l'étalonnage ───────────────────── */}
      <section className="mx-auto mt-24 max-w-[1100px] px-5 pb-4 sm:mt-32 sm:px-8 lg:px-10">
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
      <div className="mt-20 sm:mt-24">
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

import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { MaskTitle } from "@/components/MaskTitle";
import { WordReveal } from "@/components/WordReveal";
import { Manifesto } from "@/components/Manifesto";
import { Stats } from "@/components/Stats";
import { Clients } from "@/components/Clients";
import { ContactBand } from "@/components/ContactBand";
import { Moviola } from "@/components/bench/Moviola";
import { FilmChapters } from "@/components/bench/FilmChapters";
import { GradeSplit } from "@/components/bench/GradeSplit";
import { GrainLoupe } from "@/components/bench/GrainLoupe";
import { ServiceIndex } from "@/components/bench/ServiceIndex";
import { clients, manifesto, projects, site, type Project } from "@/lib/site";

export const metadata: Metadata = {
  title: "Brouillon 01 — Le banc de montage",
  alternates: { canonical: "/banc" },
};

// Les trois films projetés en salle — un par famille, pour donner le ton sans
// rejouer l'index complet (qui vit sur /realisations).
const SALLE = ["the-sound-of-discovery", "silhouette", "graduation"] as const;

const films: Project[] = SALLE.map((slug) =>
  projects.find((p) => p.slug === slug),
).filter((p): p is Project => p !== undefined);

/**
 * ACCUEIL — « Le banc de montage ».
 *
 * Le site est monté comme un film : un écran-titre où l'on manipule la
 * pellicule, une salle qu'on éteint pour projeter, puis l'atelier — la couleur,
 * la matière, les métiers — avant le générique de fin. Le fond bascule du crème
 * de la charte au noir chaud selon qu'on lit ou qu'on regarde.
 */
export default function Home() {
  return (
    <>
      {/* 01 — L'écran-titre : la moviola */}
      <Moviola films={projects} />

      {/* 02 — Le regard : le manifeste, révélé mot à mot */}
      <div data-chapter="Le regard" data-chapter-index="02">
        <Manifesto
          kicker={manifesto.kicker}
          text={manifesto.text}
          accents={[...manifesto.accents]}
        />
      </div>

      {/* 03·04·05 — La salle : on éteint, on projette */}
      <FilmChapters films={films} />

      {/* 06 — L'atelier : ce qui ne se voit pas */}
      <Atelier />

      {/* 07 — Les métiers */}
      <Metiers />

      {/* 08 — Les repères */}
      <section className="px-5 py-16 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <Stats
            items={[
              { display: site.founded, label: `naissance du studio à ${site.city}` },
              { value: projects.length, label: "films phares au portfolio" },
              { value: 5, decimals: 1, label: "note des avis Google", accent: "★" },
              { value: clients.length, label: "clients accompagnés" },
            ]}
          />
        </div>
      </section>

      <Clients />

      {/* 09 — Générique de fin */}
      <section
        data-chapter="Générique de fin"
        data-chapter-index="09"
        className="px-5 pb-24 pt-10 sm:px-8 sm:pb-32 lg:px-10"
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 text-center sm:mb-16">
            <Reveal>
              <p className="font-cond text-[11px] tracking-[0.25em] text-[var(--color-bone-faint)]">
                La suite s&apos;écrit avec vous
              </p>
            </Reveal>
            <h2 className="font-wide mt-4 text-[clamp(1.9rem,5vw,3.6rem)] leading-[1] text-[var(--color-bone)]">
              <MaskTitle delay={80}>Racontez-nous votre histoire</MaskTitle>
            </h2>
          </div>
          <Reveal delay={200}>
            <ContactBand />
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

/**
 * L'ATELIER — la couleur et la matière.
 *
 * Deux démonstrations plutôt que deux paragraphes : le rideau d'étalonnage
 * (le même plan, avant et après) et la loupe à grain (le nom du studio pris au
 * mot). On montre le métier au lieu de le décrire.
 */
function Atelier() {
  return (
    <section
      data-chapter="L'atelier"
      data-chapter-index="06"
      className="px-5 py-20 sm:px-8 sm:py-32 lg:px-10"
    >
      <div className="mx-auto max-w-[1300px]">
        <div className="max-w-[52ch]">
          <Reveal>
            <p className="font-cond text-[11px] tracking-[0.25em] text-[var(--color-terra)]">
              L&apos;atelier
            </p>
          </Reveal>
          <h2 className="font-wide mt-4 text-[clamp(2rem,5.4vw,4rem)] leading-[1.02] text-[var(--color-bone)]">
            <MaskTitle delay={80}>Ce qui ne se voit pas</MaskTitle>
          </h2>
          <Reveal delay={180}>
            <p className="mt-6 font-sans text-[1.08rem] leading-[1.75] text-[var(--color-bone-dim)]">
              Un film se joue après le tournage, dans des heures qu&apos;on ne
              montre jamais. Alors autant les montrer.
            </p>
          </Reveal>
        </div>

        {/* Le rideau d'étalonnage */}
        <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-20 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <GradeSplit
              src="/projects/the-shape-of-vastness/2.jpg"
              alt="Comparaison entre le rush et le plan étalonné — The Shape of Vastness"
            />
          </Reveal>
          <Reveal delay={140}>
            <div className="lg:pt-6">
              <p className="font-cond text-[11px] tracking-[0.22em] text-[var(--color-bone-faint)]">
                (01) / La couleur
              </p>
              <h3 className="font-wide mt-4 text-[clamp(1.5rem,3vw,2.3rem)] leading-[1.1] text-[var(--color-bone)]">
                On reprend la couleur image par image
              </h3>
              <p className="mt-5 font-sans text-[1.02rem] leading-[1.75] text-[var(--color-bone-dim)]">
                Une caméra enregistre à plat pour tout garder : c&apos;est laid,
                et c&apos;est voulu. L&apos;étalonnage vient après — c&apos;est
                là qu&apos;un plan devient une image, que le sable prend sa
                chaleur et que le ciel arrête de tirer au bleu.
              </p>
              <p className="mt-4 font-sans text-[1.02rem] leading-[1.75] text-[var(--color-bone-dim)]">
                Faites glisser le rideau : à gauche ce qui sort de la carte, à
                droite ce qu&apos;on vous livre.
              </p>
            </div>
          </Reveal>
        </div>

        {/* La loupe à grain */}
        <div className="mt-16 sm:mt-28">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-cond text-[11px] tracking-[0.22em] text-[var(--color-bone-faint)]">
                  (02) / La matière
                </p>
                <h3 className="font-wide mt-4 max-w-[20ch] text-[clamp(1.5rem,3vw,2.3rem)] leading-[1.1] text-[var(--color-bone)]">
                  Le grain, de très près
                </h3>
              </div>
              <p className="max-w-[40ch] font-sans text-[0.98rem] leading-[1.7] text-[var(--color-bone-dim)]">
                Approchez le curseur d&apos;une image : la loupe agrandit la
                matière. C&apos;est ce grain-là qui donne son nom au studio — et
                sa peau à nos films.
              </p>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-5">
            {[
              ["/projects/silhouette/3.jpg", "Silhouette — plan fixe, danseuse"],
              ["/projects/the-sound-of-discovery/5.jpg", "The Sound of Discovery — scène de vie"],
              ["/projects/delaurentis-gone-colors/2.jpg", "Gone Colors — live session au coucher du soleil"],
            ].map(([src, alt], i) => (
              <Reveal key={src} delay={i * 110}>
                <GrainLoupe
                  src={src}
                  alt={alt}
                  className={`aspect-[4/5] rounded-lg ring-1 ring-[var(--color-line-soft)] ${
                    i === 2 ? "col-span-2 aspect-[16/10] sm:col-span-1 sm:aspect-[4/5]" : ""
                  }`}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Metiers() {
  return (
    <section
      data-chapter="Les métiers"
      data-chapter-index="07"
      className="px-5 pb-16 pt-6 sm:px-8 sm:pb-28 sm:pt-10 lg:px-10"
    >
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-10 flex flex-col gap-4 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <p className="font-cond text-[11px] tracking-[0.25em] text-[var(--color-terra)]">
                Les métiers
              </p>
            </Reveal>
            <WordReveal
              text="Ce qu'on sait faire"
              className="font-wide mt-4 text-[clamp(2rem,5.4vw,4rem)] leading-[1.02] text-[var(--color-bone)]"
            />
          </div>
          <Reveal delay={160}>
            <Link
              href="/banc/realisations"
              className="font-cond w-fit rounded-full border border-[var(--color-line)] px-6 py-3 text-[12px] text-[var(--color-bone)] transition-colors duration-300 hover:border-[var(--color-terra)] hover:text-[var(--color-terra)]"
            >
              Voir la planche-contact
            </Link>
          </Reveal>
        </div>

        <ServiceIndex />
      </div>
    </section>
  );
}

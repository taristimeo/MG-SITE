import type { CSSProperties } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { RevealTitle } from "@/components/RevealTitle";
import { WordReveal } from "@/components/WordReveal";
import { LiveImages } from "@/components/LiveImages";
import { HeroFade } from "@/components/HeroFade";
import { WorksApple } from "@/components/WorksApple";
import { Manifesto } from "@/components/Manifesto";
import { Stats } from "@/components/Stats";
import { ServicesStack } from "@/components/ServicesStack";
import { clients, manifesto, projects, site } from "@/lib/site";

// Accueil « page produit » : écran-titre, manifeste révélé au scroll,
// sélection éditoriale de films, chiffres, prestations en cartes empilées,
// puis l'appel à projet. Un récit qui se déroule.
export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto
        kicker={manifesto.kicker}
        text={manifesto.text}
        accents={[...manifesto.accents]}
      />
      <Works />
      <section className="px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <Stats
            items={[
              { display: site.founded, label: `naissance du studio à ${site.city}` },
              { value: projects.length, label: "films phares au portfolio" },
              {
                value: 5,
                decimals: 1,
                label: "note des avis Google",
                accent: "★",
              },
              { value: clients.length, label: "clients accompagnés" },
            ]}
          />
        </div>
      </section>
      <ServicesStack />
      <LiveImages />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="flex min-h-[100svh] flex-col justify-center px-5 py-24 sm:px-8 lg:px-10">
      {/* Conteneur calé sur la largeur exacte du logotype (w-fit) : les deux
          légendes s'ancrent ainsi sur les bords du logo — la gauche sous le
          « M », la droite sous le point. Le tout s'estompe au premier scroll. */}
      <HeroFade>
      <div className="mx-auto w-full max-w-[1600px] sm:w-fit sm:max-w-none">
        {/* Logotype animé : fondu puis point terracotta « REC » */}
        <RevealTitle
          text={site.name}
          className="whitespace-nowrap text-center text-[clamp(2.3rem,10.2vw,10.2rem)] text-[var(--color-cream)]"
        />

        {/* Deux colonnes de légendes — enchaînées après l'intro */}
        <div className="mt-10 flex flex-col items-center gap-6 sm:mt-14 sm:w-full sm:flex-row sm:items-start sm:justify-between">
          <Reveal delay={900}>
            <p className="font-cond pb-[0.3em] text-center text-xs leading-relaxed tracking-wide text-[var(--color-bone-dim)] sm:text-left">
              Studio de{" "}
              <span
                className="kw"
                style={{ color: "inherit", "--kw-delay": "1.85s" } as CSSProperties}
              >
                production vidéo
              </span>
            </p>
          </Reveal>
          <Reveal delay={1050}>
            <p className="font-cond pb-[0.3em] text-center text-xs leading-relaxed tracking-wide text-[var(--color-bone-dim)] sm:text-right">
              L&apos;image au service de
              <br className="hidden sm:block" />{" "}
              <span
                className="kw"
                style={{ color: "inherit", "--kw-delay": "2.05s" } as CSSProperties}
              >
                votre histoire
              </span>
              .
            </p>
          </Reveal>
        </div>

        {/* Indication de scroll — même traitement que la page studio */}
        <Reveal delay={1200}>
          <p className="font-cond mt-12 text-center text-[0.7rem] tracking-[0.25em] text-[var(--color-bone-faint)]">
            Défiler <span aria-hidden>↓</span>
          </p>
        </Reveal>
      </div>
      </HeroFade>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Works() {
  // Sélection de films en grandes dalles immersives « façon Apple », puis le
  // lien vers l'index complet.
  return (
    <section
      id="realisations"
      className="px-5 pt-14 sm:px-8 sm:pt-20 lg:px-10"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14 text-center sm:mb-20">
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Réalisations
          </p>
          <WordReveal
            text="Des films, pas des vidéos"
            dot
            className="font-wide mt-4 text-[clamp(1.9rem,5vw,3.6rem)] leading-[1] text-[var(--color-bone)]"
          />
        </div>

        <WorksApple items={projects} />

        <div className="mt-16 flex justify-center sm:mt-24">
          <Link
            href="/realisations"
            className="font-cond rounded-full border border-[var(--color-line)] px-7 py-3 text-sm text-[var(--color-bone)] transition-colors hover:border-[var(--color-terra)] hover:text-[var(--color-terra)]"
          >
            Toutes les réalisations
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { PlayBadge } from "@/components/Poster";
import { CardMedia } from "@/components/CardMedia";
import { RevealTitle } from "@/components/RevealTitle";
import { LiveImages } from "@/components/LiveImages";
import { CardCursor } from "@/components/CardCursor";
import { HeroFade } from "@/components/HeroFade";
import { Manifesto } from "@/components/Manifesto";
import { FeatureReel } from "@/components/FeatureReel";
import { Stats } from "@/components/Stats";
import { ServicesStack } from "@/components/ServicesStack";
import {
  clients,
  manifesto,
  projects,
  projectThumb,
  projectPreview,
  site,
} from "@/lib/site";

// Accueil « page produit » : écran-titre, manifeste révélé au scroll, film
// vedette qui s'étire en plein cadre, réalisations, chiffres, prestations en
// cartes empilées, puis l'appel à projet. Un récit qui se déroule.
export default function Home() {
  const featured = projects[0];
  return (
    <>
      <Hero />
      <Manifesto
        kicker={manifesto.kicker}
        text={manifesto.text}
        accents={[...manifesto.accents]}
      />
      <FeatureReel
        href={`/realisations/${featured.slug}`}
        videoSrc={projectPreview(featured)}
        poster={projectThumb(featured)}
        title={featured.title}
        category={featured.category}
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
          <Reveal delay={1500}>
            <p className="font-cond pb-[0.3em] text-center text-xs leading-relaxed tracking-wide text-[var(--color-bone-dim)] sm:text-left">
              Studio de{" "}
              <span className="kw" style={{ color: "inherit" }}>
                production vidéo
              </span>
            </p>
          </Reveal>
          <Reveal delay={1650}>
            <p className="font-cond pb-[0.3em] text-center text-xs leading-relaxed tracking-wide text-[var(--color-bone-dim)] sm:text-right">
              L&apos;image au service de
              <br className="hidden sm:block" />{" "}
              <span className="kw" style={{ color: "inherit" }}>
                votre histoire
              </span>
              .
            </p>
          </Reveal>
        </div>
      </div>
      </HeroFade>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Works() {
  return (
    <section id="realisations" className="px-3 pt-10 sm:px-5 sm:pt-16 lg:px-6">
      <div className="mb-12 text-center sm:mb-16">
        <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
          Réalisations
        </p>
        <h2 className="font-wide mt-4 text-[clamp(1.9rem,5vw,3.6rem)] leading-[1] text-[var(--color-bone)]">
          Des films, pas des vidéos<span className="dot">.</span>
        </h2>
      </div>
      <CardCursor className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => {
            return (
              <Reveal key={p.slug} delay={(i % 3) * 90}>
                <Link
                  href={`/realisations/${p.slug}`}
                  data-card
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--color-ink-2)]">
                    <CardMedia
                      src={projectThumb(p)}
                      videoSrc={projectPreview(p)}
                      alt={`${p.title} — ${p.category} · film Mauvais Grain, studio vidéo à Bordeaux`}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <div className="card-play-badge absolute inset-0 flex items-center justify-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <PlayBadge />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between px-1 pb-2">
                    <span className="font-cond text-base text-[var(--color-bone)] transition-colors group-hover:text-[var(--color-terra)]">
                      {p.title}
                    </span>
                    <span className="font-cond text-xs text-[var(--color-bone-faint)]">
                      {p.category}
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </CardCursor>
    </section>
  );
}

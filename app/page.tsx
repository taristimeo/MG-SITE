import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { PlayBadge } from "@/components/Poster";
import { CardMedia } from "@/components/CardMedia";
import { RevealTitle } from "@/components/RevealTitle";
import { LiveImages } from "@/components/LiveImages";
import { Testimonials } from "@/components/Testimonials";
import { projects, projectThumb, projectPreview, site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Hero />
      <Works />
      <Testimonials />
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
          « M », la droite sous le point. */}
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
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Works() {
  return (
    <section id="realisations" className="px-3 pt-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => {
            return (
              <Reveal key={p.slug} delay={(i % 3) * 90}>
                <Link href={`/realisations/${p.slug}`} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--color-ink-2)]">
                    <CardMedia
                      src={projectThumb(p)}
                      videoSrc={projectPreview(p)}
                      alt={`${p.title} — ${p.category}`}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
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
      </div>
    </section>
  );
}

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { RevealTitle } from "@/components/RevealTitle";
import { CardMedia } from "@/components/CardMedia";
import { CardCursor } from "@/components/CardCursor";
import { DevisModal } from "@/components/DevisModal";
import { Still } from "@/components/Poster";
import { projects, projectThumb, projectPreview, site } from "@/lib/site";

// Accueil « page produit Apple » — mais en sombre (encre + terracotta) :
// beaucoup de vide, une idée par écran, énormes titres Gloock, apparitions
// nettes au scroll. Les films restent l'objet du désir. Contenu repris de la
// prod. La rigueur spatiale d'Apple, l'identité cinéma de Mauvais Grain.

export default function Home() {
  return (
    <main>
      <Hero />
      <Statement />
      <Works />
      <LiveImage />
      <Closing />
    </main>
  );
}

/* ── 1. Hero — plein écran, aéré ──────────────────────────────────────── */
function Hero() {
  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center px-6 pt-24 text-center">
      <Reveal>
        <p className="font-cond text-[11px] tracking-[0.28em] text-[var(--color-bone-faint)]">
          Studio de production vidéo · {site.city}
        </p>
      </Reveal>
      <RevealTitle
        text={site.name}
        className="mt-7 whitespace-nowrap text-[clamp(2.6rem,11vw,10rem)] leading-[0.95] text-[var(--color-cream)]"
      />
      <Reveal delay={900}>
        <p className="font-wide mx-auto mt-8 max-w-[20ch] text-[clamp(1.3rem,3.2vw,2.1rem)] leading-[1.25] text-[var(--color-bone-dim)]">
          L&apos;image au service de votre histoire<span className="dot">.</span>
        </p>
      </Reveal>
      <Reveal delay={1100}>
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <Link
            href="/realisations"
            className="btn-cta font-cond rounded-full bg-[var(--color-terra)] px-8 py-3.5 text-[13px] tracking-[0.05em] text-[var(--color-ink)]"
          >
            Voir les réalisations
          </Link>
          <Link
            href="/studio"
            className="link-underline font-cond text-[13px] tracking-[0.05em] text-[var(--color-bone-dim)]"
          >
            Découvrir le studio →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ── 2. Statement — une phrase, plein écran ──────────────────────────── */
function Statement() {
  return (
    <section className="flex min-h-[80svh] items-center justify-center px-6 py-32 text-center">
      <div className="mx-auto max-w-[16ch]">
        <Reveal>
          <p className="font-cond text-[11px] tracking-[0.28em] text-[var(--color-bone-faint)]">
            Notre parti pris
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="font-wide mt-8 text-[clamp(2.4rem,7vw,6rem)] leading-[1.02] text-[var(--color-cream)]">
            Des films, pas des vidéos<span className="dot">.</span>
          </h2>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 3. Réalisations — vitrine aérée ─────────────────────────────────── */
function Works() {
  return (
    <section id="realisations" className="px-6 pb-32 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-16 flex flex-col gap-4 sm:mb-24 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <h2 className="font-wide text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02] text-[var(--color-cream)]">
              Les réalisations
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <Link
              href="/realisations"
              className="link-underline font-cond text-[13px] tracking-[0.05em] text-[var(--color-bone-dim)]"
            >
              Tous les films →
            </Link>
          </Reveal>
        </div>

        <CardCursor>
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 sm:gap-y-24">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 90}>
                <Link href={`/realisations/${p.slug}`} data-card className="group block">
                  <div className="overflow-hidden rounded-[20px] bg-[var(--color-ink-2)] ring-1 ring-[var(--color-line-soft)] shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)]">
                    <div className="aspect-[4/3] transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
                      <CardMedia
                        src={projectThumb(p)}
                        videoSrc={projectPreview(p)}
                        alt={`${p.title} — ${p.category} · film Mauvais Grain, studio vidéo à Bordeaux`}
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="font-wide text-[clamp(1.4rem,2.6vw,2.1rem)] leading-tight text-[var(--color-bone)] transition-colors duration-500 group-hover:text-[var(--color-terra)]">
                      {p.title}
                    </h3>
                    <span className="font-cond shrink-0 text-[11px] tracking-[0.16em] text-[var(--color-bone-faint)]">
                      {p.category} · {p.year}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </CardCursor>
      </div>
    </section>
  );
}

/* ── 4. Donner vie à vos images — image + appel ──────────────────────── */
function LiveImage() {
  return (
    <section className="border-t border-[var(--color-line-soft)] px-6 py-28 sm:py-40">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="aspect-[4/5] overflow-hidden rounded-[20px] bg-[var(--color-ink-2)]">
            <Still
              src="/photo-studio.jpg"
              alt="Timéo Taris — Mauvais Grain, caméra en main au coucher de soleil"
            />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="font-cond text-[11px] tracking-[0.28em] text-[var(--color-bone-faint)]">
              Le studio
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-wide mt-6 text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.05] text-[var(--color-cream)]">
              Donner vie à vos images<span className="dot">.</span>
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="font-sans mt-6 max-w-[42ch] text-[1.05rem] leading-[1.75] text-[var(--color-bone-dim)]">
              De l&apos;écriture à l&apos;étalonnage, {site.name} transforme une
              intention en histoire visuelle — avec la même exigence, du premier
              repérage à la dernière image.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-9">
              <DevisModal label="Démarrer un projet" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── 5. Closing — invitation ─────────────────────────────────────────── */
function Closing() {
  return (
    <section className="px-6 py-32 text-center sm:py-44">
      <Reveal>
        <p className="font-cond text-[11px] tracking-[0.28em] text-[var(--color-bone-faint)]">
          Un projet en tête ?
        </p>
      </Reveal>
      <Reveal delay={120}>
        <p className="font-wide mx-auto mt-6 max-w-[14ch] text-[clamp(2.2rem,6vw,4.6rem)] leading-[1.04] text-[var(--color-cream)]">
          Écrivons votre histoire<span className="dot">.</span>
        </p>
      </Reveal>
      <Reveal delay={220}>
        <div className="mt-11 flex justify-center">
          <DevisModal label="Demander un devis" />
        </div>
      </Reveal>
    </section>
  );
}

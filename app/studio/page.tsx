import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { RevealTitle } from "@/components/RevealTitle";
import { WordReveal } from "@/components/WordReveal";
import { MaskTitle } from "@/components/MaskTitle";
import { Parallax } from "@/components/Parallax";
import { CardMedia } from "@/components/CardMedia";
import { Stats } from "@/components/Stats";
import { Testimonials } from "@/components/Testimonials";
import { Clients } from "@/components/Clients";
import {
  clients,
  founder,
  projectPreview,
  projectThumb,
  projects,
  site,
  values,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio — Vidéaste & réalisateur à Bordeaux",
  description: `${site.name}, studio de production vidéo fondé par ${site.founder} à ${site.city}. Notre approche : observer avant de filmer, du repérage à la post-production.`,
  alternates: { canonical: "/studio" },
};

// Page Studio — version VISUELLE & ANIMÉE. L'image et le mouvement portent la
// page ; le texte se réduit à l'essentiel. Ouverture immersive plein écran,
// bandes-médias en parallaxe, valeurs en mots-clés, chiffres animés, avis,
// puis l'appel à projet. Toutes les animations proviennent des primitives
// existantes ; le seul CSS custom (zoom lent du portrait) est neutralisé en
// prefers-reduced-motion. Contraintes iOS respectées : autour des <video>
// (CardMedia), uniquement transform / opacity / overflow / background.
export default function StudioPage() {
  // Deux films au repère pour rythmer la page en grands médias.
  const silhouette = projects.find((p) => p.slug === "silhouette") ?? projects[0];
  const egypte =
    projects.find((p) => p.slug === "the-sound-of-discovery") ?? projects[1];

  return (
    <>
      {/* ── HERO — portrait plein écran ──────────────────────────────── */}
      <section className="studio-hero relative flex min-h-[92svh] items-end overflow-hidden">
        <div className="studio-hero-media absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photo-studio.jpg"
            alt={`${site.founder}, réalisateur — ${site.name}`}
            className="studio-hero-img h-full w-full object-cover object-center"
          />
        </div>
        <div className="studio-hero-veil absolute inset-0" aria-hidden />

        <div className="relative z-10 w-full px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
          <div className="mx-auto max-w-[1200px]">
            <Reveal delay={200}>
              <p className="font-cond text-xs tracking-[0.28em] text-[var(--color-bone-dim)]">
                Le studio · {site.city} · depuis {site.founded}
              </p>
            </Reveal>
            <RevealTitle
              text="Studio"
              className="mt-4 text-[clamp(3.4rem,18vw,9rem)] leading-[0.9] text-[var(--color-cream)]"
            />
            <Reveal delay={900}>
              <p className="font-cond mt-8 text-[0.7rem] tracking-[0.28em] text-[var(--color-bone-faint)]">
                Défiler <span aria-hidden>↓</span>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── L'APPROCHE — une phrase forte ────────────────────────────── */}
      <section className="px-5 py-28 sm:px-8 sm:py-40 lg:px-10">
        <div className="mx-auto max-w-[1100px]">
          <Reveal>
            <p className="font-cond text-xs tracking-[0.28em] text-[var(--color-terra)]">
              Notre regard
            </p>
          </Reveal>
          <WordReveal
            text="Observer avant de filmer"
            dot
            className="font-wide mt-6 text-[clamp(2.4rem,9vw,6rem)] leading-[0.98] text-[var(--color-cream)]"
          />
        </div>
      </section>

      {/* ── MÉDIA 1 — grand aperçu en parallaxe ──────────────────────── */}
      <MediaBand
        src={projectThumb(silhouette)}
        video={projectPreview(silhouette)}
        eyebrow={silhouette.category}
        title={silhouette.title}
      />

      {/* ── VALEURS — mots-clés, aucun pavé ──────────────────────────── */}
      <section className="px-5 py-28 sm:px-8 sm:py-40 lg:px-10">
        <div className="mx-auto max-w-[1100px]">
          <Reveal>
            <p className="font-cond text-xs tracking-[0.28em] text-[var(--color-bone-faint)]">
              Ce qui nous tient
            </p>
          </Reveal>
          <h2 className="font-wide mt-4 text-[clamp(1.8rem,5vw,3rem)] leading-[1.05] text-[var(--color-bone)]">
            <MaskTitle delay={120}>
              Quatre exigences<span className="dot">.</span>
            </MaskTitle>
          </h2>

          <ul className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal
                key={v.title}
                as="li"
                delay={i * 120}
                className="flex items-baseline gap-5 border-t border-[var(--color-line)] pt-6"
              >
                <span className="font-cond text-[11px] tracking-[0.2em] text-[var(--color-terra)]">
                  0{i + 1}
                </span>
                <span className="font-wide text-[clamp(1.8rem,7vw,3rem)] leading-none text-[var(--color-cream)]">
                  {v.title}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── MÉDIA 2 — grand aperçu en parallaxe ──────────────────────── */}
      <MediaBand
        src={projectThumb(egypte)}
        video={projectPreview(egypte)}
        eyebrow={egypte.category}
        title={egypte.title}
      />

      {/* ── CHIFFRES — compteurs animés ──────────────────────────────── */}
      <section className="px-5 py-28 sm:px-8 sm:py-36 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <Stats
            items={[
              {
                display: site.founded,
                label: `naissance du studio à ${site.city}`,
              },
              { value: projects.length, label: "films au portfolio" },
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

      {/* ── LE PARTI PRIS — lignes du fondateur ──────────────────────── */}
      <section className="px-5 py-28 sm:px-8 sm:py-40 lg:px-10">
        <div className="mx-auto max-w-[1100px]">
          <Reveal>
            <p className="font-cond text-xs tracking-[0.28em] text-[var(--color-bone-faint)]">
              Le parti pris
            </p>
          </Reveal>
          <ul className="mt-10 flex flex-col gap-6">
            {founder.lines.map((line, i) => (
              <Reveal key={line} delay={i * 140}>
                <p className="font-wide text-[clamp(1.5rem,6vw,2.6rem)] leading-[1.15] text-[var(--color-bone)]">
                  {line}
                </p>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={founder.lines.length * 140}>
            <p className="font-cond mt-12 text-[11px] tracking-[0.24em] text-[var(--color-bone-dim)]">
              {founder.name} · {founder.role}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CLIENTS — grille animée (réutilisée) ─────────────────────── */}
      <Clients />

      {/* ── AVIS — cartes animées (réutilisées) ──────────────────────── */}
      <Testimonials />

      {/* ── CTA — court ──────────────────────────────────────────────── */}
      <section className="px-5 py-28 text-center sm:px-8 sm:py-40 lg:px-10">
        <div className="mx-auto max-w-[900px]">
          <h2 className="font-wide text-[clamp(2rem,7vw,4.4rem)] leading-[1] text-[var(--color-cream)]">
            <MaskTitle className="text-center">
              Écrivons votre histoire<span className="dot">.</span>
            </MaskTitle>
          </h2>
          <Reveal delay={200}>
            <div className="mt-12 flex flex-col items-center gap-6">
              <Link
                href="/contact"
                className="font-cond rounded-full border border-[var(--color-line)] px-8 py-3.5 text-sm text-[var(--color-bone)] transition-colors hover:border-[var(--color-terra)] hover:text-[var(--color-terra)]"
              >
                Démarrer un projet
              </Link>
              <p className="font-cond text-[11px] tracking-[0.2em] text-[var(--color-bone-dim)]">
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-[var(--color-cream)]"
                >
                  {site.email}
                </a>
                <span className="mx-2 text-[var(--color-bone-faint)]">·</span>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="hover:text-[var(--color-cream)]"
                >
                  {site.phone}
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Zoom lent du portrait — transform/opacity only (iOS safe),
          neutralisé en mouvement réduit. */}
      <style>{`
        .studio-hero-img {
          transform: scale(1.12);
          animation: studio-hero-zoom 3s var(--ease-out-expo) both;
        }
        @keyframes studio-hero-zoom {
          to { transform: scale(1); }
        }
        .studio-hero-veil {
          background:
            linear-gradient(
              to top,
              var(--color-ink) 2%,
              rgba(10, 9, 8, 0.55) 32%,
              rgba(10, 9, 8, 0.1) 62%,
              rgba(10, 9, 8, 0.35) 100%
            );
        }
        @media (prefers-reduced-motion: reduce) {
          .studio-hero-img {
            transform: none;
            animation: none;
          }
        }
      `}</style>
    </>
  );
}

/* ------------------------------------------------------------------ */

// Grande bande-média : aperçu vidéo (CardMedia) en léger parallaxe, avec une
// légende minimale posée sur un dégradé. Aucun filter / clip-path près de la
// vidéo — seulement transform (Parallax), overflow et background (dégradé).
function MediaBand({
  src,
  video,
  eyebrow,
  title,
}: {
  src: string;
  video?: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="px-5 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[16/9]">
            <Parallax amount={48} className="absolute inset-0">
              <div className="h-[112%] w-full -translate-y-[6%]">
                <CardMedia src={src} alt={title} videoSrc={video} />
              </div>
            </Parallax>
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/2"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,9,8,0.85), rgba(10,9,8,0))",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <p className="font-cond text-[11px] tracking-[0.28em] text-[var(--color-terra)]">
                {eyebrow}
              </p>
              <p className="font-wide mt-2 text-[clamp(1.6rem,5vw,3rem)] leading-none text-[var(--color-cream)]">
                {title}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

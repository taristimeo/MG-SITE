import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { RevealTitle } from "@/components/RevealTitle";
import { MaskTitle } from "@/components/MaskTitle";
import { Clients } from "@/components/Clients";
import { Testimonials } from "@/components/Testimonials";
import { DevisModal } from "@/components/DevisModal";
import { Still } from "@/components/Poster";
import { founder, site, values } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio — Vidéaste & réalisateur à Bordeaux",
  description: `${site.name}, studio de production vidéo fondé par ${site.founder} à ${site.city}. Notre approche : observer avant de filmer, du repérage à la post-production.`,
  alternates: { canonical: "/studio" },
};

// Page Studio — format « agence » : compact et direct. En-tête fort, portrait +
// texte en deux colonnes, méthode en grille 2×2, clients, un avis, contact.
// On lit vite, tout est là. Animations sobres (révélations douces au scroll,
// aucun scroll capturé) — les primitives partagées gèrent prefers-reduced-motion.
export default function StudioPage() {
  return (
    <>
      {/* ── 1. En-tête ─────────────────────────────────────────────────── */}
      <section className="px-5 pb-14 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:px-10">
        <div className="mx-auto max-w-[1150px]">
          <Reveal>
            <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
              Le studio — depuis{" "}
              <span className="text-[var(--color-terra)]">{site.founded}</span>
            </p>
          </Reveal>
          <RevealTitle
            text="Studio"
            className="mt-4 text-[clamp(2.8rem,9vw,7rem)] text-[var(--color-cream)]"
          />
          <Reveal delay={220}>
            <p className="font-sans mt-6 max-w-[38ch] text-[clamp(1.05rem,2.2vw,1.35rem)] leading-relaxed text-[var(--color-bone-dim)]">
              Studio de production vidéo à {site.city}. On écrit des films — de
              commande comme d&apos;auteur — avec la même exigence, du repérage à
              l&apos;étalonnage.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 2. Portrait + texte ────────────────────────────────────────── */}
      <section className="px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
        <div className="mx-auto grid max-w-[1150px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,440px)_1fr] lg:items-center lg:gap-16">
          <Reveal>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--color-ink-2)]">
              <Still
                src="/photo-studio.jpg"
                alt={`${founder.name} — ${founder.role} de ${site.name}`}
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-terra)]">
                Notre approche
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-wide mt-5 text-[clamp(1.8rem,3.6vw,2.9rem)] leading-[1.1] text-[var(--color-cream)]">
                Observer avant de filmer.
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="font-sans mt-6 text-[1.05rem] leading-[1.75] text-[var(--color-bone-dim)]">
                {site.name} démarre à {site.city} en {site.founded}
                {" "}avec une idée simple : chaque commande mérite une vraie
                écriture. Avant de toucher une caméra, on pose des questions —
                ce que vous faites, pourquoi, à qui vous parlez. C&apos;est de
                là que vient le film, pas d&apos;un template.
              </p>
            </Reveal>

            <ul className="mt-8 flex flex-col gap-3 border-l border-[var(--color-line)] pl-5">
              {founder.lines.map((l, i) => (
                <Reveal as="li" key={l} delay={220 + i * 80}>
                  <span className="font-wide text-[clamp(1.05rem,2vw,1.35rem)] leading-snug text-[var(--color-bone)]">
                    {l}
                  </span>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={480}>
              <p className="font-cond mt-8 text-[11px] tracking-[0.22em] text-[var(--color-bone-dim)]">
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

      {/* ── 3. Méthode — grille 2×2 ────────────────────────────────────── */}
      <section className="px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
        <div className="mx-auto max-w-[1150px]">
          <Reveal>
            <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
              Notre méthode
            </p>
          </Reveal>
          <h2 className="font-wide mt-4 overflow-hidden text-[clamp(2rem,5vw,3.6rem)] leading-[1] text-[var(--color-cream)]">
            <MaskTitle>Quatre temps, une exigence.</MaskTitle>
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-[var(--color-line)] sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 90}>
                <div className="h-full bg-[var(--color-ink)] p-8 sm:p-10">
                  <span className="font-cond text-xs tracking-[0.2em] text-[var(--color-terra)]">
                    0{i + 1}
                  </span>
                  <h3 className="font-wide mt-5 text-2xl text-[var(--color-bone)] sm:text-3xl">
                    {v.title}
                  </h3>
                  <p className="font-sans mt-4 text-sm leading-relaxed text-[var(--color-bone-dim)]">
                    {v.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Clients ─────────────────────────────────────────────────── */}
      <Clients />

      {/* ── 5. Avis ────────────────────────────────────────────────────── */}
      <Testimonials />

      {/* ── 6. Contact ─────────────────────────────────────────────────── */}
      <section className="px-5 pb-16 pt-24 text-center sm:px-8 sm:pt-32 lg:px-10">
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

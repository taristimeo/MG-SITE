import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { WordReveal } from "@/components/WordReveal";
import { Stats } from "@/components/Stats";
import { Clients } from "@/components/Clients";
import { Testimonials } from "@/components/Testimonials";
import { DevisModal } from "@/components/DevisModal";
import { Still } from "@/components/Poster";
import { clients, founder, projects, site, values } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio — Vidéaste & réalisateur à Bordeaux",
  description: `${site.name}, studio de production vidéo fondé par ${site.founder} à ${site.city}. Notre approche : observer avant de filmer, du repérage à la post-production.`,
  alternates: { canonical: "/studio" },
};

// Page Studio « façon Apple » : un récit qui se déroule. Ouverture plein écran
// sur le portrait cinématique (le regard, avant la caméra), puis l'approche en
// grand, les chiffres, la méthode en quatre temps, les clients, les avis, et
// l'appel à projet. Grandes respirations, révélations douces au scroll, aucun
// scroll capturé. Les primitives partagées gèrent prefers-reduced-motion.
export default function StudioPage() {
  return (
    <>
      {/* ── 1. Ouverture immersive — le portrait plein écran ─────────────── */}
      <section className="relative min-h-[92svh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Still
            src="/photo-studio.jpg"
            alt={`${founder.name} — ${founder.role} de ${site.name}, studio vidéo à ${site.city}`}
          />
        </div>
        {/* Voile bas (lisibilité du titre) + voile haut (lisibilité de l'en-tête) */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/10 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--color-ink)]/70 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-16 sm:px-8 sm:pb-24 lg:px-10">
          <div className="mx-auto max-w-[1150px]">
            <Reveal>
              <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
                Le studio · {site.city} · depuis{" "}
                <span className="text-[var(--color-terra)]">{site.founded}</span>
              </p>
            </Reveal>
            <WordReveal
              text="Observer avant de filmer"
              dot
              delay={120}
              className="font-wide mt-5 max-w-[15ch] text-[clamp(2.4rem,9vw,5.2rem)] leading-[0.98] text-[var(--color-cream)]"
            />
          </div>
        </div>
      </section>

      {/* ── 2. L'approche — le récit du studio ───────────────────────────── */}
      <section className="px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto max-w-[760px]">
          <Reveal>
            <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-terra)]">
              Notre approche
            </p>
          </Reveal>
          <Reveal delay={90}>
            <p className="font-sans mt-8 text-[clamp(1.3rem,3.4vw,1.9rem)] leading-[1.5] text-[var(--color-cream)]">
              {site.name} démarre à {site.city} en {site.founded}
              {" "}avec une idée simple&nbsp;: chaque commande mérite une vraie
              écriture.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <p className="font-sans mt-8 text-[1.05rem] leading-[1.8] text-[var(--color-bone-dim)]">
              Avant de toucher une caméra, on pose des questions — ce que vous
              faites, pourquoi, à qui vous parlez. C&apos;est de là que vient le
              film, pas d&apos;un template. On observe, on écoute, et seulement
              après on cadre.
            </p>
          </Reveal>

          {/* Le parti pris, en trois temps forts */}
          <div className="mt-14 flex flex-col gap-5 border-t border-[var(--color-line)] pt-12">
            {founder.lines.map((l, i) => (
              <Reveal as="p" key={l} delay={i * 110}>
                <span className="font-wide flex gap-4 text-[clamp(1.35rem,4vw,2.1rem)] leading-[1.15] text-[var(--color-bone)]">
                  <span className="font-cond mt-[0.5em] text-[11px] tracking-[0.2em] text-[var(--color-terra)]">
                    0{i + 1}
                  </span>
                  {l}
                </span>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="font-cond mt-12 text-[11px] tracking-[0.22em] text-[var(--color-bone-dim)]">
              <span
                aria-hidden
                className="mr-3 inline-block h-px w-8 bg-[var(--color-terra)] align-middle"
              />
              {founder.name} · {founder.role}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 3. Chiffres-clés ─────────────────────────────────────────────── */}
      <section className="px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
        <div className="mx-auto max-w-[1050px]">
          <Stats
            items={[
              { display: site.founded, label: `naissance du studio à ${site.city}` },
              { value: projects.length, label: "films au portfolio" },
              { value: 5, decimals: 1, label: "note des avis Google", accent: "★" },
              { value: clients.length, label: "clients accompagnés" },
            ]}
          />
        </div>
      </section>

      {/* ── 4. La méthode — quatre temps ─────────────────────────────────── */}
      <section className="px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
        <div className="mx-auto max-w-[1050px]">
          <Reveal>
            <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
              Notre méthode
            </p>
          </Reveal>
          <WordReveal
            text="Quatre temps, une exigence"
            dot
            className="font-wide mt-4 text-[clamp(2rem,5.5vw,3.6rem)] leading-[1] text-[var(--color-cream)]"
          />

          <div className="mt-16 grid gap-x-14 gap-y-14 sm:mt-20 sm:grid-cols-2 sm:gap-y-16">
            {values.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 90}
                className="border-t border-[var(--color-line)] pt-8"
              >
                <div>
                  <span className="font-cond text-xs tracking-[0.2em] text-[var(--color-terra)]">
                    0{i + 1}
                  </span>
                  <h3 className="font-wide mt-5 text-2xl text-[var(--color-bone)] sm:text-3xl">
                    {v.title}
                  </h3>
                  <p className="font-sans mt-4 text-[15px] leading-[1.7] text-[var(--color-bone-dim)]">
                    {v.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Clients ───────────────────────────────────────────────────── */}
      <Clients />

      {/* ── 6. Avis ──────────────────────────────────────────────────────── */}
      <Testimonials />

      {/* ── 7. Contact ───────────────────────────────────────────────────── */}
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

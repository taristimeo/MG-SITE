import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { RevealTitle } from "@/components/RevealTitle";
import { DRAFTS } from "@/lib/drafts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trois brouillons — comparer les pistes de refonte",
  description: `Trois propositions de refonte du site de ${site.name}, qui diffèrent par la manière dont on manie le site.`,
  alternates: { canonical: "/" },
  // Page de travail interne : elle n'a rien à faire dans les résultats.
  robots: { index: false, follow: false },
};

/**
 * LA PAGE DE GARDE.
 *
 * Trois brouillons, trois gestes. On choisit ici, puis le sélecteur du bord
 * gauche permet de passer de l'un à l'autre sans repasser par cette page —
 * c'est ce qui rend la comparaison possible.
 */
export default function Porte() {
  return (
    <main
      data-tone="dark"
      className="relative min-h-[100svh] px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
    >
      {/* Halo terracotta diffus — la lampe de la visionneuse */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[60vh] w-[70vw] -translate-x-1/2 rounded-full bg-[var(--color-terra)] opacity-[0.06] blur-[130px]"
      />

      <div className="relative mx-auto max-w-[1400px]">
        <header className="text-center">
          <Reveal>
            <p className="font-cond text-[11px] tracking-[0.25em] text-[var(--color-terra)]">
              {site.name} — document de travail
            </p>
          </Reveal>
          <RevealTitle
            text="Trois brouillons"
            className="mt-4 text-[clamp(2.2rem,7vw,5.4rem)] leading-[1] text-[var(--color-cream)]"
          />
          <Reveal delay={500}>
            <p className="mx-auto mt-6 max-w-[62ch] font-sans text-[1.02rem] leading-[1.75] text-[var(--color-bone-dim)]">
              Trois propositions qui ne diffèrent pas par l&apos;habillage —
              même charte, même contenu, mêmes films — mais par le{" "}
              <span className="text-[var(--color-bone)]">geste</span> : ce que la
              main fait pour avancer dans le site.
            </p>
          </Reveal>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-20 sm:gap-6 lg:grid-cols-3">
          {DRAFTS.map((d, i) => (
            <Reveal key={d.href} delay={i * 130}>
              <Link
                href={d.href}
                className="gate-card group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-line-soft)] bg-[var(--color-ink-2)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.still}
                    alt=""
                    aria-hidden
                    className="h-full w-full object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[rgba(7,6,5,0.85)] via-transparent to-transparent"
                  />
                  <p className="font-cond absolute bottom-4 left-4 text-[11px] tracking-[0.2em] text-[var(--color-terra)]">
                    {d.num} — {d.geste}
                  </p>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h2 className="font-wide text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.05] text-[var(--color-cream)]">
                    {d.name}
                  </h2>
                  <p className="mt-4 font-sans text-[0.95rem] leading-[1.65] text-[var(--color-bone-dim)]">
                    {d.resume}
                  </p>

                  <dl className="mt-6 space-y-3 border-t border-[var(--color-line-soft)] pt-5 text-[0.88rem] leading-[1.6]">
                    <div>
                      <dt className="font-cond text-[9px] tracking-[0.18em] text-[var(--color-terra)]">
                        Ce que ça gagne
                      </dt>
                      <dd className="mt-1 text-[var(--color-bone-dim)]">
                        {d.gagne}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-cond text-[9px] tracking-[0.18em] text-[var(--color-bone-faint)]">
                        Ce que ça coûte
                      </dt>
                      <dd className="mt-1 text-[var(--color-bone-dim)]">
                        {d.coute}
                      </dd>
                    </div>
                  </dl>

                  <p className="font-cond mt-auto pt-6 text-[11px] tracking-[0.2em] text-[var(--color-bone-faint)] transition-colors duration-300 group-hover:text-[var(--color-terra)]">
                    Ouvrir le brouillon{" "}
                    <span aria-hidden className="inline-block">
                      →
                    </span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={520}>
          <p className="font-cond mx-auto mt-12 max-w-[70ch] text-center text-[10px] leading-[2] tracking-[0.16em] text-[var(--color-bone-faint)] sm:mt-16">
            Une fois dans un brouillon, la languette du bord gauche permet de
            sauter aux deux autres. Au clavier :{" "}
            <span className="text-[var(--color-bone-dim)]">1</span>,{" "}
            <span className="text-[var(--color-bone-dim)]">2</span>,{" "}
            <span className="text-[var(--color-bone-dim)]">3</span> pour changer
            · <span className="text-[var(--color-bone-dim)]">H</span> pour
            masquer le sélecteur et juger l&apos;écran nu.
          </p>
        </Reveal>

        <Reveal delay={600}>
          <p className="font-cond mt-8 text-center text-[10px] tracking-[0.18em] text-[var(--color-bone-faint)]">
            Le site en ligne, lui, n&apos;a pas bougé —{" "}
            <a
              href={site.url}
              className="underline underline-offset-4 transition-colors hover:text-[var(--color-terra)]"
            >
              mauvaisgrain.com
            </a>
          </p>
        </Reveal>
      </div>
    </main>
  );
}

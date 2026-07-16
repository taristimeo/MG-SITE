import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { RevealTitle } from "@/components/RevealTitle";
import { DevisModal } from "@/components/DevisModal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — Demander un devis",
  description: `Demandez un devis à ${site.name}, studio de production vidéo à ${site.city}. Parlez-nous de votre projet vidéo : corporate, événement, mariage, publicité ou clip.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="px-5 pb-28 pt-32 sm:px-8 sm:pt-36 lg:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="text-center">
          <Reveal>
            <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
              Un projet en tête ?
            </p>
          </Reveal>
          <RevealTitle
            text="On en parle"
            className="mt-3 text-[clamp(2rem,6.5vw,5rem)] text-[var(--color-cream)]"
          />
        </div>

        {/* Carte d'appel — ouvre le formulaire de devis en fenêtre */}
        <div className="mx-auto mt-14 max-w-[600px] sm:mt-16">
          <Reveal delay={200}>
            <div className="rounded-2xl border border-[var(--color-line-soft)] bg-[var(--color-ink-2)] p-8 text-center sm:p-10">
              <p className="font-cond text-[11px] tracking-[0.22em] text-[var(--color-bone-faint)]">
                Devis sans engagement
              </p>
              <p className="font-wide mt-3 text-[clamp(1.3rem,3.4vw,2rem)] leading-tight text-[var(--color-cream)]">
                Parlez-nous de votre projet
              </p>
              <p className="font-sans mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-[var(--color-bone-dim)]">
                Quelques lignes suffisent — on revient vers vous avec une
                proposition adaptée.
              </p>
              <div className="mt-8 flex justify-center">
                <DevisModal label="Demander un devis" />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Contact direct — alternative */}
        <div className="mx-auto mt-20 max-w-[560px] border-t border-[var(--color-line-soft)] pt-10">
          <p className="font-cond text-center text-[11px] tracking-[0.22em] text-[var(--color-bone-faint)]">
            Ou directement
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8">
            <a
              href={`mailto:${site.email}`}
              className="font-cond text-sm text-[var(--color-bone)] transition-colors hover:text-[var(--color-terra)]"
            >
              {site.email}
            </a>
            <span aria-hidden className="hidden text-[var(--color-line)] sm:inline">
              ·
            </span>
            <a
              href={`tel:${site.phoneHref}`}
              className="font-cond text-sm text-[var(--color-bone)] transition-colors hover:text-[var(--color-terra)]"
            >
              {site.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

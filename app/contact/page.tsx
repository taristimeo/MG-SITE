import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { RevealTitle } from "@/components/RevealTitle";
import { DevisForm } from "@/components/DevisForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "On en parle",
  description: `Démarrer un projet avec ${site.name} — studio de production vidéo à ${site.city}.`,
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
          <Reveal delay={140}>
            <p className="font-sans mx-auto mt-6 max-w-[46ch] text-[15px] leading-relaxed text-[var(--color-bone-dim)]">
              Décrivez votre projet en quelques lignes, on vous répond avec une
              proposition claire.
            </p>
          </Reveal>
        </div>

        {/* Formulaire de devis */}
        <div className="mt-14 sm:mt-16">
          <Reveal delay={200}>
            <DevisForm />
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

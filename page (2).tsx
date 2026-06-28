import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { RevealTitle } from "@/components/RevealTitle";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "On en parle",
  description: `Démarrer un projet avec ${site.name} — studio de production vidéo à ${site.city}.`,
};

export default function ContactPage() {
  return (
    <section className="flex min-h-[100svh] flex-col justify-center px-5 py-32 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1100px] text-center">
        <Reveal>
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Un projet en tête ?
          </p>
        </Reveal>
        <RevealTitle
          text="On en parle"
          className="mt-3 text-[clamp(2rem,6.5vw,5rem)] text-[var(--color-cream)]"
        />

        <div className="mt-14 flex flex-col gap-10 sm:mt-16">
          <Reveal delay={140}>
            <p className="font-cond text-xs tracking-[0.22em] text-[var(--color-bone-faint)]">
              Écrivez-nous
            </p>
            <a
              href={`mailto:${site.email}`}
              className="font-wide mt-3 inline-block break-words text-[clamp(1.3rem,3.8vw,2.6rem)] leading-tight text-[var(--color-bone)] transition-colors hover:text-[var(--color-terra)]"
            >
              {site.email}
            </a>
          </Reveal>

          <Reveal delay={220}>
            <p className="font-cond text-xs tracking-[0.22em] text-[var(--color-bone-faint)]">
              Appelez-nous
            </p>
            <a
              href={`tel:${site.phoneHref}`}
              className="font-wide mt-3 inline-block text-[clamp(1.3rem,3.8vw,2.6rem)] leading-tight text-[var(--color-bone)] transition-colors hover:text-[var(--color-terra)]"
            >
              {site.phone}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

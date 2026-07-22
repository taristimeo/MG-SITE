import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { RevealTitle } from "@/components/RevealTitle";
import { MaskTitle } from "@/components/MaskTitle";
import { ContactBand } from "@/components/ContactBand";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — Demander un devis",
  description: `Demandez un devis à ${site.name}, studio de production vidéo à ${site.city}. Parlez-nous de votre projet vidéo : corporate, événement, mariage, publicité ou clip.`,
  alternates: { canonical: "/contact" },
};

// Contact éditorial : le devis est LA pièce centrale — une bande géante qui se
// remplit de terracotta au survol — puis les accès directs en colonnes
// (écrire / appeler), l'adresse et les réseaux en générique de fin.
export default function ContactPage() {
  return (
    <section className="px-5 pb-28 pt-32 sm:px-8 sm:pt-40 lg:px-10">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Écran-titre */}
        <div className="text-center">
          <Reveal>
            <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
              Un projet en tête ?
            </p>
          </Reveal>
          <RevealTitle
            text="On en parle"
            className="mt-3 text-[clamp(2.4rem,8vw,7rem)] text-[var(--color-cream)]"
          />
          <Reveal delay={260}>
            <p className="mt-8 inline-flex items-center gap-3 font-cond text-[11px] tracking-[0.2em] text-[var(--color-bone-dim)]">
              <span className="avail-dot" aria-hidden />
              Disponible pour de nouveaux projets · Réponse sous 24 h
            </p>
          </Reveal>
        </div>

        {/* La bande devis — l'unique geste fort de la page : elle se remplit
            de terracotta et sa flèche file vers l'avant */}
        <Reveal delay={340}>
          <div className="mt-16 sm:mt-24">
            <ContactBand />
            <p className="font-cond mt-5 text-center text-[10px] tracking-[0.22em] text-[var(--color-bone-faint)]">
              Gratuit et sans engagement · quelques lignes suffisent
            </p>
          </div>
        </Reveal>

        {/* Accès directs — deux grandes lignes qui montent par masque */}
        <div className="mt-20 grid grid-cols-1 gap-14 border-t border-[var(--color-line-soft)] pt-16 text-center sm:mt-24 sm:grid-cols-2 sm:gap-10">
          <div>
            <Reveal>
              <p className="font-cond text-[11px] tracking-[0.25em] text-[var(--color-bone-faint)]">
                Écrivez-nous
              </p>
            </Reveal>
            <MaskTitle delay={140} className="mt-4">
              <a
                href={`mailto:${site.email}`}
                className="font-wide inline-block text-[clamp(1.05rem,2.6vw,1.9rem)] leading-tight text-[var(--color-bone)] transition-colors [overflow-wrap:anywhere] hover:text-[var(--color-terra)]"
              >
                {site.email}
              </a>
            </MaskTitle>
          </div>
          <div>
            <Reveal>
              <p className="font-cond text-[11px] tracking-[0.25em] text-[var(--color-bone-faint)]">
                Appelez-nous
              </p>
            </Reveal>
            <MaskTitle delay={260} className="mt-4">
              <a
                href={`tel:${site.phoneHref}`}
                className="font-wide inline-block text-[clamp(1.15rem,2.6vw,1.9rem)] leading-tight text-[var(--color-bone)] transition-colors hover:text-[var(--color-terra)]"
              >
                {site.phone}
              </a>
            </MaskTitle>
          </div>
        </div>

        {/* Générique de fin : le lieu + les réseaux */}
        <Reveal delay={280}>
          <div className="mt-16 flex flex-col items-center gap-4 text-center sm:mt-20">
            <address className="font-cond text-[11px] not-italic leading-relaxed tracking-[0.2em] text-[var(--color-bone-dim)]">
              {site.street} · {site.postalCode} {site.city}
            </address>
            <div className="flex gap-6 font-cond text-[11px] tracking-[0.2em] text-[var(--color-bone-faint)]">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-300 hover:text-[var(--color-terra)]"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

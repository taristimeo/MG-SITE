import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page introuvable",
  description:
    "Cette page n'existe pas ou n'existe plus. Retour aux réalisations du studio.",
};

// Liens de secours — on renvoie vers les trois destinations utiles du site.
const exits = [
  { label: "Accueil", href: "/" },
  { label: "Films", href: "/films" },
  { label: "On en parle", href: "/contact" },
];

// Page 404 à la charte : même fond, même typographie, même point terracotta que
// le reste du site — c'était le seul écran qui retombait sur le rendu par
// défaut de Next (fond blanc, texte en anglais). Volontairement sobre : aucune
// animation, rien à attendre avant de repartir.
export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] flex-col justify-center px-5 py-32 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[720px] text-center">
        <p className="font-cond flex items-center justify-center gap-3 text-[12px] tracking-[0.25em] text-[var(--color-bone-faint)]">
          <span className="h-px w-8 bg-[var(--color-terra)]" />
          Erreur 404
        </p>

        <h1 className="font-wide mt-7 text-[clamp(2.1rem,8vw,4.6rem)] leading-[1.05] text-[var(--color-cream)]">
          Ce plan n&apos;a jamais été tourné<span className="dot">.</span>
        </h1>

        <p className="mx-auto mt-7 max-w-[46ch] font-sans text-[0.95rem] leading-relaxed text-[var(--color-bone-dim)]">
          La page que vous cherchez est tombée au montage — ou l&apos;adresse
          s&apos;est perdue en route. Le reste du studio, lui, est bien là.
        </p>

        <nav className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {exits.map((e, i) => (
            <Link
              key={e.href}
              href={e.href}
              className={
                i === 0
                  ? "font-cond rounded-full border border-[var(--color-terra)] bg-[var(--color-terra)] px-7 py-3 text-sm text-[var(--color-ink)] transition-colors hover:bg-transparent hover:text-[var(--color-terra)]"
                  : "font-cond rounded-full border border-[var(--color-line)] px-7 py-3 text-sm text-[var(--color-bone)] transition-colors hover:border-[var(--color-terra)] hover:text-[var(--color-terra)]"
              }
            >
              {e.label}
            </Link>
          ))}
        </nav>

        <p className="font-cond mt-14 text-[0.7rem] tracking-[0.18em] text-[var(--color-bone-faint)]">
          {site.name} — {site.city}
        </p>
      </div>
    </section>
  );
}

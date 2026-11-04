import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "Cette page n'existe pas ou n'existe plus. Retour aux films du studio.",
};

const exits = [
  { label: "Accueil", href: "/" },
  { label: "Films", href: "/realisations" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <section className="gutter flex min-h-[100dvh] flex-col justify-end pb-[calc(var(--gutter)*1.15)]">
      <p className="t-legend mb-5">Erreur 404</p>
      <h1 className="t-giant m-0 max-w-[10ch]">Plan manquant.</h1>
      <ul className="t-legend mt-10 flex gap-8">
        {exits.map((e) => (
          <li key={e.href}>
            <Link href={e.href} className="u-draw">
              {e.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

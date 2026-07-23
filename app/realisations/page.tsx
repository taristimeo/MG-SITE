import type { Metadata } from "next";
import Link from "next/link";
import { projects, projectThumb, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Réalisations — Films & vidéos",
  description: `Portfolio de ${site.name}, studio de production vidéo à ${site.city} : films corporate, événementiel, clips, tourisme et publicité. Découvrez nos réalisations.`,
  alternates: { canonical: "/realisations" },
};

// Page « Réalisations » — version sobre : un en-tête statique, puis une simple
// liste des films en une colonne. Aucune animation, aucun effet au scroll ;
// seul un léger changement de couleur au survol des liens.
export default function RealisationsPage() {
  return (
    <section className="px-5 pb-24 pt-24 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-[720px]">
        {/* En-tête statique */}
        <header className="border-b border-[var(--color-line)] pb-10">
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Le travail
          </p>
          <h1 className="font-wide mt-3 text-[clamp(2.4rem,9vw,4rem)] leading-[1.05] text-[var(--color-cream)]">
            Réalisations<span className="text-[var(--color-terra)]">.</span>
          </h1>
          <p className="font-sans mt-5 max-w-[46ch] text-[var(--color-bone-dim)]">
            {projects.length} films, du corporate au clip. Chaque projet raconte
            une intention et le regard que nous avons posé dessus.
          </p>
        </header>

        {/* Liste des films — statique, une colonne */}
        <ul>
          {projects.map((p) => (
            <li
              key={p.slug}
              className="border-b border-[var(--color-line)]"
            >
              <Link
                href={`/realisations/${p.slug}`}
                className="group block py-8"
              >
                <div className="overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={projectThumb(p)}
                    alt={p.title}
                    loading="lazy"
                    className="aspect-video w-full object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-100"
                  />
                </div>
                <p className="font-cond mt-4 text-[11px] tracking-[0.25em] text-[var(--color-bone-faint)]">
                  {p.category} · {p.year}
                </p>
                <h2 className="font-wide mt-2 text-2xl leading-tight text-[var(--color-bone)] transition-colors duration-200 group-hover:text-[var(--color-terra)]">
                  {p.title}
                </h2>
                <p className="font-sans mt-2 line-clamp-2 max-w-[52ch] text-sm leading-relaxed text-[var(--color-bone-dim)]">
                  {p.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

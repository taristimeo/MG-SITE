import type { Metadata } from "next";
import Link from "next/link";
import { clients, founder, site, testimonials, values } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio — Vidéaste & réalisateur à Bordeaux",
  description: `${site.name}, studio de production vidéo fondé par ${site.founder} à ${site.city}. Notre approche : observer avant de filmer, du repérage à la post-production.`,
  alternates: { canonical: "/studio" },
};

// Page Studio — version sobre. Essentiellement du texte, une seule colonne,
// lisible et calme. Aucune animation d'entrée ni effet au scroll : seul le
// survol des liens change légèrement d'opacité. Le contenu vient de lib/site.
export default function StudioPage() {
  return (
    <div className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-[680px]">
        {/* ── En-tête ──────────────────────────────────────────────────── */}
        <header>
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Le studio · {site.city} · depuis {site.founded}
          </p>
          <h1 className="font-wide mt-5 text-[clamp(2.6rem,10vw,4rem)] leading-[1] text-[var(--color-cream)]">
            Studio<span className="dot">.</span>
          </h1>
          <p className="font-sans mt-6 text-[1.05rem] leading-[1.7] text-[var(--color-bone-dim)]">
            {site.name} est un studio de production vidéo basé à {site.city},
            actif depuis {site.founded}. On écrit et on réalise des films pour
            les entreprises, les événements et les projets créatifs.
          </p>
        </header>

        {/* ── L'approche ───────────────────────────────────────────────── */}
        <section className="mt-16 border-t border-[var(--color-line)] pt-12">
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-terra)]">
            Notre approche
          </p>
          <h2 className="font-wide mt-5 text-[clamp(1.7rem,6vw,2.4rem)] leading-[1.1] text-[var(--color-cream)]">
            Observer avant de filmer<span className="dot">.</span>
          </h2>
          <p className="font-sans mt-6 text-[1.05rem] leading-[1.8] text-[var(--color-bone-dim)]">
            {site.name} démarre à {site.city} en {site.founded}{" "}
            avec une idée simple : chaque commande mérite une vraie écriture.
          </p>
          <p className="font-sans mt-5 text-[1.05rem] leading-[1.8] text-[var(--color-bone-dim)]">
            Avant de toucher une caméra, on pose des questions — ce que vous
            faites, pourquoi, à qui vous parlez. C&apos;est de là que vient le
            film, pas d&apos;un template. On observe, on écoute, et seulement
            après on cadre.
          </p>
        </section>

        {/* ── Le parti pris ────────────────────────────────────────────── */}
        <section className="mt-16 border-t border-[var(--color-line)] pt-12">
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Le parti pris
          </p>
          <ul className="mt-6 flex flex-col gap-4">
            {founder.lines.map((line) => (
              <li
                key={line}
                className="font-wide text-[clamp(1.25rem,5vw,1.6rem)] leading-[1.25] text-[var(--color-bone)]"
              >
                {line}
              </li>
            ))}
          </ul>
          <p className="font-cond mt-8 text-[11px] tracking-[0.22em] text-[var(--color-bone-dim)]">
            {founder.name} · {founder.role}
          </p>
        </section>

        {/* ── La méthode ───────────────────────────────────────────────── */}
        <section className="mt-16 border-t border-[var(--color-line)] pt-12">
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Notre méthode
          </p>
          <h2 className="font-wide mt-5 text-[clamp(1.7rem,6vw,2.4rem)] leading-[1.1] text-[var(--color-cream)]">
            Quatre temps, une exigence<span className="dot">.</span>
          </h2>
          <ol className="mt-8 flex flex-col gap-8">
            {values.map((v, i) => (
              <li key={v.title}>
                <div className="flex items-baseline gap-3">
                  <span className="font-cond text-[11px] tracking-[0.2em] text-[var(--color-terra)]">
                    0{i + 1}
                  </span>
                  <h3 className="font-wide text-xl text-[var(--color-bone)] sm:text-2xl">
                    {v.title}
                  </h3>
                </div>
                <p className="font-sans mt-3 text-[15px] leading-[1.7] text-[var(--color-bone-dim)]">
                  {v.text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Les clients ──────────────────────────────────────────────── */}
        <section className="mt-16 border-t border-[var(--color-line)] pt-12">
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Ils nous font confiance
          </p>
          <p className="font-sans mt-6 text-[1.05rem] leading-[1.8] text-[var(--color-bone-dim)]">
            {clients.map((c) => c.name).join(", ")}.
          </p>
        </section>

        {/* ── Les avis ─────────────────────────────────────────────────── */}
        <section className="mt-16 border-t border-[var(--color-line)] pt-12">
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Ce qu&apos;ils en disent
          </p>
          <div className="mt-8 flex flex-col gap-10">
            {testimonials.map((t) => (
              <blockquote key={t.name}>
                <p className="font-sans text-[1.05rem] leading-[1.7] text-[var(--color-bone)]">
                  « {t.quote} »
                </p>
                <cite className="font-cond mt-4 block text-[11px] not-italic tracking-[0.22em] text-[var(--color-bone-faint)]">
                  {t.name}
                </cite>
              </blockquote>
            ))}
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────────────── */}
        <section className="mt-16 border-t border-[var(--color-line)] pt-12">
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Et maintenant ?
          </p>
          <h2 className="font-wide mt-5 text-[clamp(1.7rem,6vw,2.4rem)] leading-[1.1] text-[var(--color-cream)]">
            Écrivons votre histoire<span className="dot">.</span>
          </h2>
          <p className="font-sans mt-6 text-[1.05rem] leading-[1.8] text-[var(--color-bone-dim)]">
            Un projet, une idée, une question ?{" "}
            <Link
              href="/contact"
              className="text-[var(--color-terra)] underline underline-offset-4 hover:opacity-70"
            >
              Écrivez-nous
            </Link>
            .
          </p>
          <p className="font-sans mt-4 text-[15px] leading-[1.8] text-[var(--color-bone-dim)]">
            <a
              href={`mailto:${site.email}`}
              className="hover:text-[var(--color-cream)]"
            >
              {site.email}
            </a>
            <span className="mx-2 text-[var(--color-bone-faint)]">·</span>
            <a
              href={`tel:${site.phoneHref}`}
              className="hover:text-[var(--color-cream)]"
            >
              {site.phone}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

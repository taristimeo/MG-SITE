import type { Metadata } from "next";
import { Suspense } from "react";
import { FilmIndex } from "@/components/FilmIndex";
import { projects, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Films",
  description: `Les films de ${site.name}, studio de production vidéo à ${site.city} : corporate, événementiel, immobilier, tourisme et clips.`,
  alternates: { canonical: "/realisations" },
};

export default function RealisationsPage() {
  const years = projects.map((p) => Number(p.year));
  const span = `${Math.min(...years)} — ${Math.max(...years)}`;

  return (
    <section className="pb-10 pt-[calc(var(--nav-h)+24px)] md:pt-[calc(var(--nav-h)+48px)]">
      <header className="gutter mb-8 flex items-baseline justify-between md:mb-16">
        <h1 className="t-display m-0">Films</h1>
        <p className="t-legend text-right">
          {projects.length} films
          <br />
          {span}
        </p>
      </header>
      <Suspense fallback={null}>
        <FilmIndex projects={projects} />
      </Suspense>
    </section>
  );
}

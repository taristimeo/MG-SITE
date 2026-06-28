import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Still } from "@/components/Poster";
import { OtherWorks } from "@/components/OtherWorks";
import { ProjectVideo } from "@/components/ProjectVideo";
import {
  projectCredits,
  projectStills,
  projects,
  projectSuggestions,
  projectThumb,
  youtubeId,
} from "@/lib/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.category}`,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const credits = projectCredits(project);
  const suggestions = projectSuggestions(project, 2);

  const stills = projectStills(project);
  const videoId = youtubeId(project.video);
  const sections = [
    { label: "Le projet", body: project.summary },
    { label: "Notre approche", body: project.approach },
    { label: "Le résultat", body: project.result },
  ];

  return (
    <article className="pb-24">
      {/* Hero : titre centré + catégorie terracotta (façon générique de film) */}
      <header className="flex min-h-[55svh] flex-col items-center justify-center px-5 pt-20 text-center sm:min-h-[62svh] sm:px-8 sm:pt-28">
        <h1 className="font-wide mx-auto max-w-[16ch] text-[clamp(3rem,13vw,12rem)] leading-[0.95] text-[var(--color-cream)]">
          {project.title}
        </h1>
        <p className="font-cond mt-6 text-sm tracking-[0.3em] text-[var(--color-terra)]">
          {project.category}
        </p>
      </header>

      {/* Galerie de stills — petits cadres « en biais » qui défilent en boucle
          (dupliquée pour boucler sans saut, légère inclinaison alternée). */}
      <div className="overflow-hidden py-8">
        <div className="marquee-x flex w-max items-center">
          {[...stills, ...stills].map((src, i) => {
            const tilt = i % 2 === 0 ? "rotate-[-3deg] translate-y-1" : "rotate-[2.5deg] -translate-y-1";
            return (
              <div
                key={`${src}-${i}`}
                className={`relative mr-4 aspect-[4/3] w-[72vw] shrink-0 overflow-hidden rounded-xl bg-[var(--color-ink-2)] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)] ring-1 ring-[var(--color-line-soft)] sm:mr-6 sm:w-[36vw] lg:w-[22vw] ${tilt}`}
              >
                <Still src={src} alt={`${project.title} — image ${(i % stills.length) + 1}`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Générique */}
      <section className="px-5 py-14 sm:px-8 sm:py-24 lg:py-32">
        <dl className="mx-auto grid max-w-[420px] grid-cols-[auto_1fr] gap-x-6 gap-y-3 sm:grid-cols-[1fr_1.2fr]">
          {credits.map((c) => (
            <div key={c.role} className="contents">
              <dt className="font-cond pt-[2px] text-right text-xs tracking-[0.12em] text-[var(--color-terra)]">
                {c.role}
              </dt>
              <dd className="font-sans text-[var(--color-bone-dim)]">{c.name}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Lecteur vidéo — façade premium, charge l'iframe au clic */}
      {videoId ? (
        <ProjectVideo
          videoId={videoId}
          posterSrc={projectThumb(project)}
          title={project.title}
        />
      ) : (
        <div className="px-5 sm:px-8 lg:px-10">
          <div className="relative mx-auto aspect-video max-w-[1600px] overflow-hidden rounded-2xl bg-[var(--color-ink-2)]">
            <Still src={projectThumb(project)} alt={project.title} />
          </div>
        </div>
      )}

      {/* Texte : Le projet / Notre approche / Le résultat */}
      <section className="px-5 pt-16 sm:px-8 sm:pt-28 lg:pt-36">
        <div className="mx-auto flex max-w-[640px] flex-col gap-10 text-center sm:gap-16">
          {sections.map((s, i) => (
            <div key={s.label}>
              <span className="font-cond text-xs tracking-[0.2em] text-[var(--color-terra)]">
                0{i + 1}
              </span>
              <h2 className="font-wide mt-3 text-2xl text-[var(--color-bone)] sm:text-3xl">
                {s.label}
              </h2>
              <p className="font-sans mt-5 text-[1.05rem] leading-[1.7] text-[var(--color-bone-dim)]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Autres réalisations */}
      <section className="px-5 pt-20 sm:px-8 sm:pt-32 lg:px-10">
        <h2 className="font-wide text-center text-[clamp(1.8rem,5vw,3.5rem)] text-[var(--color-bone)]">
          Autres réalisations
        </h2>
        <OtherWorks projects={suggestions} />
        <div className="mt-16 flex justify-center">
          <Link
            href="/realisations"
            className="font-cond rounded-full border border-[var(--color-line)] px-7 py-3 text-sm text-[var(--color-bone)] transition-colors hover:border-[var(--color-terra)] hover:text-[var(--color-terra)]"
          >
            Toutes les réalisations
          </Link>
        </div>
      </section>
    </article>
  );
}

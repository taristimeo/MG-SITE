import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Still } from "@/components/Poster";
import { DevisModal } from "@/components/DevisModal";
import { OtherWorks } from "@/components/OtherWorks";
import { ProjectStory } from "@/components/ProjectStory";
import { ProjectVideo } from "@/components/ProjectVideo";
import { Reveal } from "@/components/Reveal";
import { HeroZoom } from "@/components/HeroZoom";
import {
  projectCredits,
  projects,
  projectSuggestions,
  projectThumb,
  site,
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
  const path = `/realisations/${project.slug}`;
  const title = `${project.title} — ${project.category}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: project.summary,
      url: `${site.url}${path}`,
      type: "video.other",
      images: [{ url: projectThumb(project), alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.summary,
      images: [projectThumb(project)],
    },
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
  // Navigation cyclique film précédent / suivant (geste « à l'affiche »).
  const n = projects.length;
  const prev = projects[(index - 1 + n) % n];
  const next = projects[(index + 1) % n];

  const videoId = youtubeId(project.video);
  const sections = [
    { label: "Le projet", body: project.summary },
    { label: "Notre approche", body: project.approach },
    { label: "Le résultat", body: project.result },
  ];

  // Données structurées : la vidéo (résultats enrichis Google) + le fil
  // d'Ariane. Construites à partir des données du projet.
  const path = `/realisations/${project.slug}`;
  const pageUrl = `${site.url}${path}`;
  const videoLd = videoId
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: project.title,
        description: project.summary,
        thumbnailUrl: `${site.url}${projectThumb(project)}`,
        uploadDate: `${project.year}-01-01`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        contentUrl: project.video,
        publisher: {
          "@type": "Organization",
          name: site.name,
          logo: { "@type": "ImageObject", url: `${site.url}/icon.png` },
        },
      }
    : null;
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Réalisations",
        item: `${site.url}/realisations`,
      },
      { "@type": "ListItem", position: 3, name: project.title, item: pageUrl },
    ],
  };

  return (
    <article className="pb-24">
      {videoLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Hero cinéma : le still du film en fond très assombri (zoom arrière au
          scroll), le titre par-dessus. La vidéo, c'est le lecteur en dessous —
          une seule vidéo par page, l'image d'ouverture ne consomme rien. */}
      <header className="relative flex min-h-[68svh] flex-col items-center justify-center overflow-hidden px-5 pt-20 text-center sm:min-h-[78svh] sm:px-8 sm:pt-28">
        <div aria-hidden className="absolute inset-0">
          <div className="h-full w-full opacity-40">
            <HeroZoom>
              <Still src={projectThumb(project)} alt="" />
            </HeroZoom>
          </div>
          {/* Voiles : le fond reste une ambiance, jamais une distraction */}
          <div className="absolute inset-0 bg-[rgba(10,9,8,0.35)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,9,8,0.85)] via-transparent to-[var(--color-ink)]" />
        </div>

        <div className="relative">
          <h1 className="font-wide mx-auto max-w-[16ch] text-[clamp(3rem,13vw,12rem)] leading-[0.95] text-[var(--color-cream)]">
            {project.title}
          </h1>
          <p className="font-cond mt-6 text-sm tracking-[0.3em] text-[var(--color-terra)]">
            {project.category}
          </p>
          <p className="font-cond mt-3 text-[11px] tracking-[0.25em] text-[var(--color-bone-dim)]">
            {project.client} · {project.year}
          </p>
        </div>
      </header>

      {/* Lecteur vidéo — d'abord la vidéo, point d'entrée du récit.
          Façade premium, charge l'iframe au clic. */}
      {videoId ? (
        <ProjectVideo
          videoId={videoId}
          posterSrc={projectThumb(project)}
          title={project.title}
        />
      ) : (
        <div className="px-5 sm:px-8 lg:px-10">
          <div className="relative mx-auto aspect-video max-w-[1600px] overflow-hidden rounded-2xl bg-[var(--color-ink-2)]">
            <Still
              src={projectThumb(project)}
              alt={`${project.title} — ${project.category} · film réalisé par Mauvais Grain`}
            />
          </div>
        </div>
      )}

      {/* Générique — centré, révélé ligne à ligne en cascade */}
      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
        <dl className="mx-auto flex max-w-[420px] flex-col items-center gap-6 text-center">
          {credits.map((c, i) => (
            <Reveal key={c.role} delay={i * 70}>
              <dt className="font-cond text-xs tracking-[0.2em] text-[var(--color-terra)]">
                {c.role}
              </dt>
              <dd className="font-sans mt-1.5 text-[var(--color-bone-dim)]">
                {c.name}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Texte : Le projet / Notre approche / Le résultat */}
      <section className="px-5 pt-16 sm:px-8 sm:pt-28 lg:pt-36">
        <ProjectStory sections={sections} />
      </section>

      {/* Autres réalisations */}
      <section className="px-5 pt-20 sm:px-8 sm:pt-32 lg:px-10">
        <h2 className="font-wide text-center text-[clamp(1.8rem,5vw,3.5rem)] text-[var(--color-bone)]">
          Autres réalisations
        </h2>
        <OtherWorks projects={suggestions} />
      </section>

      {/* Navigation film précédent / suivant — la continuité « à l'affiche » */}
      <nav className="mt-24 border-t border-[var(--color-line-soft)] px-5 pt-10 sm:mt-32 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-6">
          <Link href={`/realisations/${prev.slug}`} className="group max-w-[45%]">
            <p className="font-cond text-[11px] tracking-[0.2em] text-[var(--color-bone-faint)]">
              <span
                aria-hidden
                className="mr-1 inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-2"
              >
                ←
              </span>
              Film précédent
            </p>
            <p className="font-wide mt-2 truncate text-[clamp(1.3rem,2.6vw,2rem)] leading-tight text-[var(--color-bone)] transition-colors duration-500 group-hover:text-[var(--color-cream)]">
              {prev.title}
            </p>
          </Link>

          <Link
            href="/realisations"
            className="hidden shrink-0 font-cond text-[11px] tracking-[0.2em] text-[var(--color-bone-faint)] transition-colors duration-300 hover:text-[var(--color-terra)] sm:block"
          >
            Tous les films
          </Link>

          <Link
            href={`/realisations/${next.slug}`}
            className="group max-w-[45%] text-right"
          >
            <p className="font-cond text-[11px] tracking-[0.2em] text-[var(--color-bone-faint)]">
              Film suivant
              <span
                aria-hidden
                className="ml-1 inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2"
              >
                →
              </span>
            </p>
            <p className="font-wide mt-2 truncate text-[clamp(1.3rem,2.6vw,2rem)] leading-tight text-[var(--color-bone)] transition-colors duration-500 group-hover:text-[var(--color-cream)]">
              {next.title}
            </p>
          </Link>
        </div>
      </nav>

      {/* Appel à l'action — un seul CTA sobre pour ne pas finir en cul-de-sac */}
      <section className="px-5 pt-20 text-center sm:px-8 sm:pt-28 lg:px-10">
        <Reveal>
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Un projet comme celui-ci ?
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-8 flex justify-center">
            <DevisModal label="Démarrer un projet" />
          </div>
        </Reveal>
      </section>
    </article>
  );
}

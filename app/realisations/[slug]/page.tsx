import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Still } from "@/components/Poster";
import { DevisModal } from "@/components/DevisModal";
import { OtherWorks } from "@/components/OtherWorks";
import { ProjectStory } from "@/components/ProjectStory";
import { ProjectVideo } from "@/components/ProjectVideo";
import { Reveal } from "@/components/Reveal";
import { CardMedia } from "@/components/CardMedia";
import {
  projectCredits,
  projects,
  projectPreview,
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
      {/* Hero cinéma : la preview du film en fond très assombri, le titre
          par-dessus (façon générique de film qui s'ouvre sur une image). */}
      <header className="relative flex min-h-[68svh] flex-col items-center justify-center overflow-hidden px-5 pt-20 text-center sm:min-h-[78svh] sm:px-8 sm:pt-28">
        <div aria-hidden className="absolute inset-0">
          <div className="h-full w-full opacity-40">
            <CardMedia
              src={projectThumb(project)}
              videoSrc={projectPreview(project)}
              alt=""
            />
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
      <section className="px-5 py-14 sm:px-8 sm:py-24 lg:py-32">
        <dl className="mx-auto flex max-w-[420px] flex-col items-center gap-6 text-center">
          {credits.map((c, i) => (
            <Reveal key={c.role} delay={i * 110}>
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
        <div className="mt-16 flex justify-center">
          <Link
            href="/realisations"
            className="font-cond rounded-full border border-[var(--color-line)] px-7 py-3 text-sm text-[var(--color-bone)] transition-colors hover:border-[var(--color-terra)] hover:text-[var(--color-terra)]"
          >
            Toutes les réalisations
          </Link>
        </div>
      </section>

      {/* Appel à l'action — un seul CTA sobre pour ne pas finir en cul-de-sac */}
      <section className="px-5 pt-28 text-center sm:px-8 sm:pt-40 lg:px-10">
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

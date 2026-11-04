import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Player } from "@/components/Player";
import { Rise } from "@/components/Rise";
import {
  projectCredits,
  projectPreview,
  projects,
  projectStills,
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
  const n = projects.length;
  const next = projects[(index + 1) % n];
  const videoId = youtubeId(project.video);
  const stills = projectStills(project).slice(1);
  const num = String(index + 1).padStart(2, "0");

  const sections = [
    { label: "Le projet", body: project.summary },
    { label: "L'approche", body: project.approach },
    { label: "Le résultat", body: project.result },
  ];

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
      { "@type": "ListItem", position: 2, name: "Films", item: `${site.url}/realisations` },
      { "@type": "ListItem", position: 3, name: project.title, item: pageUrl },
    ],
  };

  return (
    <article className="pt-[calc(var(--nav-h)+24px)] md:pt-[calc(var(--nav-h)+48px)]">
      {videoLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Le titre, en affiche. */}
      <header className="gutter">
        <p className="t-legend mb-5 flex justify-between">
          <span>
            <span className="inline-block w-[2.6em] text-[var(--color-terra)]">{num}</span>
            {project.client} · {project.category} · {project.year}
          </span>
          <Link href="/realisations" className="u-draw">
            ← Films
          </Link>
        </p>
        <h1 className="t-giant m-0 max-w-[12ch]">{project.title}</h1>
      </header>

      {/* Le film. */}
      <div className="gutter mt-10 md:mt-16">
        <Player videoId={videoId} poster={projectThumb(project)} preview={projectPreview(project)} title={project.title} />
      </div>

      {/* Le texte, en deux colonnes. */}
      <section className="gutter mt-20 md:mt-32 md:grid md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-4">
          <Rise>
            <dl className="t-legend space-y-3">
              {credits.map((c) => (
                <div key={c.role} className="flex gap-4">
                  <dt className="w-[9em] opacity-50">{c.role}</dt>
                  <dd className="m-0">{c.name}</dd>
                </div>
              ))}
              <div className="flex gap-4">
                <dt className="w-[9em] opacity-50">Film</dt>
                <dd className="m-0">
                  <a href={project.video} target="_blank" rel="noreferrer" className="u-draw">
                    YouTube ↗
                  </a>
                </dd>
              </div>
            </dl>
          </Rise>
        </div>
        <div className="mt-12 md:col-span-7 md:col-start-6 md:mt-0">
          {sections.map((s, i) => (
            <Rise key={s.label} className={i ? "mt-12 md:mt-16" : ""}>
              <p className="t-legend mb-4">{s.label}</p>
              <p className={i === 0 ? "t-title max-w-[26ch]" : "t-body max-w-[58ch]"}>{s.body}</p>
            </Rise>
          ))}
        </div>
      </section>

      {/* Les images, nues, à la même marge. */}
      {stills.length > 0 && (
        <section className="gutter mt-24 md:mt-40" aria-label="Images du film">
          <div className="grid grid-cols-1 gap-[var(--gutter)] md:grid-cols-2">
            {stills.map((src, i) => (
              <Rise
                as="figure"
                key={src}
                className={`m-0 ${i % 3 === 0 ? "md:col-span-2" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${project.title} — image ${i + 2}`}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video w-full object-cover"
                />
              </Rise>
            ))}
          </div>
        </section>
      )}

      {/* Le film suivant. */}
      <section className="gutter mt-28 md:mt-44">
        <Rise>
          <p className="t-legend mb-5">Film suivant</p>
          <Link href={`/realisations/${next.slug}`} className="row-link t-display inline-block">
            {next.title}
          </Link>
          <p className="t-legend mt-4">
            {next.client} · {next.category} · {next.year}
          </p>
        </Rise>
      </section>
    </article>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseChapters } from "@/components/viseur/case/CaseChapters";
import { CaseFilm } from "@/components/viseur/case/CaseFilm";
import { CaseLayer } from "@/components/viseur/case/CaseLayer";
import { CaseNext } from "@/components/viseur/case/CaseNext";
import { CaseOpening } from "@/components/viseur/case/CaseOpening";
import { CaseStills } from "@/components/viseur/case/CaseStills";
import {
  projects,
  projectStills,
  projectSuggestions,
  projectThumb,
  site,
  youtubeId,
} from "@/lib/site";

/* ─────────────────────────────────────────────────────────────────────
   L'ÉTUDE DE CAS D'UN FILM — « /viseur/<slug> ».

   Le viseur donne à voir ; l'étude de cas donne à comprendre. Elle se
   déplie par-dessus lui, garde sa grammaire (le noir, les repères
   d'angle, le monospace du HUD) et déroule ce qu'un studio doit prouver :
   l'ouverture, le film, le récit en trois chapitres, les photogrammes,
   puis le film suivant.

   Six pages statiques, une par film, chacune avec son adresse, son titre
   et sa canonique : partageable, référençable, indexable.
   ───────────────────────────────────────────────────────────────────── */

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

  const path = `/viseur/${project.slug}`;
  const title = `${project.title} — ${project.category}`;
  const thumb = projectThumb(project);

  return {
    title,
    description: project.summary,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} — ${site.name}`,
      description: project.summary,
      url: `${site.url}${path}`,
      siteName: site.name,
      locale: "fr_FR",
      type: "video.other",
      images: [{ url: thumb, alt: `${project.title} — ${project.client}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.name}`,
      description: project.summary,
      images: [thumb],
    },
  };
}

export default async function ViseurCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projectSuggestions(project, 1)[0];
  const stills = projectStills(project);
  const videoId = youtubeId(project.video);
  const path = `/viseur/${project.slug}`;

  const chapters = [
    { label: "Le projet", body: project.summary },
    { label: "Notre approche", body: project.approach },
    { label: "Le résultat", body: project.result },
  ];

  // Données structurées : le film (résultats enrichis) et le fil d'Ariane.
  // Construites à partir des seules données de lib/site.ts.
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
        name: "Le viseur",
        item: `${site.url}/viseur`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `${site.url}${path}`,
      },
    ],
  };

  return (
    <>
      {videoLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <CaseLayer index={index} total={projects.length} title={project.title}>
        <CaseOpening
          project={project}
          index={index}
          total={projects.length}
        />
        <CaseFilm
          videoId={videoId}
          poster={projectThumb(project)}
          title={project.title}
        />
        <CaseChapters chapters={chapters} />
        <CaseStills stills={stills} title={project.title} />
        <CaseNext project={next} />
      </CaseLayer>
    </>
  );
}

import type { MetadataRoute } from "next";
import { projects, projectThumb, site } from "@/lib/site";

// Plan du site généré automatiquement à partir des pages fixes et des
// réalisations (lib/site.ts). Aide Google à découvrir et indexer chaque URL,
// et référence l'image de chaque réalisation (SEO image / Google Images).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const lastModified = new Date();

  const routes = ["", "/realisations", "/studio", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${base}/realisations/${p.slug}`,
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.7,
    images: [`${base}${projectThumb(p)}`],
  }));

  return [...routes, ...projectRoutes];
}

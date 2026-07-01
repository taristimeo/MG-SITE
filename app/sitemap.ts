import type { MetadataRoute } from "next";
import { projects, site } from "@/lib/site";

// Plan du site généré automatiquement à partir des pages fixes et des
// réalisations (lib/site.ts). Aide Google à découvrir et indexer chaque URL.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;

  const routes = ["", "/realisations", "/studio", "/contact"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${base}/realisations/${p.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...routes, ...projectRoutes];
}

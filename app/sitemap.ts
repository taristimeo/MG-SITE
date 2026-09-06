import type { MetadataRoute } from "next";
import { projects, projectThumb, site } from "@/lib/site";

// Plan du site : la table (accueil), ses trois panneaux, et une page par film.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const lastModified = new Date();
  const routes = ["/", "/films", "/studio", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
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

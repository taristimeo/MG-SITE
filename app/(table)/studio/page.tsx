import type { Metadata } from "next";
import { Studio } from "@/components/montage/Studio";
import { founder, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio",
  description: `${founder.name}, réalisateur et fondateur de ${site.name} à ${site.city}. ${founder.lines.join(" ")}`,
  alternates: { canonical: "/studio" },
};

export default function StudioPage() {
  return <Studio />;
}

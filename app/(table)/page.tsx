import Link from "next/link";
import { Chutier } from "@/components/montage/Chutier";
import { films } from "@/lib/montage";
import { site } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
  description: `${site.intro} Le site est une table de montage : le film se monte au rythme de votre visite, vous reprenez la main, et votre montage part avec votre demande.`,
};

export default function Home() {
  return (
    <>
      <Chutier />
      {/* Pour les robots et les lecteurs d'écran : les films, en clair. */}
      <nav className="sr" aria-label="Les films du studio">
        <ul>
          {films.map((f) => (
            <li key={f.slug}><Link href={`/realisations/${f.slug}`}>{f.title} — {f.client} · {f.category} · {f.year}</Link></li>
          ))}
        </ul>
      </nav>
    </>
  );
}

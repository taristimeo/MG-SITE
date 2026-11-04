import Link from "next/link";
import { site } from "@/lib/site";

// Le bas de la feuille : une invitation en grand, puis une ligne de légende.
export function Footer({ year, invite = true }: { year: number; invite?: boolean }) {
  return (
    <footer className="gutter pb-8 pt-24 md:pt-40">
      {invite && (
        <div className="mb-20 md:mb-32">
          <p className="t-legend mb-5">Un film à faire ?</p>
          <Link href="/contact" className="row-link t-display inline-block">
            On en parle.
          </Link>
        </div>
      )}
      <div className="rule" />
      <div className="t-legend flex flex-col gap-3 pt-5 md:flex-row md:items-baseline md:justify-between">
        <p>
          {site.name} — {site.city}
        </p>
        <p className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={`mailto:${site.email}`} className="u-draw normal-case tracking-normal">
            {site.email}
          </a>
          <a href={`tel:${site.phoneHref}`} className="u-draw">
            {site.phone}
          </a>
          {site.socials.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="u-draw">
              {s.label}
            </a>
          ))}
        </p>
        <p className="opacity-60">© {year}</p>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { site } from "@/lib/site";

type FooterItem = { text: string; href?: string };
type FooterGroup = { label: string; items: FooterItem[] };

const groups: FooterGroup[] = [
  {
    label: "Réseaux",
    items: site.socials.map((s) => ({ text: s.label, href: s.href })),
  },
  {
    label: "Travail",
    items: [{ text: "Tous les projets", href: "/realisations" }],
  },
  {
    label: "Contact",
    items: [
      { text: "Email", href: `mailto:${site.email}` },
      { text: "Téléphone", href: `tel:${site.phoneHref}` },
    ],
  },
  {
    label: "Studio",
    items: [{ text: "À propos", href: "/studio" }],
  },
];

const itemCls =
  "font-sans text-[clamp(0.74rem,1.5vw,1rem)] font-semibold uppercase tracking-[0.05em] text-[var(--color-bone-faint)]";

function FooterItemEl({ text, href }: FooterItem) {
  if (!href) return <span className={itemCls}>{text}</span>;
  const external =
    href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href === "#";
  const cls = `${itemCls} transition-colors hover:text-[var(--color-terra)]`;
  return external ? (
    <a href={href} target={href.startsWith("http") || href === "#" ? "_blank" : undefined} rel="noreferrer" className={cls}>
      {text}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {text}
    </Link>
  );
}

export function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-[var(--color-line-soft)] px-5 pb-10 pt-16 sm:px-8 sm:pb-12 sm:pt-24 lg:px-10 lg:pt-32"
    >
      {/* Groupes imbriqués : grandes capitales + liens collés, qui s'enchaînent
          sur deux lignes (façon générique). */}
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-baseline justify-center gap-x-6 gap-y-2">
        {groups.map((g) => (
          <div key={g.label} className="flex flex-wrap items-baseline justify-center gap-x-2">
            <span className="font-sans text-[clamp(1.9rem,5.2vw,3.6rem)] font-bold uppercase leading-[1] tracking-[-0.02em] text-[var(--color-bone-dim)]">
              {g.label}
            </span>
            {g.items.map((it) => (
              <FooterItemEl key={it.text} {...it} />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-14 text-center font-cond text-[0.72rem] tracking-[0.12em] text-[var(--color-bone-faint)]">
        © {site.founded}—{new Date().getFullYear()} {site.name}
        <span className="dot">.</span> · {site.city} — {site.founder}
      </div>
    </footer>
  );
}

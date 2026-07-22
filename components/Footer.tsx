"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Révélation à l'entrée dans le viewport : fondu-montée avec léger flou qui
  // se dissipe, en cascade. Mouvement réduit : tout est visible d'emblée.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Style de révélation (transform + opacity + blur uniquement) avec délai en
  // cascade selon la position. Aucun décalage de mise en page : les éléments
  // ne font que se translater/estomper dans leur emplacement final.
  const reveal = (i: number): React.CSSProperties | undefined =>
    reduced
      ? undefined
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : "translateY(20px)",
          filter: shown ? "blur(0px)" : "blur(4px)",
          transition: `opacity 0.9s var(--ease-out-soft) ${i * 90}ms, transform 1s var(--ease-out-expo) ${i * 90}ms, filter 0.8s var(--ease-out-soft) ${i * 90}ms`,
          willChange: "opacity, transform, filter",
        };

  return (
    <footer
      ref={ref}
      id="contact"
      className="border-t border-[var(--color-line-soft)] px-5 pb-10 pt-16 sm:px-8 sm:pb-12 sm:pt-24 lg:px-10 lg:pt-32"
    >
      {/* Groupes imbriqués : grandes capitales + liens collés, qui s'enchaînent
          sur deux lignes (façon générique). */}
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-baseline justify-center gap-x-6 gap-y-2">
        {groups.map((g, gi) => (
          <div
            key={g.label}
            style={reveal(gi)}
            className="flex flex-wrap items-baseline justify-center gap-x-2"
          >
            <span className="font-sans text-[clamp(1.9rem,5.2vw,3.6rem)] font-bold uppercase leading-[1] tracking-[-0.02em] text-[var(--color-bone-dim)]">
              {g.label}
            </span>
            {g.items.map((it) => (
              <FooterItemEl key={it.text} {...it} />
            ))}
          </div>
        ))}
      </div>

      {/* NAP en clair — cohérent avec la fiche Google (référencement local) */}
      <address
        style={reveal(groups.length)}
        className="mt-14 text-center font-cond text-[0.72rem] not-italic leading-relaxed tracking-[0.14em] text-[var(--color-bone-dim)]"
      >
        {site.name} · {site.street}, {site.postalCode} {site.city} ·{" "}
        <a
          href={`tel:${site.phoneHref}`}
          className="transition-colors hover:text-[var(--color-terra)]"
        >
          {site.phone}
        </a>{" "}
        ·{" "}
        <a
          href={`mailto:${site.email}`}
          className="transition-colors hover:text-[var(--color-terra)]"
        >
          {site.email}
        </a>
      </address>

      <div
        style={reveal(groups.length + 1)}
        className="mt-5 text-center font-cond text-[0.72rem] tracking-[0.12em] text-[var(--color-bone-faint)]"
      >
        © {site.founded}—{new Date().getFullYear()} {site.name}
        <span className="dot">.</span> · {site.city} — {site.founder}
      </div>
    </footer>
  );
}

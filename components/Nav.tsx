"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/site";

// Trois mots en haut de la feuille, sur un voile de papier qui s'efface
// vers le bas.
export function Nav() {
  const path = usePathname();
  const current = (href: string) =>
    path === href || (href !== "/" && path.startsWith(href)) ? "page" : undefined;

  return (
    <nav className="nav" aria-label="Navigation principale">
      <Link href="/" className="nav-logo font-wide text-[19px] leading-none tracking-[-0.02em] sm:text-[22px]">
        Mauvais Grain
      </Link>
      <ul className="t-legend flex items-center gap-4 text-[inherit] sm:gap-9">
        {navLinks.map((l) => (
          <li key={l.href}>
            <Link href={l.href} aria-current={current(l.href)} className="u-draw py-2">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

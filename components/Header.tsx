"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="header-in mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-cond text-[14px] text-[var(--color-bone)] transition-colors hover:text-[var(--color-terra)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Logotype centré (mobile : à gauche) */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-wide text-[1.3rem] leading-none text-[var(--color-cream)] md:absolute md:left-1/2 md:-translate-x-1/2"
        >
          {site.name}
          <span className="dot">.</span>
        </Link>

        <Link
          href="/contact"
          className="hidden font-cond text-[14px] text-[var(--color-bone)] transition-colors hover:text-[var(--color-terra)] md:block"
        >
          On en parle
        </Link>

        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-8 w-8 items-center justify-center md:hidden"
        >
          <span
            className={`absolute h-px w-6 bg-[var(--color-bone)] transition-all duration-300 ease-in-out ${
              open ? "rotate-45" : "-translate-y-[4px]"
            }`}
          />
          <span
            className={`absolute h-px w-6 bg-[var(--color-bone)] transition-all duration-300 ease-in-out ${
              open ? "-rotate-45" : "translate-y-[4px]"
            }`}
          />
        </button>
      </div>

      {/* Menu mobile */}
      <div
        className={`fixed inset-0 flex flex-col justify-center bg-[var(--color-ink)] px-6 transition-opacity duration-500 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-3">
          {[...navLinks, { label: "On en parle", href: "/contact" }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-wide text-[clamp(2.2rem,9vw,3.5rem)] text-[var(--color-cream)] transition-colors hover:text-[var(--color-terra)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-12 space-y-1 font-cond text-sm text-[var(--color-bone-dim)]">
          <a href={`mailto:${site.email}`} className="block w-fit link-underline">
            {site.email}
          </a>
          <a href={`tel:${site.phoneHref}`} className="block w-fit link-underline">
            {site.phone}
          </a>
        </div>
      </div>
    </header>
  );
}

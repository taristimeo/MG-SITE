"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Mouvement réduit : l'overlay et son stagger deviennent instantanés
  // (apparition/disparition en fondu simple, sans glissement ni délais).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const menuItems = [...navLinks, { label: "On en parle", href: "/contact" }];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="header-in mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="link-underline font-cond text-[14px] text-[var(--color-bone)] transition-colors hover:text-[var(--color-terra)]"
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
          className="hidden rounded-full border border-[var(--color-line)] px-5 py-2 font-cond text-[13px] text-[var(--color-bone)] transition-colors hover:border-[var(--color-terra)] hover:bg-[var(--color-terra)] hover:text-[var(--color-ink)] md:block"
        >
          On en parle
        </Link>
      </div>

      {/* Bouton menu : hors de .header-in (qui crée un contexte d'empilement)
          pour rester cliquable et visible au-dessus de l'overlay */}
      <button
        type="button"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="absolute right-5 top-5 z-[60] flex h-8 w-8 items-center justify-center sm:right-8 lg:right-10 md:hidden"
      >
        <span
          className={`absolute inset-0 m-auto h-px w-6 bg-[var(--color-bone)] ${
            reduced ? "transition-none" : "transition-all duration-300 ease-in-out"
          } ${open ? "rotate-45" : "-translate-y-[4px]"}`}
        />
        <span
          className={`absolute inset-0 m-auto h-px w-6 bg-[var(--color-bone)] ${
            reduced ? "transition-none" : "transition-all duration-300 ease-in-out"
          } ${open ? "-rotate-45" : "translate-y-[4px]"}`}
        />
      </button>

      {/* Menu mobile — inerte quand fermé : liens ni focusables ni annoncés */}
      <div
        inert={!open}
        aria-hidden={!open}
        className={`fixed inset-0 flex flex-col justify-center overflow-hidden bg-[var(--color-ink)] px-8 md:hidden ${
          reduced ? "transition-none" : "transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        } ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Halo terracotta diffus — profondeur discrète */}
        <div
          className={`pointer-events-none absolute -right-24 -top-16 h-80 w-80 rounded-full bg-[var(--color-terra)] blur-[100px] ${
            reduced ? "transition-none" : "transition-opacity duration-1000"
          } ${open ? "opacity-[0.09]" : "opacity-0"}`}
        />

        {/* Intitulé de section */}
        <div
          style={{ transitionDelay: !reduced && open ? "80ms" : "0ms" }}
          className={`mb-8 flex items-center gap-2 font-cond text-[12px] text-[var(--color-bone-faint)] ${
            reduced
              ? "transition-none"
              : "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          } ${
            open
              ? "translate-y-0 opacity-100"
              : `${reduced ? "" : "translate-y-6"} opacity-0`
          }`}
        >
          <span className="h-px w-8 bg-[var(--color-terra)]" />
          Menu
        </div>

        <nav className="flex flex-col">
          {menuItems.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                transitionDelay: !reduced && open ? `${160 + i * 90}ms` : "0ms",
              }}
              className={`group flex items-center gap-4 border-b border-[var(--color-line-soft)] py-4 ${
                reduced
                  ? "transition-none"
                  : "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              } ${
                open
                  ? "translate-y-0 opacity-100"
                  : `${reduced ? "" : "translate-y-8"} opacity-0`
              }`}
            >
              <span className="font-cond text-[13px] text-[var(--color-terra)]">
                0{i + 1}
              </span>
              <span className="font-wide text-[clamp(2.2rem,10vw,3.6rem)] leading-none text-[var(--color-cream)] transition-colors duration-300 group-hover:text-[var(--color-terra)]">
                {l.label}
              </span>
              <span
                aria-hidden
                className="ml-auto text-[var(--color-terra)] opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:opacity-100"
              >
                &#8594;
              </span>
            </Link>
          ))}
        </nav>

        <div
          style={{
            transitionDelay:
              !reduced && open ? `${160 + menuItems.length * 90 + 80}ms` : "0ms",
          }}
          className={`mt-12 space-y-4 ${
            reduced
              ? "transition-none"
              : "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          } ${
            open
              ? "translate-y-0 opacity-100"
              : `${reduced ? "" : "translate-y-8"} opacity-0`
          }`}
        >
          <div className="space-y-1 font-cond text-sm text-[var(--color-bone-dim)]">
            <a href={`mailto:${site.email}`} className="block w-fit link-underline">
              {site.email}
            </a>
            <a href={`tel:${site.phoneHref}`} className="block w-fit link-underline">
              {site.phone}
            </a>
          </div>
          <div className="flex gap-5 font-cond text-[12px] text-[var(--color-bone-faint)]">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors duration-300 hover:text-[var(--color-terra)]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

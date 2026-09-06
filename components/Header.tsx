"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { navLinks, site } from "@/lib/site";

// Les liens de navigation partent de la racine : la table de montage est le site.
// (BASE reste là pour pouvoir remonter le site sous un préfixe si besoin.)
const BASE = "";

export function Header() {
  const [open, setOpen] = useState(false);
  const [reduced, setReduced] = useState(false);
  // Fond de la barre dès les premiers pixels de défilement.
  const [scrolled, setScrolled] = useState(false);
  // Sur l'accueil seulement : vrai une fois l'écran-titre dépassé.
  const [pastHero, setPastHero] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === BASE;

  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Position de défilement — écouteur passif, lecture throttlée en rAF pour ne
  // jamais toucher au layout pendant le scroll (iOS surtout). Relancé à chaque
  // changement de route : la nouvelle page repart en haut.
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      // Seuil ~70 % de la hauteur d'écran : le hero fait 100svh, on considère
      // qu'il est dépassé bien avant sa sortie complète.
      setPastHero(y > window.innerHeight * 0.7);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Mouvement réduit : l'overlay et son stagger deviennent instantanés
  // (apparition/disparition en fondu simple, sans glissement ni délais).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Éléments focusables du menu, bouton hamburger inclus (c'est la commande de
  // fermeture) : sert au piège de focus tant que l'overlay est ouvert.
  const focusables = useCallback(() => {
    const els: HTMLElement[] = [];
    if (burgerRef.current) els.push(burgerRef.current);
    els.push(
      ...Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ),
    );
    return els;
  }, []);

  // Accessibilité de l'overlay : focus déplacé sur le premier lien à
  // l'ouverture, Échap ferme, Tab boucle à l'intérieur, et le focus revient sur
  // le hamburger à la fermeture.
  useEffect(() => {
    if (!open) return;

    const first = menuRef.current?.querySelector<HTMLElement>("a[href]");
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = active ? items.includes(active) : false;
      if (e.shiftKey) {
        if (!inside || active === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else if (!inside || active === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      burgerRef.current?.focus();
    };
  }, [open, focusables]);

  const menuItems = [...navLinks, { label: "On en parle", href: "/contact" }];

  // Accueil : le logotype géant du hero tient lieu de wordmark. Celui du header
  // reste en retrait tant qu'on n'a pas dépassé l'écran-titre (pas de doublon).
  const logoHidden = isHome && !pastHero;

  return (
    <header data-header className="fixed inset-x-0 top-0 z-50">
      {/* Fond de la barre au défilement. Couche dédiée et non le <header>
          lui-même : un backdrop-filter sur le header en ferait un bloc
          conteneur pour l'overlay en position fixed, qui ne couvrirait plus
          l'écran. z-index négatif = derrière le contenu de la barre, mais
          toujours dans le contexte d'empilement du header. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          // 85 % d'opacité : lisible même si backdrop-filter n'est pas
          // supporté (anciens iOS / mode économie de données).
          backgroundColor: scrolled
            ? "color-mix(in srgb, var(--color-ink) 85%, transparent)"
            : "transparent",
          // Flou seulement une fois la barre active : en haut de page on
          // repasse à `none` pour ne pas laisser un backdrop composité en
          // permanence au-dessus des vidéos (coût GPU inutile sur iPhone).
          backdropFilter: scrolled ? "blur(14px) saturate(1.4)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(1.4)" : "none",
          borderBottom: `1px solid ${scrolled ? "var(--color-line-soft)" : "transparent"}`,
          transition: reduced
            ? "none"
            : "background-color 0.4s var(--ease-out-soft), border-color 0.4s var(--ease-out-soft)",
        }}
      />

      <div className="header-in mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={`${BASE}${l.href}`}
              className="link-underline font-cond text-[14px] text-[var(--color-bone)] transition-colors hover:text-[var(--color-terra)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Logotype centré (mobile : à gauche). Sur l'accueil, il s'efface tant
            que le hero est à l'écran : masqué en opacité (la place reste
            réservée, la barre ne saute pas), retiré du parcours clavier et de
            l'arbre d'accessibilité tant qu'il est invisible. */}
        <Link
          href={BASE}
          onClick={() => setOpen(false)}
          aria-hidden={logoHidden || undefined}
          tabIndex={logoHidden ? -1 : undefined}
          className={`font-wide text-[1.3rem] leading-none text-[var(--color-cream)] md:absolute md:left-1/2 md:-translate-x-1/2 ${
            reduced
              ? "transition-none"
              : "transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          } ${logoHidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
        >
          {site.name}
          <span className="dot">.</span>
        </Link>

        <Link
          href={`${BASE}/contact`}
          className="hidden rounded-full border border-[var(--color-line)] px-5 py-2 font-cond text-[13px] text-[var(--color-bone)] transition-colors hover:border-[var(--color-terra)] hover:bg-[var(--color-terra)] hover:text-[var(--color-ink)] md:block"
        >
          On en parle
        </Link>
      </div>

      {/* Bouton menu : hors de .header-in (qui crée un contexte d'empilement)
          pour rester cliquable et visible au-dessus de l'overlay */}
      <button
        ref={burgerRef}
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
        ref={menuRef}
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
              href={`${BASE}${l.href}`}
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

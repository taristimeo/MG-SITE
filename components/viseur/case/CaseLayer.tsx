"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

/**
 * L'ÉTUDE DE CAS — le calque qui se déplie par-dessus le viseur.
 *
 * Le viseur ne défile pas : c'est un calque fixe. L'étude de cas garde la
 * même règle — elle est elle-même un calque fixe qui porte SON défilement
 * (`overflow-y: auto`). Ni `body` ni `html` ne sont touchés : les trois
 * brouillons partagent le même document.
 *
 * Trois services rendus à tout ce qui est posé dedans :
 *   — la révélation au défilement (`data-reveal`), avec la racine du calque
 *     pour zone d'observation, désactivée sous `prefers-reduced-motion` ;
 *   — le fil de progression terracotta sous la barre haute, écrit hors React
 *     (aucun rendu par image de défilement) ;
 *   — Échap pour ressortir vers le viseur, sauf quand l'agrandissement d'un
 *     photogramme est ouvert (il a la priorité sur la touche).
 */
export function CaseLayer({
  index,
  total,
  title,
  children,
}: {
  index: number;
  total: number;
  title: string;
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ── La révélation au défilement ────────────────────────────────────
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const show = () => items.forEach((el) => el.classList.add("is-in"));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { root, rootMargin: "0px 0px -10% 0px", threshold: 0.06 },
    );
    items.forEach((el) => io.observe(el));

    // Ceinture et bretelles : si l'observateur ne se déclenche jamais (onglet
    // en arrière-plan au montage, calque encore masqué), rien ne doit rester
    // invisible.
    const safety = window.setTimeout(show, 2500);
    return () => {
      window.clearTimeout(safety);
      io.disconnect();
    };
  }, []);

  // ── Le fil de progression — écrit directement, jamais par React ─────
  useEffect(() => {
    const root = rootRef.current;
    const bar = progRef.current;
    if (!root || !bar) return;
    let raf = 0;
    const write = () => {
      raf = 0;
      const max = root.scrollHeight - root.clientHeight;
      const r = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0;
      bar.style.transform = `scaleX(${r.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };
    write();
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // ── Échap : on replie l'étude de cas, on retrouve la bague ─────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.metaKey || e.ctrlKey || e.altKey) return;
      // L'agrandissement d'un photogramme se ferme d'abord, lui seul.
      if (document.documentElement.hasAttribute("data-vsc-zoom")) return;
      router.push("/viseur");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  // Le calque prend le focus au montage : les flèches et la barre d'espace
  // défilent l'étude de cas, et la tabulation démarre en haut du document.
  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  const n = (v: number) => String(v).padStart(2, "0");

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      data-tone="dark"
      className="vsc-root"
      aria-label={`Étude de cas — ${title}`}
    >
      {/* ── La barre haute : le repère du viseur, tenu ──────────────── */}
      <header className="vsc-hud">
        <Link href="/viseur" className="vsc-back">
          <span className="vsc-back-arw" aria-hidden>
            ←
          </span>
          Le viseur
        </Link>

        <p className="vsc-hud-mid">
          <span className="vsc-hud-tag">Étude de cas</span>
          <em aria-hidden />
          <span className="vsc-hud-ttl">{title}</span>
        </p>

        <p className="vsc-hud-n">
          {n(index + 1)}
          <i aria-hidden>/</i>
          {n(total)}
        </p>

        <div className="vsc-prog" aria-hidden>
          <div ref={progRef} className="vsc-prog-bar" />
        </div>
      </header>

      {children}

      {/* ── Le pied : on ressort par où l'on est entré ──────────────── */}
      <footer className="vsc-foot">
        <p className="vsc-foot-l">
          {site.city.toUpperCase()} — DEPUIS {site.founded}
        </p>
        <Link href="/viseur" className="vsc-foot-link">
          Retour au viseur
        </Link>
        <a href={`mailto:${site.email}`} className="vsc-foot-mail">
          {site.email}
        </a>
      </footer>
    </div>
  );
}

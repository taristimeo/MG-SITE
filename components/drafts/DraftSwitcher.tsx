"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DRAFTS } from "@/lib/drafts";

/**
 * LE SÉLECTEUR DE BROUILLON.
 *
 * Un outil de comparaison, pas un élément de design : il ne cherche pas à
 * s'accorder aux trois maquettes, il s'en distingue franchement (verre fumé,
 * monospace) pour qu'on ne le confonde jamais avec le site.
 *
 * Il vit sur le bord GAUCHE, à mi-hauteur — le seul emplacement libre dans les
 * trois brouillons à la fois : le banc occupe le bas du centre avec sa
 * réglette, le viseur le bas avec sa bague, la pellicule le bas à droite avec
 * sa bobine.
 *
 * Replié par défaut pour ne pas peser sur le jugement ; les touches 1, 2, 3
 * basculent d'un brouillon à l'autre et H l'escamote complètement, le temps de
 * regarder un écran sans rien par-dessus.
 */
export function DraftSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);

  const current = DRAFTS.find((d) => pathname.startsWith(d.href));

  // Préférences relues au montage : le rendu serveur et la première passe
  // client restent identiques (replié, visible), on ajuste ensuite.
  useEffect(() => {
    try {
      setOpen(localStorage.getItem("mg-switcher-open") === "1");
      setHidden(localStorage.getItem("mg-switcher-hidden") === "1");
    } catch {
      /* navigation privée, stockage refusé : les valeurs par défaut suffisent */
    }
    setReady(true);
  }, []);

  const remember = useCallback((key: string, value: boolean) => {
    try {
      localStorage.setItem(key, value ? "1" : "0");
    } catch {
      /* sans stockage, le choix vaut pour la session en cours */
    }
  }, []);

  // Raccourcis clavier — hors champ de saisie.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)))
        return;

      if (e.key === "h" || e.key === "H") {
        setHidden((v) => {
          remember("mg-switcher-hidden", !v);
          return !v;
        });
        return;
      }
      const i = ["1", "2", "3"].indexOf(e.key);
      if (i !== -1 && DRAFTS[i] && !pathname.startsWith(DRAFTS[i].href)) {
        window.location.href = DRAFTS[i].href;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, remember]);

  // Pas de sélecteur sur la page de garde : elle EST le sélecteur.
  if (pathname === "/") return null;

  return (
    <div
      className={`draft-switcher ${open ? "is-open" : ""} ${hidden ? "is-hidden" : ""} ${
        ready ? "is-ready" : ""
      }`}
    >
      <div className="draft-panel">
        <p className="draft-title">
          Brouillons<span className="text-[#b76e4e]">.</span>
        </p>

        <nav className="draft-list">
          {DRAFTS.map((d, i) => {
            const active = d === current;
            return (
              <Link
                key={d.href}
                href={d.href}
                aria-current={active ? "page" : undefined}
                className={`draft-item ${active ? "is-active" : ""}`}
              >
                <span className="draft-num">{d.num}</span>
                <span className="draft-name">{d.name}</span>
                <span className="draft-key">{i + 1}</span>
              </Link>
            );
          })}
        </nav>

        <div className="draft-foot">
          <Link href="/" className="draft-foot-link">
            Tout revoir
          </Link>
          <button
            type="button"
            onClick={() => {
              setHidden(true);
              remember("mg-switcher-hidden", true);
            }}
            className="draft-foot-link"
          >
            Masquer <span className="draft-key">H</span>
          </button>
        </div>
      </div>

      {/* La languette : ouvre le panneau, et le ramène quand il est escamoté */}
      <button
        type="button"
        aria-expanded={open}
        aria-label={
          hidden
            ? "Réafficher le sélecteur de brouillon"
            : open
              ? "Replier le sélecteur de brouillon"
              : `Choisir un brouillon — actuellement ${current?.name ?? "aucun"}`
        }
        onClick={() => {
          if (hidden) {
            setHidden(false);
            remember("mg-switcher-hidden", false);
            return;
          }
          setOpen((v) => {
            remember("mg-switcher-open", !v);
            return !v;
          });
        }}
        className="draft-tab"
      >
        <span className="draft-tab-num">{current?.num ?? "—"}</span>
        <span className="draft-tab-arrow" aria-hidden>
          {open ? "‹" : "›"}
        </span>
      </button>
    </div>
  );
}

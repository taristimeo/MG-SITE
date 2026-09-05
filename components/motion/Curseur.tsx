"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { REQUETE_MOUVEMENT_REDUIT } from "./useMouvementReduit";

/* ─────────────────────────────────────────────────────────────────────
   LE CURSEUR DU SITE.

   Un disque fin qui suit le pointeur avec un temps de retard — assez
   pour qu'on sente une masse, jamais assez pour qu'on doive l'attendre.
   Au survol d'un élément marqué `data-cursor`, il grossit, se teinte de
   terracotta et dit ce qu'on peut faire : VOIR, OUVRIR, TOURNER.

   Trois règles de fabrication :
   · la position ne passe JAMAIS par l'état React — une boucle rAF écrit
     directement la transformation du nœud, et le survol n'écrit que des
     classes : ce composant ne se rend qu'UNE fois ;
   · il est posé par un portail sur le `body`, sinon le moindre ancêtre
     transformé (une animation d'entrée de page suffit) redéfinit le
     référentiel du `position: fixed` et le disque part ailleurs ;
   · il n'existe que sur pointeur fin. Au doigt, il n'y a pas de survol :
     le composant ne rend rien du tout.
   ───────────────────────────────────────────────────────────────────── */

const REQUETE_FIN = "(hover: hover) and (pointer: fine)";

/** Le mot qui s'affiche selon l'intention marquée sur l'élément. */
const MOTS: Record<string, string> = {
  grab: "VOIR",
  open: "OUVRIR",
  drag: "TOURNER",
};

/** Rattrapage par image, ramené à 60 i/s — indépendant de la fréquence d'écran. */
const RATTRAPAGE = 0.19;

export type CurseurProps = {
  /**
   * Masque le curseur système pendant que le disque est actif. À n'activer
   * que sur une page où tout est cliquable à la souris — le pointeur natif
   * reste, sinon, le repère le plus sûr.
   */
  hideNative?: boolean;
  /** Mots personnalisés, fusionnés avec VOIR / OUVRIR / TOURNER. */
  labels?: Record<string, string>;
  /**
   * Le disque vit sur le `body` : il n'hérite donc pas du ton de la page
   * qu'il survole. `dark` bascule ses couleurs sur la charte sombre.
   */
  tone?: "dark" | "light";
};

export function Curseur({ hideNative = false, labels, tone }: CurseurProps) {
  // Rien au rendu serveur : le disque n'apparaît qu'une fois le pointeur
  // reconnu comme fin. Aucun écart d'hydratation possible.
  const [actif, setActif] = useState(false);
  const [hote, setHote] = useState<HTMLElement | null>(null);

  const root = useRef<HTMLDivElement>(null);
  const mot = useRef<HTMLSpanElement>(null);
  const but = useRef({ x: -120, y: -120 });
  const pos = useRef({ x: -120, y: -120 });
  const vu = useRef(false);
  const modeRef = useRef<string | null>(null);
  const labelsRef = useRef(labels);
  labelsRef.current = labels;

  useEffect(() => setHote(document.body), []);

  // Pointeur fin ET mouvement non réduit : sinon, pas de curseur.
  useEffect(() => {
    if (!window.matchMedia) return;
    const fin = window.matchMedia(REQUETE_FIN);
    const reduit = window.matchMedia(REQUETE_MOUVEMENT_REDUIT);
    const applique = () => setActif(fin.matches && !reduit.matches);
    applique();
    fin.addEventListener("change", applique);
    reduit.addEventListener("change", applique);
    return () => {
      fin.removeEventListener("change", applique);
      reduit.removeEventListener("change", applique);
    };
  }, []);

  useEffect(() => {
    if (!actif) return;
    const el = root.current;
    if (!el) return;

    let raf = 0;
    let dernier = 0;

    const boucle = (t: number) => {
      const dt = dernier ? Math.min(64, t - dernier) : 16.7;
      dernier = t;
      // Lissage indépendant de la fréquence d'images : à 120 Hz le disque
      // suit exactement la même courbe qu'à 60 Hz.
      const k = 1 - Math.pow(1 - RATTRAPAGE, dt / 16.7);
      pos.current.x += (but.current.x - pos.current.x) * k;
      pos.current.y += (but.current.y - pos.current.y) * k;
      el.style.transform = `translate3d(${pos.current.x.toFixed(2)}px, ${pos.current.y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(boucle);
    };
    raf = requestAnimationFrame(boucle);

    const bouge = (e: PointerEvent) => {
      but.current.x = e.clientX;
      but.current.y = e.clientY;

      if (!vu.current) {
        // Première apparition : le disque se pose là où est déjà le pointeur.
        vu.current = true;
        pos.current.x = e.clientX;
        pos.current.y = e.clientY;
        el.classList.add("is-live");
      }

      const cible =
        e.target instanceof Element ? e.target.closest("[data-cursor]") : null;
      const m = cible?.getAttribute("data-cursor") ?? null;
      if (m === modeRef.current) return;

      modeRef.current = m;
      el.classList.toggle("is-hot", m !== null);
      if (m) el.dataset.mode = m;
      else delete el.dataset.mode;
      if (mot.current) {
        mot.current.textContent = m
          ? (cible?.getAttribute("data-cursor-label") ??
            labelsRef.current?.[m] ??
            MOTS[m] ??
            "")
          : "";
      }
    };

    const presse = () => el.classList.add("is-press");
    const relache = () => el.classList.remove("is-press");
    const sort = () => el.classList.remove("is-live");
    const entre = () => {
      if (vu.current) el.classList.add("is-live");
    };

    window.addEventListener("pointermove", bouge, { passive: true });
    window.addEventListener("pointerdown", presse, { passive: true });
    window.addEventListener("pointerup", relache, { passive: true });
    document.documentElement.addEventListener("pointerleave", sort);
    document.documentElement.addEventListener("pointerenter", entre);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", bouge);
      window.removeEventListener("pointerdown", presse);
      window.removeEventListener("pointerup", relache);
      document.documentElement.removeEventListener("pointerleave", sort);
      document.documentElement.removeEventListener("pointerenter", entre);
    };
  }, [actif]);

  // Le pointeur système, si on a demandé à l'effacer.
  useEffect(() => {
    if (!actif || !hideNative) return;
    document.documentElement.classList.add("mg-cur-none");
    return () => document.documentElement.classList.remove("mg-cur-none");
  }, [actif, hideNative]);

  if (!actif || !hote) return null;

  return createPortal(
    <div ref={root} className="mg-cur" data-tone={tone} aria-hidden="true">
      <span className="mg-cur-ring" />
      <span className="mg-cur-dot" />
      <span ref={mot} className="mg-cur-mot font-cond" />
    </div>,
    hote,
  );
}

export default Curseur;

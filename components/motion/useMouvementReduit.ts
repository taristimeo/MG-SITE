"use client";

import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────
   LE SEUL RÉGLAGE QUI NE SE DISCUTE PAS.

   Toutes les primitives de la chaîne de gestes interrogent la même
   source : « prefers-reduced-motion ». Le CSS neutralise déjà les
   transitions ; ce hook sert à neutraliser aussi ce que le CSS ne voit
   pas (les boucles rAF, les minuteries, les montages différés).
   ───────────────────────────────────────────────────────────────────── */

export const REQUETE_MOUVEMENT_REDUIT = "(prefers-reduced-motion: reduce)";

/** Lecture immédiate, hors React — utilisable dans un effet de mise en page. */
export function mouvementReduit(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REQUETE_MOUVEMENT_REDUIT).matches;
}

/**
 * Suit la préférence système et la met à jour si l'utilisateur la change
 * en cours de route. Vaut `false` au rendu serveur : les composants qui
 * s'en servent décident toujours AVANT la première peinture, dans un
 * effet de mise en page.
 */
export function useMouvementReduit(): boolean {
  const [reduit, setReduit] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(REQUETE_MOUVEMENT_REDUIT);
    const applique = () => setReduit(mq.matches);
    applique();
    mq.addEventListener("change", applique);
    return () => mq.removeEventListener("change", applique);
  }, []);

  return reduit;
}

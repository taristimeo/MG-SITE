"use client";

import { useEffect, useRef, useState } from "react";
import { REQUETE_MOUVEMENT_REDUIT } from "./useMouvementReduit";

/* ─────────────────────────────────────────────────────────────────────
   L'INERTIE.

   Une valeur cible entre, une valeur qui a du poids sort. Pas une
   interpolation exponentielle — un vrai ressort amorti, intégré à PAS DE
   TEMPS FIXE (1/240 s) : la course est exactement la même à 60, 120 ou
   144 images par seconde, et un ralentissement du navigateur ne change
   pas la physique, seulement le nombre de sous-pas rattrapés.

       a = ( −k·(x − cible) − c·v ) / m

   Sous le seuil de repos, la boucle rAF s'arrête net : au repos, une
   inertie ne coûte rien.
   ───────────────────────────────────────────────────────────────────── */

/** Pas d'intégration, en secondes. */
const PAS = 1 / 240;
/** Plafond de rattrapage : on ne remonte jamais plus de 64 ms d'un coup. */
const RETARD_MAX = 0.064;

export type OptionsInertie = {
  /** Raideur du ressort : plus c'est haut, plus ça tire fort. */
  stiffness?: number;
  /** Amortissement : plus c'est bas, plus ça dépasse et rebondit. */
  damping?: number;
  /** Masse : plus c'est lourd, plus c'est lent à partir comme à s'arrêter. */
  mass?: number;
  /** Seuil de repos, dans l'unité de la valeur (px, degrés, ratio…). */
  epsilon?: number;
  /** Colle la valeur à la cible, sans boucle (mouvement réduit forcé). */
  immediate?: boolean;
  /**
   * Appelé à chaque image, AVANT React. C'est par là que passent les
   * écritures directes dans le DOM (transformations, styles) quand on ne
   * veut pas d'un rendu React par image.
   */
  onFrame?: (valeur: number, vitesse: number) => void;
  /**
   * Ne prévient React qu'au repos : la valeur retournée ne bouge pas
   * pendant la course, `onFrame` fait le travail. Zéro rendu par image.
   */
  quiet?: boolean;
};

/**
 * Renvoie la cible lissée par ressort-amortisseur.
 *
 * `prefers-reduced-motion` : la valeur devient instantanée, aucune boucle
 * n'est lancée.
 */
export function useInertie(cible: number, options: OptionsInertie = {}): number {
  const {
    stiffness = 170,
    damping = 22,
    mass = 1,
    epsilon = 0.002,
    immediate = false,
    onFrame,
    quiet = false,
  } = options;

  const [valeur, setValeur] = useState(cible);

  const x = useRef(cible);
  const v = useRef(0);
  const reste = useRef(0);
  const raf = useRef(0);
  const dernier = useRef(0);
  const cibleRef = useRef(cible);
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  // Le mouvement réduit se lit ici, pas dans le CSS : c'est une boucle.
  const reduit = useRef(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(REQUETE_MOUVEMENT_REDUIT);
    const applique = () => {
      reduit.current = mq.matches;
    };
    applique();
    mq.addEventListener("change", applique);
    return () => mq.removeEventListener("change", applique);
  }, []);

  useEffect(() => {
    cibleRef.current = cible;

    const saute = () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
      dernier.current = 0;
      reste.current = 0;
      x.current = cible;
      v.current = 0;
      onFrameRef.current?.(cible, 0);
      setValeur(cible);
    };

    if (immediate || reduit.current) {
      saute();
      return;
    }

    if (x.current === cible && v.current === 0) {
      onFrameRef.current?.(cible, 0);
      return;
    }

    if (raf.current) return; // une boucle tourne déjà : elle suivra la cible

    const image = (t: number) => {
      const dt = dernier.current ? Math.min(RETARD_MAX, (t - dernier.current) / 1000) : PAS;
      dernier.current = t;
      reste.current += dt;

      const but = cibleRef.current;
      while (reste.current >= PAS) {
        const a = (-stiffness * (x.current - but) - damping * v.current) / mass;
        v.current += a * PAS;
        x.current += v.current * PAS;
        reste.current -= PAS;
      }

      const pose =
        Math.abs(x.current - but) < epsilon && Math.abs(v.current) < epsilon;
      if (pose) {
        x.current = but;
        v.current = 0;
        raf.current = 0;
        dernier.current = 0;
        reste.current = 0;
      }

      onFrameRef.current?.(x.current, v.current);
      if (!quiet || pose) setValeur(x.current);
      if (!pose) raf.current = requestAnimationFrame(image);
    };

    raf.current = requestAnimationFrame(image);
  }, [cible, stiffness, damping, mass, epsilon, immediate, quiet]);

  // Au démontage seulement : la boucle ne doit pas survivre au composant.
  useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, []);

  return valeur;
}

export default useInertie;

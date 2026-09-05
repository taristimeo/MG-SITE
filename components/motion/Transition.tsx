"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useMouvementReduit } from "./useMouvementReduit";

/* ─────────────────────────────────────────────────────────────────────
   L'ENCHAÎNEMENT.

   Un bloc n'apparaît pas : il entre. Et surtout, il ne disparaît pas :
   il SORT. C'est la sortie qui manque à presque tous les sites — on
   démonte l'enfant tout de suite et l'écran saute.

   Ici le démontage est différé : le contenu reste dans le DOM le temps
   de sa sortie (plus courte que l'entrée : on part plus vite qu'on
   n'arrive), puis il est réellement retiré — pas juste caché.
   ───────────────────────────────────────────────────────────────────── */

/** La sortie vaut 72 % de l'entrée : partir doit être plus net qu'arriver. */
const RATIO_SORTIE = 0.72;

type Etat = "avant" | "dedans" | "dehors";

export type TransitionProps = {
  /** L'enfant doit-il être là ? */
  show: boolean;
  /** Durée de l'entrée, en millisecondes. La sortie en fait 72 %. */
  duration?: number;
  children: ReactNode;
  /** Balise du conteneur. */
  as?: "div" | "section" | "article" | "aside" | "li" | "span";
  className?: string;
  style?: CSSProperties;
  /** Appelé quand le mouvement est fini : `true` entré, `false` démonté. */
  onRest?: (shown: boolean) => void;
};

export function Transition({
  show,
  duration = 560,
  children,
  as: Tag = "div",
  className,
  style,
  onRest,
}: TransitionProps) {
  const reduit = useMouvementReduit();
  const [monte, setMonte] = useState(show);
  const [etat, setEtat] = useState<Etat>(show ? "avant" : "dehors");

  const onRestRef = useRef(onRest);
  onRestRef.current = onRest;

  const entree = reduit ? 0 : duration;
  const sortie = Math.round(entree * RATIO_SORTIE);

  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    let minuterie = 0;

    if (show) {
      setMonte(true);
      // Deux images : le navigateur doit avoir peint l'état d'entrée avant
      // qu'on ne bascule, sinon la transition n'a pas lieu.
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setEtat("dedans"));
      });
      minuterie = window.setTimeout(() => onRestRef.current?.(true), entree + 32);
    } else {
      setEtat("dehors");
      minuterie = window.setTimeout(() => {
        setMonte(false);
        onRestRef.current?.(false);
      }, sortie);
    }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(minuterie);
    };
  }, [show, entree, sortie]);

  if (!monte) return null;

  return (
    <Tag
      className={`mg-tra${etat === "dedans" ? " is-in" : ""}${etat === "dehors" ? " is-out" : ""}${className ? ` ${className}` : ""}`}
      data-state={etat}
      style={
        {
          ...style,
          "--tra-in": `${entree}ms`,
          "--tra-out": `${sortie}ms`,
        } as CSSProperties
      }
      // Pendant la sortie, le bloc n'est plus une cible : ni clic, ni
      // lecteur d'écran. Il ne fait plus que finir son geste.
      aria-hidden={etat === "dehors" ? true : undefined}
      inert={etat === "dehors" ? true : undefined}
    >
      {children}
    </Tag>
  );
}

export default Transition;

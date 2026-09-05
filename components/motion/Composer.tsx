"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

/* ─────────────────────────────────────────────────────────────────────
   LES TITRES QUI SE COMPOSENT.

   Le texte est découpé en mots puis en lettres ; chaque lettre monte
   derrière un masque, en cascade, avec un flou très bref qui se dissipe
   — comme une mise au point qui se fait.

   Le décalage entre deux lettres (28 ms par défaut) doit SE SENTIR sans
   SE VOIR : au-delà de 45 ms on lit une machine à écrire, en deçà de
   15 ms on ne lit plus rien.

   Le texte reste entier pour les moteurs et les lecteurs d'écran : la
   phrase complète est posée dans un `sr-only`, la mécanique des lettres
   est `aria-hidden`.
   ───────────────────────────────────────────────────────────────────── */

type Balise =
  | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  | "p" | "span" | "div" | "strong" | "figcaption";

export type ComposerProps = {
  /** Le texte, en clair. C'est lui que liront Google et les lecteurs d'écran. */
  text: string;
  /** Retard avant la première lettre, en millisecondes. */
  delay?: number;
  /** Balise rendue. */
  as?: Balise;
  /** Décalage entre deux lettres, en millisecondes. */
  stagger?: number;
  /** Durée de la montée d'une lettre, en millisecondes. */
  duration?: number;
  /** Se compose au montage plutôt qu'à l'entrée dans le champ. */
  immediate?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Composer({
  text,
  delay = 0,
  as: Tag = "span",
  stagger = 28,
  duration = 760,
  immediate = false,
  className,
  style,
}: ComposerProps) {
  const [on, setOn] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // Un double rAF : le navigateur peint l'état de départ avant qu'on
    // ne bascule, sinon il n'y a pas de transition du tout.
    let raf1 = 0;
    let raf2 = 0;
    const allume = () => {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setOn(true));
      });
    };

    if (immediate || typeof IntersectionObserver === "undefined") {
      allume();
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        allume();
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [immediate, text]);

  const mots = text.split(" ");
  let k = 0;

  return (
    <Tag
      // Le typage des balises génériques ne se resserre pas jusqu'à la ref.
      ref={root as React.Ref<never>}
      className={`mg-cmp${on ? " is-on" : ""}${className ? ` ${className}` : ""}`}
      style={{ ...style, "--cmp-dur": `${duration}ms` } as CSSProperties}
    >
      <span className="sr-only">{text}</span>
      <span className="mg-cmp-in" aria-hidden="true">
        {mots.map((mot, wi) => (
          <Fragment key={`${wi}-${mot}`}>
            <span className="mg-cmp-w">
              {Array.from(mot).map((lettre, li) => {
                const d = delay + k++ * stagger;
                return (
                  <span className="mg-cmp-l" key={li}>
                    <i style={{ transitionDelay: `${d}ms` }}>{lettre}</i>
                  </span>
                );
              })}
            </span>
            {wi < mots.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}

export default Composer;

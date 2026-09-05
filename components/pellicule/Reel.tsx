"use client";

import type { RefObject } from "react";

/**
 * LA BOBINE.
 *
 * Le seul repère de position de la bande : elle se dévide (l'anneau de film
 * s'amincit à mesure qu'on avance), tourne à la vitesse du défilement, et
 * annonce en monospace le photogramme sous la tête de lecture.
 *
 * Tout est piloté en direct par la boucle de rendu de <Pellicule> via ces
 * trois références — aucun état React ne passe par ici : à 60 images par
 * seconde, on écrit dans le DOM plutôt que de re-rendre l'arbre.
 */
export function Reel({
  hostRef,
  filmRef,
  spokesRef,
  countRef,
  total,
}: {
  hostRef: RefObject<HTMLDivElement | null>;
  filmRef: RefObject<SVGCircleElement | null>;
  spokesRef: RefObject<SVGGElement | null>;
  countRef: RefObject<HTMLSpanElement | null>;
  total: number;
}) {
  return (
    <div ref={hostRef} className="pel-reel pel-chrome" aria-hidden="true">
      <div className="pel-read">
        <div className="pel-cnt">
          <span ref={countRef}>01</span> <i>/ {String(total).padStart(2, "0")}</i>
        </div>
        <div className="pel-cap-lbl">Bobine</div>
      </div>
      <svg viewBox="0 0 100 100" focusable="false">
        <circle className="pel-rl-out" cx="50" cy="50" r="46.5" />
        <circle
          ref={filmRef}
          className="pel-rl-film"
          cx="50"
          cy="50"
          r="34"
          strokeWidth="25"
        />
        <g ref={spokesRef} className="pel-rl-sp">
          <path className="pel-rl-tick" d="M50 6.5 L50 15" />
          <circle cx="50" cy="34" r="4.2" />
          <circle cx="63.9" cy="58" r="4.2" />
          <circle cx="36.1" cy="58" r="4.2" />
          <circle className="pel-rl-hub" cx="50" cy="50" r="5.4" />
        </g>
      </svg>
    </div>
  );
}

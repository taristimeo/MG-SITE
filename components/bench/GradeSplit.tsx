"use client";

import { useRef, useState } from "react";

/**
 * L'ÉTALONNAGE — le rideau.
 *
 * À gauche le plan tel qu'il sort de la carte, à droite le plan étalonné. Le
 * rideau suit le curseur (aucun clic à faire) et reste manœuvrable au doigt et
 * au clavier grâce au curseur natif posé par-dessus.
 *
 * C'est la démonstration la plus honnête du métier : la même image, deux
 * traitements. Le côté « rush » est une simulation de rendu à plat (contraste
 * et saturation rabattus) — la mention est affichée sous le cadre.
 */
export function GradeSplit({
  src,
  alt,
  labelLeft = "Rush",
  labelRight = "Étalonné",
}: {
  src: string;
  alt: string;
  labelLeft?: string;
  labelRight?: string;
}) {
  const [pos, setPos] = useState(48);
  const boxRef = useRef<HTMLDivElement>(null);

  const follow = (clientX: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <figure className="m-0">
      <div
        ref={boxRef}
        onMouseMove={(e) => follow(e.clientX)}
        className="relative aspect-[16/9] w-full select-none overflow-hidden rounded-xl bg-black ring-1 ring-[var(--color-line-soft)]"
      >
        {/* Le plan étalonné — l'état d'arrivée, sous le rideau */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* Le rush, rogné au rideau */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          aria-hidden
          draggable={false}
          className="grade-raw absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />

        {/* Étiquettes de part et d'autre */}
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 font-cond text-[10px] tracking-[0.2em] text-[#e8e4d8] backdrop-blur-sm sm:bottom-5 sm:left-5">
          {labelLeft}
        </span>
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/45 px-2.5 py-1 font-cond text-[10px] tracking-[0.2em] text-[#d8926f] backdrop-blur-sm sm:bottom-5 sm:right-5">
          {labelRight}
        </span>

        {/* Le rideau */}
        <div
          className="grade-handle pointer-events-none"
          style={{ left: `${pos}%` }}
          aria-hidden
        >
          <span className="grade-knob font-cond text-[11px]">
            <span aria-hidden>◂▸</span>
          </span>
        </div>

        {/* Commande réelle : native, donc utilisable au doigt et au clavier */}
        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Comparer ${labelLeft} et ${labelRight}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
        />
      </div>

      <figcaption className="mt-4 font-cond text-[10px] leading-relaxed tracking-[0.16em] text-[var(--color-bone-faint)]">
        Rendu à plat simulé à gauche · étalonnage réel à droite
      </figcaption>
    </figure>
  );
}

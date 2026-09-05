"use client";

import { useRef, useState } from "react";

/**
 * LA LOUPE À GRAIN.
 *
 * Le nom du studio pris au mot. Au survol d'une image, un disque agrandit la
 * matière et laisse remonter le grain argentique — on regarde le film de très
 * près, là où se joue la texture.
 *
 * Enrichissement au pointeur fin uniquement : au doigt, l'image reste une
 * image, rien ne se met en travers.
 */
export function GrainLoupe({
  src,
  alt,
  zoom = 2.7,
  className = "",
}: {
  src: string;
  alt: string;
  zoom?: number;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [p, setP] = useState({ x: 0, y: 0, bx: 0, by: 0, w: 0, h: 0 });

  const move = (e: React.MouseEvent) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setP({
      x,
      y,
      w: r.width * zoom,
      h: r.height * zoom,
      // Le point sous le curseur reste sous le curseur, agrandi.
      bx: -(x * zoom - 88),
      by: -(y * zoom - 88),
    });
  };

  return (
    <div
      ref={boxRef}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onMouseMove={move}
      className={`relative overflow-hidden ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="h-full w-full object-cover"
      />
      <div
        aria-hidden
        className={`loupe ${on ? "is-on" : ""}`}
        style={{
          left: `${p.x}px`,
          top: `${p.y}px`,
          transform: `translate(-50%, -50%) scale(${on ? 1 : 0.7})`,
          backgroundImage: `url(${src})`,
          backgroundSize: `${p.w}px ${p.h}px`,
          backgroundPosition: `${p.bx}px ${p.by}px`,
        }}
      />
    </div>
  );
}

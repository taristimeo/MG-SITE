"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { services } from "@/lib/site";

/**
 * L'INDEX DES MÉTIERS.
 *
 * Une ligne par prestation, rien de plus — mais au survol, l'image du métier
 * vient se poser derrière le curseur, comme une planche qu'on sort d'un
 * classeur. La page ne bouge pas : tout se joue en calque, au-dessus.
 */
const stills: Record<string, string> = {
  corporate: "/projects/graduation/3.jpg",
  evenementiel: "/projects/la-medocaine/2.jpg",
  immobilier: "/projects/silhouette/2.jpg",
  tourisme: "/projects/the-sound-of-discovery/3.jpg",
  clip: "/projects/delaurentis-gone-colors/2.jpg",
};

export function ServiceIndex() {
  const [hover, setHover] = useState<string | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const peekRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const move = (e: React.MouseEvent) => {
    pos.current = { x: e.clientX, y: e.clientY };
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const el = peekRef.current;
      if (!el) return;
      el.style.left = `${pos.current.x}px`;
      el.style.top = `${pos.current.y}px`;
    });
  };

  return (
    <div onMouseMove={move} className="relative">
      <ul className="border-t border-[var(--color-line-soft)]">
        {services.map((s) => (
          <li key={s.id} className="border-b border-[var(--color-line-soft)]">
            <Link
              href="/contact"
              onMouseEnter={() => setHover(s.id)}
              onMouseLeave={() => setHover((h) => (h === s.id ? null : h))}
              className="index-row group flex items-baseline gap-4 py-6 sm:gap-8 sm:py-9"
            >
              <span className="index-num font-cond shrink-0 text-[11px] tracking-[0.2em] text-[var(--color-bone-faint)]">
                {s.index}
              </span>
              <span className="font-wide text-[clamp(1.7rem,4.6vw,3.4rem)] leading-[1] text-[var(--color-bone)] transition-colors duration-500 group-hover:text-[var(--color-terra)]">
                {s.title}
              </span>
              <span className="ml-auto hidden max-w-[38ch] pl-8 text-right font-sans text-[0.95rem] leading-[1.65] text-[var(--color-bone-dim)] lg:block">
                {s.line}
              </span>
              <span
                aria-hidden
                className="shrink-0 text-[var(--color-terra)] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:opacity-100"
              >
                →
              </span>
            </Link>
            {/* La phrase reste lisible sous la ligne quand la colonne de droite
                n'a pas la place (mobile et tablette). */}
            <p className="-mt-3 pb-6 pl-[3.2rem] font-sans text-[0.95rem] leading-[1.6] text-[var(--color-bone-dim)] sm:pl-[4.6rem] lg:hidden">
              {s.line}
            </p>
          </li>
        ))}
      </ul>

      {/* La planche qui suit le curseur — pointeur fin seulement */}
      <div
        ref={peekRef}
        aria-hidden
        className={`index-peek hidden lg:block ${hover ? "is-on" : ""}`}
        style={{ transform: `translate(-50%, -50%) scale(${hover ? 1 : 0.94})` }}
      >
        {hover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={stills[hover]}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}

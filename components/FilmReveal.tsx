"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

// « Développement argentique » : le média entre flou + noir & blanc, puis se
// développe net et en couleur (l'effet est porté par la classe .film-reveal en
// CSS). Déclenché dès que le média entre dans le bas du viewport (contrôle
// direct par getBoundingClientRect + scroll, robuste). prefers-reduced-motion :
// révélé d'emblée.
export function FilmReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    let done = false;
    let raf = 0;
    const evaluate = () => {
      raf = 0;
      if (done) return;
      const r = node.getBoundingClientRect();
      // déclenche quand le haut du média passe sous 88% du viewport
      if (r.top < window.innerHeight * 0.88 && r.bottom > 0) {
        done = true;
        setInView(true);
        cleanup();
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(evaluate);
    };
    const cleanup = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };

    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return cleanup;
  }, []);

  return (
    <div ref={ref} className={`film-reveal ${inView ? "is-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

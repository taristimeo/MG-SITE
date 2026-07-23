"use client";

import { createElement, useEffect, useRef, useState } from "react";
import type { ElementType } from "react";

// « Titres qui se composent » : le titre se révèle MOT À MOT, chaque mot montant
// derrière un masque avec un léger flou qui se dissipe, en cascade. À l'entrée
// dans le viewport. prefers-reduced-motion : tout visible d'emblée (géré en CSS).
export function WordReveal({
  text,
  as = "h2",
  className = "",
  delay = 0,
  step = 85,
  dot = false,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  step?: number;
  // Ajoute le point terracotta signature, collé au dernier mot (même masque).
  dot?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const words = text.split(" ");

  return createElement(
    as,
    { ref, className: `word-reveal ${inView ? "is-in" : ""} ${className}`.trim() },
    words.map((w, i) => (
      <span key={i} className="word-reveal-mask">
        <span style={{ transitionDelay: `${delay + i * step}ms` }}>
          {w}
          {dot && i === words.length - 1 ? (
            <span className="dot">.</span>
          ) : null}
        </span>
      </span>
    )),
  );
}

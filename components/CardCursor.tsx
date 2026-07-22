"use client";

import { useEffect, useRef, useState } from "react";

// Curseur « VOIR » réutilisable : enveloppe une grille de cards de réalisation
// et affiche un petit disque qui suit le pointeur. Le disque se teinte
// terracotta au contact d'une card (élément portant [data-card]).
//
// Actif UNIQUEMENT sur pointeur fin/desktop — « (hover: hover) and
// (pointer: fine) » — et désactivé en tactile comme en mouvement réduit. Le
// disque est en pointer-events:none : il ne gêne ni le clic, ni la navigation,
// ni l'overlay/gradient existant au survol.
export function CardCursor({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [enabled, setEnabled] = useState(false);
  const discRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef(0);
  // On garde les états courants dans des refs pour positionner le disque sans
  // re-render à chaque mouvement du pointeur.
  const visibleRef = useRef(false);
  const activeRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(fine.matches && !reduce.matches);
    sync();
    fine.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const disc = discRef.current;
    if (!disc) return;

    let x = -100;
    let y = -100;

    const paint = () => {
      rafRef.current = 0;
      const scale = activeRef.current ? 1 : 0.7;
      disc.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
    };
    const schedule = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(paint);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      const over = !!(e.target as Element).closest?.("[data-card]");
      if (over !== activeRef.current) {
        activeRef.current = over;
        disc.classList.toggle("is-active", over);
      }
      if (!visibleRef.current) {
        visibleRef.current = true;
        disc.classList.add("is-visible");
      }
      schedule();
    };
    const hide = () => {
      if (visibleRef.current) {
        visibleRef.current = false;
        disc.classList.remove("is-visible");
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("scroll", hide);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  return (
    <div className={className}>
      {children}
      {enabled && (
        <div ref={discRef} aria-hidden className="card-cursor">
          <span className="font-cond text-[10px] tracking-[0.22em]">Voir</span>
        </div>
      )}
    </div>
  );
}

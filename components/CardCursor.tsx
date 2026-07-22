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

    // Cible = position réelle du pointeur ; rendu = position lissée du disque.
    // Le disque « rattrape » le pointeur via une interpolation (lerp) sur une
    // boucle rAF continue, pour un suivi soyeux plutôt qu'un accrochage sec.
    let tx = -100;
    let ty = -100;
    let x = -100;
    let y = -100;
    let scale = 0.7;
    let first = true;
    let running = false;

    // Facteurs de lissage : la position glisse, l'échelle réagit un peu plus vif.
    const FOLLOW = 0.16;
    const SCALE_FOLLOW = 0.2;

    const frame = () => {
      const tScale = activeRef.current ? 1 : 0.7;
      x += (tx - x) * FOLLOW;
      y += (ty - y) * FOLLOW;
      scale += (tScale - scale) * SCALE_FOLLOW;
      disc.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;

      const settled =
        Math.abs(tx - x) < 0.1 &&
        Math.abs(ty - y) < 0.1 &&
        Math.abs(tScale - scale) < 0.002;

      // On laisse tourner tant que le disque est visible (le pointeur peut
      // s'arrêter) ; une fois masqué ET posé, on rend la main au navigateur.
      if (!visibleRef.current && settled) {
        running = false;
        rafRef.current = 0;
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!running) {
        running = true;
        rafRef.current = requestAnimationFrame(frame);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      // Première apparition : on colle le disque au pointeur pour éviter un
      // long vol depuis le coin de l'écran.
      if (first) {
        first = false;
        x = tx;
        y = ty;
      }
      const over = !!(e.target as Element).closest?.("[data-card]");
      if (over !== activeRef.current) {
        activeRef.current = over;
        disc.classList.toggle("is-active", over);
      }
      if (!visibleRef.current) {
        visibleRef.current = true;
        disc.classList.add("is-visible");
      }
      start();
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

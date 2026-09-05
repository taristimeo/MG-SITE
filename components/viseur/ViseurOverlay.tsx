"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Un panneau qui se pose PAR-DESSUS l'image, en verre fumé.
 *
 * Jamais l'impression d'avoir changé de page : le viseur continue de vivre
 * derrière (le timecode avance, le point REC bat), on ne fait que poser une
 * vitre dépolie devant. Fermeture à Échap et par le bouton dédié, focus
 * piégé à l'intérieur, focus rendu au bouton du HUD à la sortie.
 *
 * Le verrou de défilement n'a pas lieu d'être : le viseur est un calque fixe,
 * le document ne défile pas. On ne touche donc ni à `body` ni à `html`.
 */
export function ViseurOverlay({
  open,
  onClose,
  kicker,
  title,
  children,
  reduced,
}: {
  open: boolean;
  onClose: () => void;
  kicker: string;
  title: string;
  children: React.ReactNode;
  reduced: boolean;
}) {
  const [render, setRender] = useState(false);
  const [shown, setShown] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Montage différé pour laisser jouer l'entrée, démontage différé pour la
  // sortie — le panneau ne clignote jamais.
  useEffect(() => {
    if (open) {
      setRender(true);
      return;
    }
    if (!render) return;
    setShown(false);
    const t = window.setTimeout(() => setRender(false), reduced ? 0 : 420);
    return () => window.clearTimeout(t);
  }, [open, render, reduced]);

  useEffect(() => {
    if (!render || !open) return;
    const r = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(r);
  }, [render, open]);

  // Échap + piège de focus.
  useEffect(() => {
    if (!open || !render) return;
    triggerRef.current = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.tabIndex >= 0 && !el.closest('[aria-hidden="true"]'));

    (focusables()[0] ?? panelRef.current)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        panelRef.current?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === first || !panelRef.current?.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !panelRef.current?.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      triggerRef.current?.focus?.();
    };
  }, [open, render, onClose]);

  if (!render) return null;

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={`vs-overlay${shown ? " is-open" : ""}`}
    >
      <div className="vs-overlay-head">
        <div>
          <p className="vs-overlay-kicker">{kicker}</p>
          <h2 id={titleId} className="vs-overlay-title">
            {title}
            <span className="dot">.</span>
          </h2>
        </div>
        <button type="button" className="vs-close" onClick={onClose}>
          Fermer <span aria-hidden>✕</span>
        </button>
      </div>
      <div className="vs-overlay-body">{children}</div>
    </div>
  );
}

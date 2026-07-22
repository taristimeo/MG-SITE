"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DevisForm } from "@/components/DevisForm";

// Bouton d'appel qui ouvre le formulaire de devis dans une fenêtre (modale).
// La modale est rendue via un portail dans <body> pour échapper aux parents
// animés (transform), sinon `position: fixed` ne couvre pas tout l'écran.
export function DevisModal({
  label = "Demander un devis",
  className,
}: {
  label?: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // `render` garde le portail monté pendant l'animation de sortie ; `shown`
  // pilote l'état d'entrée/sortie (opacité + translation) via transition CSS.
  const [render, setRender] = useState(false);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  // Élément déclencheur mémorisé pour restaurer le focus à la fermeture.
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  // Montage/démontage différé pour laisser jouer l'entrée puis la sortie.
  useEffect(() => {
    if (open) {
      setRender(true);
      return;
    }
    if (!render) return;
    setShown(false);
    const t = setTimeout(() => setRender(false), reduced ? 0 : 480);
    return () => clearTimeout(t);
  }, [open, render, reduced]);

  // Une fois monté, on bascule à l'état « entré » à la frame suivante pour
  // déclencher la transition (backdrop en fondu, panneau qui monte et se pose).
  useEffect(() => {
    if (!render || !open) return;
    const r = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(r);
  }, [render, open]);

  // Verrou du scroll + fermeture clavier (Échap) + gestion du focus (a11y).
  useEffect(() => {
    if (!open || !render) return;
    document.body.style.overflow = "hidden";

    // Mémorise l'élément qui avait le focus avant l'ouverture.
    triggerRef.current = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

    // Déplace le focus dans la modale (1er champ, sinon le panneau).
    const first = focusables()[0];
    (first ?? panelRef.current)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      // Piège de focus : Tab / Shift+Tab bouclent à l'intérieur du panneau.
      if (e.key === "Tab") {
        const items = focusables();
        if (items.length === 0) {
          e.preventDefault();
          panelRef.current?.focus();
          return;
        }
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey) {
          if (active === firstEl || !panelRef.current?.contains(active)) {
            e.preventDefault();
            lastEl.focus();
          }
        } else if (active === lastEl || !panelRef.current?.contains(active)) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      // Restaure le focus sur l'élément déclencheur.
      triggerRef.current?.focus?.();
    };
  }, [open, render]);

  const overlay = (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="devis-modal-title"
    >
      {/* Fond assombri — couvre tout l'écran, ferme au clic */}
      <div
        className="fixed inset-0 bg-[rgba(6,5,4,0.78)] backdrop-blur-sm"
        style={{
          opacity: shown ? 1 : 0,
          transition: reduced ? "none" : "opacity 0.34s var(--ease-out-expo)",
        }}
        onClick={() => setOpen(false)}
      />

      {/* Zone centrée et défilable si le contenu dépasse la hauteur d'écran */}
      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          ref={panelRef}
          tabIndex={-1}
          style={{
            opacity: shown ? 1 : 0,
            transform: reduced
              ? "none"
              : shown
                ? "translateY(0) scale(1)"
                : "translateY(16px) scale(0.985)",
            transition: reduced
              ? "none"
              : "opacity 0.42s var(--ease-out-expo), transform 0.48s var(--ease-out-expo)",
            willChange: "opacity, transform",
          }}
          className="relative w-full max-w-[600px] rounded-2xl border border-[var(--color-line-soft)] bg-[var(--color-ink)] p-6 shadow-2xl outline-none sm:p-9"
        >
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="font-cond text-[11px] tracking-[0.22em] text-[var(--color-bone-faint)]">
                Un projet en tête ?
              </p>
              <h2
                id="devis-modal-title"
                className="font-wide mt-2 text-[clamp(1.5rem,4.2vw,2.2rem)] leading-none text-[var(--color-cream)]"
              >
                Demander un devis<span className="dot">.</span>
              </h2>
            </div>

            {/* Croix de fermeture */}
            <button
              type="button"
              aria-label="Fermer"
              onClick={() => setOpen(false)}
              className="relative -mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--color-bone)] transition-colors duration-300 hover:text-[var(--color-terra)]"
            >
              <span className="absolute h-px w-5 rotate-45 bg-current" />
              <span className="absolute h-px w-5 -rotate-45 bg-current" />
            </button>
          </div>

          <DevisForm />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "btn-cta font-cond rounded-full bg-[var(--color-terra)] px-9 py-4 text-sm text-[var(--color-ink)]"
        }
      >
        {label}
      </button>

      {mounted && render ? createPortal(overlay, document.body) : null}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { DevisForm } from "@/components/DevisForm";

// Bouton d'appel qui ouvre le formulaire de devis dans une fenêtre (modale).
// La modale est rendue via un portail dans <body> pour échapper aux parents
// animés (transform), sinon `position: fixed` ne couvre pas tout l'écran.
export function DevisModal({
  label = "Demander un devis",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Verrou du scroll de la page + fermeture au clavier (Échap).
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const overlay = (
    <div className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain">
      {/* Fond assombri — couvre tout l'écran, ferme au clic */}
      <div
        className="modal-backdrop fixed inset-0 bg-[rgba(6,5,4,0.78)] backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Zone centrée et défilable si le contenu dépasse la hauteur d'écran */}
      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="modal-panel relative w-full max-w-[600px] rounded-2xl border border-[var(--color-line-soft)] bg-[var(--color-ink)] p-6 shadow-2xl sm:p-9">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="font-cond text-[11px] tracking-[0.22em] text-[var(--color-bone-faint)]">
                Un projet en tête ?
              </p>
              <h2 className="font-wide mt-2 text-[clamp(1.5rem,4.2vw,2.2rem)] leading-none text-[var(--color-cream)]">
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

      {mounted && open ? createPortal(overlay, document.body) : null}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { DevisForm } from "@/components/DevisForm";

// Bouton d'appel qui ouvre le formulaire de devis dans une fenêtre (modale).
export function DevisModal({
  label = "Demander un devis",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  // Verrou du scroll + fermeture au clavier (Échap) quand la modale est ouverte.
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

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain p-4 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Demander un devis"
        >
          {/* Fond assombri — ferme au clic */}
          <div
            className="modal-backdrop fixed inset-0 bg-[rgba(6,5,4,0.74)] backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panneau */}
          <div className="modal-panel relative z-10 my-auto w-full max-w-[600px] rounded-2xl border border-[var(--color-line-soft)] bg-[var(--color-ink)] p-6 shadow-2xl sm:p-9">
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
      )}
    </>
  );
}

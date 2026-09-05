"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const pad = (v: number) => String(v).padStart(2, "0");

/**
 * LA GALERIE DE PHOTOGRAMMES.
 *
 * Une bande horizontale qu'on pousse au doigt, à la molette ou au clavier.
 * La molette est détournée tant qu'il reste de la bande à parcourir, puis
 * rendue à la page : on ne se retrouve jamais coincé dans le ruban.
 *
 * Cliquer un photogramme l'agrandit plein cadre — l'agrandissement piège le
 * focus, se navigue aux flèches et se ferme à Échap, et rend le focus au
 * photogramme d'où l'on est parti.
 */
export function CaseStills({
  stills,
  title,
}: {
  stills: string[];
  title: string;
}) {
  const total = stills.length;
  const railRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const zoomRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const isOpen = open !== null;

  // ── La molette pousse la bande, puis rend la main à la page ───────
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // zoom du navigateur
      const raw =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (!raw) return;
      // deltaMode 1 = lignes, 2 = pages : on les ramène en pixels.
      const d = raw * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? rail.clientWidth : 1);
      const max = rail.scrollWidth - rail.clientWidth;
      if (max <= 0) return;
      const at = rail.scrollLeft;
      if ((d < 0 && at <= 0.5) || (d > 0 && at >= max - 0.5)) return;
      e.preventDefault();
      rail.scrollLeft = Math.min(max, Math.max(0, at + d));
    };
    rail.addEventListener("wheel", onWheel, { passive: false });
    return () => rail.removeEventListener("wheel", onWheel);
  }, []);

  // ── Le clavier dans la bande : on passe d'un photogramme à l'autre ─
  const onRailKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const at = btnRefs.current.findIndex((b) => b === document.activeElement);
      if (at === -1) return;
      let to = -1;
      if (e.key === "ArrowRight") to = Math.min(total - 1, at + 1);
      else if (e.key === "ArrowLeft") to = Math.max(0, at - 1);
      else if (e.key === "Home") to = 0;
      else if (e.key === "End") to = total - 1;
      if (to === -1 || to === at) return;
      e.preventDefault();
      btnRefs.current[to]?.focus();
    },
    [total],
  );

  const focusThumb = useCallback((i: number) => {
    const b = btnRefs.current[i];
    if (!b) return;
    b.focus();
    b.scrollIntoView({ block: "nearest", inline: "center" });
  }, []);

  const close = useCallback(() => {
    const from = open;
    setOpen(null);
    if (from !== null) requestAnimationFrame(() => focusThumb(from));
  }, [open, focusThumb]);

  // ── L'agrandissement : Échap, flèches, piège de focus ─────────────
  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.setAttribute("data-vsc-zoom", "");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        close();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setOpen((v) => (v === null ? v : (v + 1) % total));
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setOpen((v) => (v === null ? v : (v - 1 + total) % total));
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(
        zoomRef.current?.querySelectorAll<HTMLElement>("button") ?? [],
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const cur = document.activeElement;
      if (e.shiftKey) {
        if (cur === first || !zoomRef.current?.contains(cur)) {
          e.preventDefault();
          last.focus();
        }
      } else if (cur === last || !zoomRef.current?.contains(cur)) {
        e.preventDefault();
        first.focus();
      }
    };

    // La molette et le doigt ne doivent pas faire défiler l'étude de cas
    // derrière l'agrandissement.
    const el = zoomRef.current;
    const stop = (e: Event) => e.preventDefault();

    window.addEventListener("keydown", onKey, true);
    el?.addEventListener("wheel", stop, { passive: false });
    el?.addEventListener("touchmove", stop, { passive: false });
    return () => {
      document.documentElement.removeAttribute("data-vsc-zoom");
      window.removeEventListener("keydown", onKey, true);
      el?.removeEventListener("wheel", stop);
      el?.removeEventListener("touchmove", stop);
    };
  }, [isOpen, total, close]);

  // Le focus entre dans l'agrandissement à son ouverture, une seule fois.
  useEffect(() => {
    if (!isOpen) return;
    zoomRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, [isOpen]);

  return (
    <section className="vsc-stills" aria-labelledby="vsc-stills-h">
      <div className="vsc-stills-head">
        <p className="vsc-seclabel" data-reveal>
          <span className="vsc-seclabel-n">Photogrammes</span>
        </p>
        <h2 id="vsc-stills-h" className="sr-only">
          Photogrammes du film
        </h2>
        <p className="vsc-stills-count" data-reveal>
          {pad(total)} images
          <em aria-hidden />
          <span className="vsc-stills-cue">Poussez la bande</span>
        </p>
      </div>

      <div
        ref={railRef}
        className="vsc-rail"
        onKeyDown={onRailKey}
        role="group"
        aria-label="Photogrammes — flèches gauche et droite pour parcourir"
        data-reveal
      >
        {stills.map((src, i) => (
          <button
            key={src}
            type="button"
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            className="vsc-still"
            onClick={() => setOpen(i)}
            aria-label={`Agrandir le photogramme ${i + 1} sur ${total}`}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
            <span className="vsc-still-n" aria-hidden>
              {pad(i + 1)}
            </span>
            <span className="vsc-still-veil" aria-hidden />
          </button>
        ))}
      </div>

      {/* ── L'agrandissement ──────────────────────────────────────── */}
      {isOpen ? (
        <div
          ref={zoomRef}
          className="vsc-zoom"
          role="dialog"
          aria-modal="true"
          aria-label={`Photogramme ${open + 1} sur ${total} — ${title}`}
        >
          <button
            type="button"
            className="vsc-zoom-close"
            onClick={close}
            aria-label="Fermer l'agrandissement"
          >
            Fermer <span aria-hidden>✕</span>
          </button>

          <figure className="vsc-zoom-fig">
            <img
              src={stills[open]}
              alt={`${title} — photogramme ${open + 1}`}
              decoding="async"
            />
          </figure>

          <div className="vsc-zoom-bar">
            <button
              type="button"
              className="vsc-zoom-nav"
              onClick={() => setOpen((v) => (v === null ? v : (v - 1 + total) % total))}
              aria-label="Photogramme précédent"
            >
              <span aria-hidden>←</span>
            </button>
            <p className="vsc-zoom-n">
              {pad(open + 1)}
              <i aria-hidden>/</i>
              {pad(total)}
            </p>
            <button
              type="button"
              className="vsc-zoom-nav"
              onClick={() => setOpen((v) => (v === null ? v : (v + 1) % total))}
              aria-label="Photogramme suivant"
            >
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

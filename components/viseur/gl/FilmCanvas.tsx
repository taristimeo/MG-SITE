"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FilmRenderer } from "./FilmRenderer";

export type FilmCanvasHandle = {
  /** Pose un plan sans transition. */
  set: (url: string) => void;
  /** Passe au plan suivant par déplacement. */
  go: (url: string) => void;
  /** Branche l'extrait du plan courant (ou le débranche avec null). */
  attachVideo: (v: HTMLVideoElement | null) => void;
};

/**
 * La fenêtre de projection.
 *
 * Monte le canvas et le projecteur WebGL. Si le contexte n'est pas obtenu —
 * machine ancienne, accélération désactivée, contexte refusé — `onReady(false)`
 * est appelé et l'appelant garde son affichage HTML : le site fonctionne
 * exactement pareil, sans la matière.
 */
export const FilmCanvas = forwardRef<
  FilmCanvasHandle,
  { onReady?: (ok: boolean) => void; className?: string }
>(function FilmCanvas({ onReady, className = "" }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<FilmRenderer | null>(null);
  const [ok, setOk] = useState(false);

  // Les appels reçus avant que le projecteur soit prêt ne doivent pas être
  // perdus : on garde le dernier.
  const pending = useRef<{ url: string; animated: boolean } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const r = new FilmRenderer(canvas);
    if (!r.ok) {
      onReady?.(false);
      return () => r.destroy();
    }

    rendererRef.current = r;
    setOk(true);
    onReady?.(true);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => r.setReduced(mq.matches);
    syncMotion();
    mq.addEventListener("change", syncMotion);

    const ro = new ResizeObserver(() => r.resize());
    ro.observe(canvas);

    if (pending.current) {
      const { url, animated } = pending.current;
      pending.current = null;
      if (animated) void r.go(url);
      else void r.set(url);
    }

    return () => {
      mq.removeEventListener("change", syncMotion);
      ro.disconnect();
      r.destroy();
      rendererRef.current = null;
    };
    // onReady est stable côté appelant (useCallback) ; on ne remonte jamais
    // le projecteur, ce serait perdre toutes les textures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      set: (url) => {
        const r = rendererRef.current;
        if (r) void r.set(url);
        else pending.current = { url, animated: false };
      },
      go: (url) => {
        const r = rendererRef.current;
        if (r) void r.go(url);
        else pending.current = { url, animated: true };
      },
      attachVideo: (v) => rendererRef.current?.attachVideo(v),
    }),
    [],
  );

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`vs-canvas${ok ? " is-on" : ""} ${className}`}
    />
  );
});

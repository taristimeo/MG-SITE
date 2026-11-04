"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FilmRenderer } from "./FilmRenderer";

export type FilmHandle = {
  set: (url: string, developMs?: number) => void;
  go: (url: string, ms?: number) => void;
  develop: (ms?: number) => void;
  blank: () => void;
  attachVideo: (v: HTMLVideoElement | null) => void;
  setLight: (x: number, y: number, on: boolean) => void;
};

type Props = {
  /** Image posée au montage (développée quand le cadre entre dans le champ). */
  src: string;
  alt: string;
  className?: string;
  /** Extrait vidéo muet joué au survol (appareils avec pointeur) ou en continu. */
  video?: string;
  videoMode?: "hover" | "always" | "none";
  /** Développement déclenché à l'entrée dans le champ (sinon à la main). */
  developOnView?: boolean;
  /** La lumière suit le pointeur dans le cadre. */
  light?: boolean;
  onReady?: (ok: boolean) => void;
};

/**
 * Un tirage : le cadre dans lequel les images se développent. WebGL si
 * possible, sinon l'image elle-même avec un développement CSS.
 */
export const FilmCanvas = forwardRef<FilmHandle, Props>(function FilmCanvas(
  {
    src,
    alt,
    className = "",
    video,
    videoMode = "hover",
    developOnView = true,
    light = true,
    onReady,
  },
  ref,
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rendererRef = useRef<FilmRenderer | null>(null);
  const [gl, setGl] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);

  useImperativeHandle(ref, () => ({
    set: (url, ms) => void rendererRef.current?.set(url, ms),
    go: (url, ms) => void rendererRef.current?.go(url, ms),
    develop: (ms) => rendererRef.current?.develop(ms, true),
    blank: () => rendererRef.current?.blank(),
    attachVideo: (v) => rendererRef.current?.attachVideo(v),
    setLight: (x, y, on) => rendererRef.current?.setLight(x, y, on),
  }));

  // Création du rendu.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const r = new FilmRenderer(canvas);
    rendererRef.current = r;
    const ok = r.ok;
    setGl(ok);
    onReady?.(ok);
    if (!ok) {
      r.destroy();
      rendererRef.current = null;
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMq = () => r.setReduced(mq.matches);
    applyMq();
    mq.addEventListener("change", applyMq);

    const ro = new ResizeObserver(() => r.resize());
    ro.observe(wrap);

    let developed = false;
    const io = new IntersectionObserver(
      ([e]) => {
        const vis = e.isIntersecting;
        setInView(vis);
        r.setPaused(!vis);
        if (vis && !developed) {
          developed = true;
          void r.set(src, developOnView ? 1500 : 1);
        }
      },
      { rootMargin: "80px 0px" },
    );
    io.observe(wrap);

    return () => {
      mq.removeEventListener("change", applyMq);
      ro.disconnect();
      io.disconnect();
      r.destroy();
      rendererRef.current = null;
    };
    // `src` initial seulement : les changements passent par la poignée.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lumière sous la main.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !light) return;
    const move = (e: PointerEvent) => {
      const b = wrap.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width;
      const y = 1 - (e.clientY - b.top) / b.height;
      rendererRef.current?.setLight(x, y, true);
    };
    const leave = () => rendererRef.current?.setLight(0.5, 0.5, false);
    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerleave", leave);
    return () => {
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerleave", leave);
    };
  }, [light]);

  // Extrait vidéo : au survol (pointeur fin) ou en continu quand visible.
  useEffect(() => {
    const wrap = wrapRef.current;
    const v = videoRef.current;
    if (!wrap || !v || !video || videoMode === "none") return;
    const r = () => rendererRef.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const play = () => {
      if (!v.src) v.src = video;
      r()?.attachVideo(v);
      v.play().catch(() => {});
    };
    const stop = () => {
      v.pause();
      r()?.attachVideo(null);
    };

    if (videoMode === "always" || !fine) {
      if (inView) play();
      else stop();
      return () => stop();
    }
    wrap.addEventListener("pointerenter", play);
    wrap.addEventListener("pointerleave", stop);
    return () => {
      wrap.removeEventListener("pointerenter", play);
      wrap.removeEventListener("pointerleave", stop);
      stop();
    };
  }, [video, videoMode, inView]);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden bg-[var(--color-paper-2)] ${className}`}>
      {gl === false && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`develop absolute inset-0 h-full w-full object-cover ${inView ? "is-in" : ""}`}
          loading="lazy"
        />
      )}
      <canvas
        ref={canvasRef}
        className={`gl ${gl ? "is-on" : ""}`}
        aria-label={gl ? alt : undefined}
        role={gl ? "img" : undefined}
      />
      {video && videoMode !== "none" && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          crossOrigin="anonymous"
          className="pointer-events-none absolute h-px w-px opacity-0"
          aria-hidden
          tabIndex={-1}
        />
      )}
    </div>
  );
});

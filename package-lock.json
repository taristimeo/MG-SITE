"use client";

import { useEffect, useRef, useState } from "react";
import { Still } from "@/components/Poster";

// Hauteur de la zone épinglée (en svh) : plus c'est grand, plus l'agrandissement
// dure longtemps au scroll.
const HEIGHT_SVH = 230;
const MIN_SCALE = 0.46; // taille « bloquée » au départ
const PLAY_AT = 0.9; // progression à partir de laquelle on lance la lecture muette

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const smooth = (n: number) => {
  const x = clamp01(n);
  return x * x * (3 - 2 * x);
};

// Lecteur vidéo premium : la vidéo est bloquée en petit, grandit au fil du
// scroll, puis se lance automatiquement (son coupé) une fois en grand.
export function ProjectVideo({
  videoId,
  posterSrc,
  title,
}: {
  videoId: string;
  posterSrc: string;
  title: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const section = sectionRef.current;
    if (!section) return;

    const render = (p: number) => {
      const scale = MIN_SCALE + (1 - MIN_SCALE) * smooth(p);
      if (frameRef.current) {
        frameRef.current.style.transform = `scale(${scale})`;
      }
      if (!playingRef.current && p >= PLAY_AT) {
        playingRef.current = true;
        setPlaying(true);
      }
    };

    const readTarget = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      return clamp01(total > 0 ? -rect.top / total : 0);
    };

    let raf = 0;
    let running = false;
    let current = readTarget();

    const loop = () => {
      const target = readTarget();
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        render(current);
        running = false;
        raf = 0;
        return;
      }
      render(current);
      raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    render(current);
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const frame = (
    <div
      ref={frameRef}
      className="relative aspect-video w-full max-w-[1600px] overflow-hidden rounded-2xl bg-[var(--color-ink-2)] shadow-[0_60px_160px_-50px_rgba(0,0,0,0.9)] ring-1 ring-[var(--color-line-soft)] will-change-transform"
      style={reduced ? undefined : { transform: `scale(${MIN_SCALE})` }}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Lire la vidéo — ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          <Still src={posterSrc} alt={title} />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,9,8,0.5)] via-transparent to-[rgba(10,9,8,0.12)]" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-20 sm:w-20">
            <span className="play-pulse flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-black/25 backdrop-blur-[2px] transition-all duration-500 group-hover:scale-110 group-hover:border-[var(--color-terra)] sm:h-20 sm:w-20">
              <svg width="18" height="22" viewBox="0 0 15 17" fill="none" aria-hidden className="ml-1">
                <path
                  d="M14 7.13L2.5 0.49A1.6 1.6 0 000 1.86v13.28a1.6 1.6 0 002.5 1.37L14 9.87a1.6 1.6 0 000-2.74z"
                  fill="currentColor"
                  className="text-white"
                />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );

  // Repli sans animation : lecteur classique pleine largeur, lecture au clic.
  if (reduced) {
    return (
      <div className="px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1600px]">{frame}</div>
      </div>
    );
  }

  // Zone épinglée : la vidéo grandit pendant qu'on scrolle, puis se lance.
  return (
    <section ref={sectionRef} style={{ height: `${HEIGHT_SVH}svh` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-5 sm:px-8 lg:px-10">
        {frame}
      </div>
    </section>
  );
}

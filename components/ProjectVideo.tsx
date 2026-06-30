"use client";

import { useEffect, useRef, useState } from "react";
import { Still } from "@/components/Poster";

// Lecteur vidéo premium : présenté en pleine largeur dès l'accueil de la page.
// Entrée en fondu + légère mise à l'échelle, puis lecture (son coupé) au clic.
export function ProjectVideo({
  videoId,
  posterSrc,
  title,
}: {
  videoId: string;
  posterSrc: string;
  title: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    // En reduced-motion : pas d'animation ni de lecture auto, on garde le clic.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("is-in");
      return;
    }

    // Lance la lecture muette ~1 s après la fin de l'ouverture (≈1,8 s).
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-in");
          observer.disconnect();
          timer = setTimeout(() => setPlaying(true), 2800);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="px-5 sm:px-8 lg:px-10">
      <div
        ref={frameRef}
        className="video-cinema relative mx-auto aspect-video w-full max-w-[1600px] overflow-hidden rounded-2xl bg-[var(--color-ink-2)] shadow-[0_60px_160px_-50px_rgba(0,0,0,0.9)] ring-1 ring-[var(--color-line-soft)]"
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
            <div className="video-cinema-inner absolute inset-0">
              <Still src={posterSrc} alt={title} />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,9,8,0.5)] via-transparent to-[rgba(10,9,8,0.12)]" />
            </div>
            <span className="video-cinema-play absolute left-1/2 top-1/2 flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
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
    </div>
  );
}

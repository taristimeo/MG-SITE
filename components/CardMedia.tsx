"use client";

import { useEffect, useRef } from "react";

type CardMediaProps = {
  src: string; // image (poster / still) — toujours affichée d'abord
  alt: string;
  videoSrc?: string; // extrait .mp4 muet ; si présent, joue en boucle
  className?: string;
};

// Média d'une card de réalisation : par défaut le still (image). Si un extrait
// vidéo est fourni, on le lit en boucle, muet, sans contrôles — mais seulement
// quand la card est visible à l'écran (économise data + batterie), et jamais en
// mode « mouvement réduit ». L'image sert de poster : elle s'affiche
// instantanément pendant que la vidéo se charge.
export function CardMedia({ src, alt, videoSrc, className = "" }: CardMediaProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!videoSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <video
      ref={ref}
      className={`h-full w-full object-cover ${className}`}
      poster={src}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}

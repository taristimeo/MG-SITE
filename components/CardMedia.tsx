"use client";

import { useEffect, useRef, useState } from "react";

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
  const [saveData, setSaveData] = useState(false);
  // Passe à true dès que la vidéo affiche sa première image : on la fond alors
  // par-dessus le still. Reste vrai ensuite (pas de re-fondu aux pauses/reprises).
  const [ready, setReady] = useState(false);

  // Économiseur de données actif (ou connexion qui le demande) : on s'en tient
  // à l'image — aucune vidéo téléchargée ni décodée.
  useEffect(() => {
    const conn = (
      navigator as { connection?: { saveData?: boolean } }
    ).connection;
    if (conn?.saveData) setSaveData(true);
  }, []);

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

  if (!videoSrc || saveData) {
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

  // Still affiché d'emblée, vidéo fondue par-dessus dès qu'elle a une image.
  // Le conteneur porte `className` (transitions/hover de scale) pour scaler
  // l'ensemble ; les deux médias restent en object-cover, superposés.
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity]"
        style={ready ? { opacity: 1 } : undefined}
        poster={src}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        onPlaying={() => setReady(true)}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

// Charge l'API IFrame YouTube une seule fois pour toute la page.
let apiPromise: Promise<void> | null = null;
function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const w = window as unknown as Record<string, unknown>;
  if ((w.YT as { Player?: unknown })?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prev = w.onYouTubeIframeAPIReady as (() => void) | undefined;
    w.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

// Prévisualisation vidéo : lecture auto, muette, sans contrôles, qui boucle
// toutes les `loop` secondes (15 par défaut). L'iframe est sur-dimensionnée
// pour couvrir le cadre (cover) sans bandes noires.
export function VideoTile({
  id,
  loop = 15,
  className = "",
}: {
  id: string;
  loop?: number;
  className?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let player: { destroy?: () => void } | null = null;
    let timer: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;

    loadYouTubeAPI().then(() => {
      if (cancelled || !iframeRef.current) return;
      const YT = (window as unknown as { YT: any }).YT;
      player = new YT.Player(iframeRef.current, {
        events: {
          onReady: (e: { target: { mute: () => void; playVideo: () => void } }) => {
            e.target.mute();
            e.target.playVideo();
          },
          onStateChange: (e: { data: number; target: { seekTo: (s: number) => void } }) => {
            if (e.data === YT.PlayerState.PLAYING) {
              clearInterval(timer);
              timer = setInterval(() => {
                try {
                  e.target.seekTo(0);
                } catch {}
              }, loop * 1000);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      clearInterval(timer);
      try {
        player?.destroy?.();
      } catch {}
    };
  }, [id, loop]);

  const src =
    `https://www.youtube.com/embed/${id}` +
    `?enablejsapi=1&autoplay=1&mute=1&controls=0&disablekb=1&fs=0` +
    `&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${id}&start=0`;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <iframe
        ref={iframeRef}
        src={src}
        title=""
        tabIndex={-1}
        allow="autoplay; encrypted-media"
        className="absolute left-1/2 top-1/2 h-full w-[177.78%] min-h-[177.78%] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
      />
    </div>
  );
}

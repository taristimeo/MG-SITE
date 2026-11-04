"use client";

import { useState } from "react";
import { FilmCanvas } from "@/components/grain/FilmCanvas";

// Le film, en grand : le tirage se développe, l'extrait tourne au survol, et
// la lecture YouTube ne se charge qu'au clic (pas d'iframe tierce d'office).
export function Player({
  videoId,
  poster,
  preview,
  title,
}: {
  videoId: string | null;
  poster: string;
  preview?: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-paper-2)]">
      {playing && videoId ? (
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <>
          <FilmCanvas src={poster} alt={title} video={preview} videoMode="hover" className="aspect-video w-full" />
          {videoId && (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Lire le film — ${title}`}
              className="group absolute inset-0 flex items-end p-[var(--gutter)]"
            >
              <span className="t-legend inline-flex items-center gap-3 bg-[var(--color-paper)] px-4 py-3 text-[var(--color-text)] transition-colors duration-500 group-hover:bg-[var(--color-text)] group-hover:text-[var(--color-paper)]">
                <span aria-hidden className="inline-block h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-current" />
                Lire le film
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
}

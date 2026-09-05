"use client";

import { useState } from "react";

/**
 * LE FILM — une façade, jamais un lecteur.
 *
 * Aucun iframe YouTube n'est monté au chargement : la page afficherait
 * autrement un demi-mégaoctet de script tiers et déposerait ses traceurs
 * avant même qu'on ait cliqué. On pose l'image du film, un bouton de
 * lecture, et l'iframe ne naît qu'au clic — sur le domaine sans cookie.
 */
export function CaseFilm({
  videoId,
  poster,
  title,
}: {
  videoId: string | null;
  poster: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="vsc-film" aria-labelledby="vsc-film-h">
      <p className="vsc-seclabel" data-reveal>
        <span className="vsc-seclabel-n">Le film</span>
      </p>

      <h2 id="vsc-film-h" className="sr-only">
        Le film — {title}
      </h2>

      <div className="vsc-screen" data-reveal>
        {playing && videoId ? (
          <iframe
            className="vsc-iframe"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : videoId ? (
          <button
            type="button"
            className="vsc-facade"
            onClick={() => setPlaying(true)}
            aria-label={`Lancer le film ${title}`}
          >
            <img
              src={poster}
              alt=""
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
            <span className="vsc-facade-veil" aria-hidden />
            <span className="vsc-play" aria-hidden>
              <svg viewBox="0 0 24 24" width="20" height="20" focusable="false">
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
            </span>
            <span className="vsc-facade-cap" aria-hidden>
              Lecture
            </span>
          </button>
        ) : (
          <img
            className="vsc-facade-still"
            src={poster}
            alt={title}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>

      {videoId ? (
        <p className="vsc-screen-note" data-reveal>
          Le lecteur ne se charge qu&apos;à la lecture.
        </p>
      ) : null}
    </section>
  );
}

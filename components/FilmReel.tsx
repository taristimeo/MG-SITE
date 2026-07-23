// Bobine Mauvais Grain — un vrai touret de pellicule 35 mm, tourné en continu,
// depuis lequel la bande se déroule vers le bas. Pur SVG + rotation d'un div
// (aucun filtre, aucun clip-path) → robuste iOS. Décoratif (aria-hidden).
export function FilmReel() {
  // Angles fixes des évidements du touret (pas de Math.random).
  const spokes = [0, 60, 120, 180, 240, 300];
  return (
    <div className="film-reel" aria-hidden>
      <div className="film-reel-spin">
        <svg viewBox="0 0 200 200" className="film-reel-svg">
          <defs>
            <path
              id="reel-label-path"
              d="M100,100 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0"
            />
          </defs>
          {/* Film enroulé sur le touret : anneaux concentriques */}
          <circle cx="100" cy="100" r="96" fill="#0a0806" />
          <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(232,228,216,0.10)" strokeWidth="1" />
          <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(232,228,216,0.05)" strokeWidth="9" />
          <circle cx="100" cy="100" r="77" fill="none" stroke="rgba(232,228,216,0.045)" strokeWidth="7" />
          {/* Corps du touret */}
          <circle cx="100" cy="100" r="67" fill="#1c150c" stroke="rgba(232,228,216,0.12)" strokeWidth="1" />
          {/* Évidements */}
          {spokes.map((a) => {
            const rad = (a * Math.PI) / 180;
            const x = 100 + Math.cos(rad) * 43;
            const y = 100 + Math.sin(rad) * 43;
            return (
              <circle
                key={a}
                cx={x}
                cy={y}
                r="15.5"
                fill="#0a0806"
                stroke="rgba(232,228,216,0.09)"
                strokeWidth="1"
              />
            );
          })}
          {/* Moyeu central + point terracotta */}
          <circle cx="100" cy="100" r="15" fill="#1c150c" stroke="rgba(183,110,78,0.55)" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="3.2" fill="#b76e4e" />
          {/* Libellé gravé sur le film enroulé */}
          <text className="reel-label">
            <textPath href="#reel-label-path" startOffset="0">
              MAUVAIS&nbsp;GRAIN · PELLICULE 35MM · BORDEAUX ·&nbsp;
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}

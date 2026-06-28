// Titre animé : fondu doux du mot, puis le point terracotta clignote 3 fois
// comme un REC et reste ensuite statique. Réutilisé sur la page de garde et la
// page Réalisations.
export function RevealTitle({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <h1 className={`font-wide ${className}`}>
      <span className="reveal-word-text">{text}</span>
      <span className="dot hero-dot">.</span>
    </h1>
  );
}

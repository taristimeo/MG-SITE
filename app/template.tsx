"use client";

// template.tsx se re-monte à chaque changement de route (contrairement à
// layout.tsx). On applique donc une classe d'animation d'entrée au montage :
// léger fondu + montée (~400 ms, --ease-out-expo). Purement visuel — les
// enfants sont rendus normalement (SSR/SEO intacts) et l'animation se dégrade
// en apparition instantanée sous prefers-reduced-motion (voir globals.css).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}

import type { Metadata } from "next";
import { Demo } from "./Demo";

export const metadata: Metadata = {
  title: "Chaîne de gestes",
  description:
    "Banc d'essai des primitives de mouvement — hors production, non indexé.",
  robots: { index: false, follow: false },
};

/**
 * BANC D'ESSAI — LA CHAÎNE DE GESTES.
 *
 * Les cinq primitives de `components/motion/` montrées à l'œuvre, isolées les
 * unes des autres. Sert à valider les durées, les cascades et le repli sous
 * `prefers-reduced-motion` avant intégration au viseur.
 */
export default function MotionDemoPage() {
  return <Demo />;
}

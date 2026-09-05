import type { Metadata } from "next";
import { Pellicule } from "@/components/pellicule/Pellicule";

export const metadata: Metadata = {
  title: "Brouillon 03 — La pellicule",
  alternates: { canonical: "/pellicule" },
};

/**
 * ACCUEIL — « La pellicule ».
 *
 * Le site ne descend pas, il passe : tout le contenu tient sur une bande
 * unique qui défile latéralement entre deux rangées de perforations. Le
 * brouillon occupe l'écran entier (conteneur fixe, jamais le <body> — les
 * deux autres brouillons partagent le même document) et bascule en bande
 * verticale sous 768 px, où le défilement natif de la page reprend la main.
 */
export default function PelliculePage() {
  return <Pellicule />;
}

import type { Metadata } from "next";
import { Viseur } from "@/components/viseur/Viseur";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Le viseur",
  description: `${site.intro} Une variante « viseur » : les films se choisissent à la bague, comme la mise au point d'un objectif.`,
  alternates: { canonical: "/viseur" },
};

/**
 * BROUILLON 02 — « LE VISEUR ».
 *
 * Il n'y a ni page ni défilement, seulement des prises : le composant occupe
 * l'écran entier depuis un calque fixe, sans jamais toucher au `body` (les
 * deux autres brouillons partagent le même document).
 */
export default function ViseurPage() {
  return <Viseur />;
}

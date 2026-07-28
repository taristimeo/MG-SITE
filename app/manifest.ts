import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Manifeste d'application (route de métadonnées Next : sert
// /manifest.webmanifest et injecte le <link rel="manifest"> automatiquement).
// Utile quand le site est ajouté à l'écran d'accueil sur iPhone : nom, icône et
// couleurs de démarrage à la charte plutôt que la capture par défaut.
// Les icônes référencées sont les fichiers réels de app/ :
//   app/icon.png       → 512 × 512, servi sur /icon.png
//   app/apple-icon.png → 180 × 180, servi sur /apple-icon.png
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.intro,
    lang: "fr-FR",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "standalone",
    // Fond du thème SOMBRE (--color-ink) — à inverser sur la branche claire.
    background_color: "#0a0908",
    theme_color: "#0a0908",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

import { Showreel } from "@/components/Showreel";
import { site } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
  description: `${site.intro} Films corporate, événementiels, immobiliers, touristiques et clips, réalisés à ${site.city} par ${site.founder}.`,
};

// L'accueil ne dit rien : il montre. Un film à la fois, plein écran, l'index
// des six films en bas. Le reste du site est à un clic dans le bandeau.
export default function Home() {
  return <Showreel />;
}

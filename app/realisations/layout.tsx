import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/**
 * Les fiches de réalisation sont COMMUNES aux trois brouillons : c'est le
 * contenu, pas la coquille. Elles reprennent l'habillage du brouillon 01, qui
 * est le seul à proposer une navigation classique.
 */
export default function RealisationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer year={new Date().getFullYear()} />
    </>
  );
}

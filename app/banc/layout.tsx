import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hud } from "@/components/bench/Hud";

/**
 * Le brouillon « banc de montage » est le seul des trois à garder des pages
 * séparées : il conserve donc son en-tête, son pied de page et sa réglette de
 * visionneuse. Les deux autres brouillons occupent l'écran entier et n'ont ni
 * l'un ni l'autre.
 */
export default function BancLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer year={new Date().getFullYear()} />
      <Hud />
    </>
  );
}

import { MontageProvider } from "@/components/montage/store";
import { Table } from "@/components/montage/Table";
import "../montage.css";

// La table de montage est le site : visionneuse et timeline restent montées
// d'une route à l'autre, seuls les panneaux (chutier, films, studio, contact)
// changent. Le montage du visiteur ne se perd jamais entre les pages.
export default function TableLayout({ children }: { children: React.ReactNode }) {
  return (
    <MontageProvider>
      <Table>{children}</Table>
    </MontageProvider>
  );
}

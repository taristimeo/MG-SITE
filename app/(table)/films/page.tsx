import type { Metadata } from "next";
import { Films } from "@/components/montage/Films";
import { films } from "@/lib/montage";

export const metadata: Metadata = {
  title: "Films",
  description: `Les films du studio en rushes : ${films.map((f) => f.title).join(", ")}. Ajoutez-les à votre montage.`,
  alternates: { canonical: "/films" },
};

export default function FilmsPage() {
  return <Films />;
}

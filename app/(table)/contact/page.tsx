import type { Metadata } from "next";
import { Contact } from "@/components/montage/Contact";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Racontez-nous votre projet : votre montage part avec votre demande. ${site.email} · ${site.phone}`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <Contact />;
}

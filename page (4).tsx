import type { Metadata } from "next";
import { Gloock, JetBrains_Mono, Saira } from "next/font/google";
import "./globals.css";
import { Grain } from "@/components/Grain";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

// Logotype & titres — Gloock (serif display fort contraste, cf. la charte).
const gloock = Gloock({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gloock",
  display: "swap",
});

// Labels & méta — monospace capitales espacées.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Texte courant.
const saira = Saira({
  subsets: ["latin"],
  variable: "--font-saira",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Studio de production vidéo à ${site.city}`,
    template: `%s — ${site.name}`,
  },
  description: site.intro,
  openGraph: {
    title: `${site.name} — Studio de production vidéo`,
    description: site.intro,
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${gloock.variable} ${mono.variable} ${saira.variable}`}
    >
      <body>
        <Grain />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Gloock, JetBrains_Mono, Saira } from "next/font/google";
import "./globals.css";
import { Grain } from "@/components/Grain";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { services, site } from "@/lib/site";

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
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Studio de production vidéo à ${site.city}`,
    template: `%s — ${site.name}`,
  },
  description: site.intro,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — Studio de production vidéo à ${site.city}`,
    description: site.intro,
    url: site.url,
    siteName: site.name,
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Studio de production vidéo à ${site.city}`,
    description: site.intro,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

// Données structurées — studio local (référencement local + éligibilité aux
// résultats enrichis). Construites à partir de la source unique lib/site.ts.
const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#studio`,
  name: site.name,
  alternateName: `${site.name} — Studio de production vidéo`,
  description: site.intro,
  slogan: site.tagline,
  url: site.url,
  email: site.email,
  telephone: site.phoneHref,
  image: `${site.url}/opengraph-image.png`,
  logo: `${site.url}/icon.png`,
  foundingDate: site.founded,
  founder: { "@type": "Person", name: site.founder },
  knowsLanguage: ["fr-FR"],
  address: {
    "@type": "PostalAddress",
    streetAddress: site.street,
    addressLocality: site.city,
    postalCode: site.postalCode,
    addressRegion: site.region,
    addressCountry: site.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.lat,
    longitude: site.geo.lng,
  },
  // Zones desservies — signal fort pour le référencement local.
  areaServed: [
    { "@type": "City", name: "Bordeaux" },
    { "@type": "AdministrativeArea", name: "Gironde" },
    { "@type": "AdministrativeArea", name: "Nouvelle-Aquitaine" },
    { "@type": "Country", name: "France" },
  ],
  serviceType: services.map((s) => s.title),
  sameAs: site.socials.map((s) => s.href),
  // Catalogue de prestations — aide Google à comprendre ce que tu proposes.
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Production vidéo",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        description: s.line,
        provider: { "@id": `${site.url}/#studio` },
        areaServed: { "@type": "Country", name: "France" },
      },
    })),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
        />
        <Grain />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

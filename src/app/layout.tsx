import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NVS Amour Éternel | Organisation de Mariage en Île-de-France",
    template: "%s | NVS Amour Éternel",
  },
  description:
    "NVS Amour Éternel - Votre wedding planner en Île-de-France. Organisation de mariage, décoration, coordination et location de matériel pour un jour inoubliable.",
  keywords: [
    "mariage",
    "wedding planner",
    "organisation mariage",
    "décoration mariage",
    "location matériel mariage",
    "Île-de-France",
    "Paris",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "NVS Amour Éternel",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${lato.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "NVS Amour Éternel",
              description:
                "Organisation de mariage, décoration, coordination et location de matériel en Île-de-France.",
              url: "https://nvsamoureternel.fr",
              areaServed: {
                "@type": "Place",
                name: "Île-de-France, France",
              },
              serviceType: [
                "Wedding Planning",
                "Wedding Decoration",
                "Wedding Equipment Rental",
              ],
              priceRange: "€€",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

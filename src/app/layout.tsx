import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

/* Serifada editorial no display + sans neutra no corpo.
   Combinação escolhida para afastar a página da estética de template. */
const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--fonte-display",
});

const corpo = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--fonte-corpo",
});

const SITE = "https://visiteprado.com.br";
const TITULO = "Visite Prado — praias, falésias e baleias no sul da Bahia";
const DESCRICAO =
  "Guia de Prado, na Costa das Baleias: as falésias coloridas, a cachoeira do Tororão, o banco de areia de Corumbau e a temporada de baleias-jubarte. Roteiros com quem conhece a região.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITULO,
    template: "%s · Visite Prado",
  },
  description: DESCRICAO,
  keywords: [
    "Prado BA",
    "Cumuruxatiba",
    "Corumbau",
    "falésias de Prado",
    "Costa das Baleias",
    "baleia jubarte Bahia",
    "Praia do Tororão",
    "turismo sul da Bahia",
  ],
  authors: [{ name: "Allan Candido" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE,
    siteName: "Visite Prado",
    title: TITULO,
    description: DESCRICAO,
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ec",
  colorScheme: "light",
};

/* Dados estruturados: ajuda o Google a entender que isto é um
   guia de destino turístico, não uma página institucional genérica. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  name: "Prado",
  description: DESCRICAO,
  url: SITE,
  touristType: [
    "Ecoturismo",
    "Turismo de praia",
    "Observação de baleias",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Prado",
    addressRegion: "BA",
    addressCountry: "BR",
  },
  includesAttraction: [
    { "@type": "TouristAttraction", name: "Falésias do Prado" },
    { "@type": "TouristAttraction", name: "Praia do Tororão" },
    { "@type": "TouristAttraction", name: "Cumuruxatiba" },
    { "@type": "TouristAttraction", name: "Ponta do Corumbau" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${corpo.variable} h-full`}
    >
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[4px] focus:bg-tinta focus:px-5 focus:py-3 focus:text-areia"
        >
          Ir para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}

import type { MetadataRoute } from "next";

/* Abre como aplicativo quando adicionado à tela de início (sem barra do navegador). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Visite Prado — praias, falésias e baleias",
    short_name: "Visite Prado",
    description: "Guia de Prado e da Costa das Baleias, no sul da Bahia.",
    start_url: "/?utm_source=app",
    scope: "/",
    display: "standalone",
    background_color: "#fbf6ec",
    theme_color: "#fbf6ec",
    lang: "pt-BR",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}

import type { NextConfig } from "next";

/* Cabeçalhos de segurança (auditoria 2026-09-30): o site estava sem nenhum.
   frame-ancestors impede embutir o guia em página de terceiro. */
const cabecalhos = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: cabecalhos }];
  },
  images: {
    // Miniaturas dos vídeos vêm do CDN do YouTube; deixamos o Next
    // otimizar e servir em AVIF/WebP em vez de baixar o JPG cru.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;

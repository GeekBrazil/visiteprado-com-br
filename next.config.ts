import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

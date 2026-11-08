import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: ["Googlebot", "Google-Extended", "OAI-SearchBot", "GPTBot", "PerplexityBot", "ClaudeBot", "Applebot"],
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://visiteprado.com.br/sitemap.xml",
  };
}

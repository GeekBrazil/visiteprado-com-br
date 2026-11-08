import { MetadataRoute } from "next";
import { readFileSync } from "fs";
import { join } from "path";

const BASE = "https://visiteprado.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE}/privacidade`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const raw = readFileSync(join(process.cwd(), "public/data/articles.json"), "utf-8");
    const list = JSON.parse(raw) as Array<{ id: string; status: string; publishedAt?: string }>;
    for (const a of list) {
      if (a.status === "published" && a.id) {
        entries.push({
          url: `${BASE}/blog/${a.id}`,
          lastModified: a.publishedAt ? new Date(a.publishedAt) : now,
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  } catch {}

  return entries;
}


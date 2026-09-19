import type { Metadata } from "next";
import Link from "next/link";
import { readFileSync } from "fs";
import { join } from "path";
import BlogAdminIngestion from "@/components/blog/BlogAdminIngestion";

export const metadata: Metadata = {
  title: "Blog & Destinos de Prado (BA) · VisitePrado.com.br",
  description:
    "Roteiros exclusivos, dicas de hospedagem, gastronomia e ecoturismo na Costa das Baleias.",
  robots: { index: true, follow: true },
};

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  coverImage?: string;
  publishedAt: string;
  status: "published" | "draft";
  featured?: boolean;
}

function getArticles(): Article[] {
  try {
    const raw = readFileSync(join(process.cwd(), "public/data/articles.json"), "utf-8");
    return (JSON.parse(raw) as Article[]).filter((a) => a.status === "published");
  } catch {
    return [];
  }
}

export default function BlogPage() {
  const articles = getArticles();

  return (
    <div className="min-h-screen bg-[#070d12] text-amber-100 selection:bg-amber-400 selection:text-black">
      <header className="sticky top-0 z-40 bg-[#070d12]/90 border-b border-amber-500/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center font-black text-amber-400">
              VP
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-white leading-none">
                VisitePrado<span className="text-amber-400">.</span>
              </span>
              <span className="text-[9px] font-mono font-bold tracking-wider text-amber-200/60 uppercase mt-0.5">
                Blog &amp; Destinos
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-bold px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors"
          >
            ← Voltar para a Home
          </Link>
        </div>
      </header>

      {/* Painel de Ingestão Exclusivo para o Administrador */}
      <BlogAdminIngestion />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-black tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Costa das Baleias · Sul da Bahia
        </span>

        <h1 className="mt-4 text-3xl sm:text-5xl font-black text-white leading-[1.12]">
          Blog Visite Prado
        </h1>

        <p className="mt-4 text-sm sm:text-base text-amber-100/70 max-w-2xl leading-relaxed">
          Guias completos, segredos locais, praias selvagens e experiências na Costa do Descobrimento.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.id}`}
              className="group bg-[#0b1319] rounded-2xl p-6 border border-amber-500/10 hover:border-amber-400/40 transition-all flex flex-col justify-between"
            >
              <div>
                {article.coverImage && (
                  <div className="w-full h-44 rounded-xl overflow-hidden mb-4 bg-black/40">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    {article.category}
                  </span>
                  <span className="text-[11px] text-amber-200/50 font-mono">
                    {new Date(article.publishedAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-amber-100/70 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-500/10 flex items-center justify-between text-xs font-bold text-amber-400">
                <span>Ver guia completo</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

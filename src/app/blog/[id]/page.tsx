import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { readFileSync } from "fs";
import { join } from "path";

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  content: string;
  coverImage?: string;
  publishedAt: string;
  status: "published" | "draft";
}

function getArticleById(id: string): Article | null {
  try {
    const raw = readFileSync(join(process.cwd(), "public/data/articles.json"), "utf-8");
    const list: Article[] = JSON.parse(raw);
    return list.find((a) => a.id === id && a.status === "published") ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const article = getArticleById(id);
  if (!article) return { title: "Artigo não encontrado · Visite Prado" };
  return { title: `${article.title} · Visite Prado`, description: article.summary };
}

export default async function ArticlePage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = getArticleById(id);
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-[#070d12] text-amber-100 selection:bg-amber-400 selection:text-black">
      <header className="sticky top-0 z-40 bg-[#070d12]/90 border-b border-amber-500/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-black text-white">
              VisitePrado<span className="text-amber-400">.</span>
            </span>
            <span className="text-xs text-amber-200/60 font-mono">/ blog</span>
          </Link>

          <Link
            href="/blog"
            className="text-xs font-bold px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors"
          >
            ← Voltar para o Blog
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
            {article.category}
          </span>
          <span className="text-xs text-amber-200/50 font-mono">
            {new Date(article.publishedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-4">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-amber-100/70 leading-relaxed mb-8">
          {article.summary}
        </p>

        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full max-h-96 object-cover rounded-2xl mb-8 border border-amber-500/20"
          />
        )}

        <hr className="border-amber-500/20 mb-8" />

        <article
          className="text-amber-100/90 leading-relaxed space-y-4 text-base"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="mt-12 pt-8 border-t border-amber-500/20 flex justify-between items-center">
          <Link href="/blog" className="text-xs font-bold text-amber-200/60 hover:text-white">
            ← Todos os roteiros
          </Link>
          <Link href="/" className="text-xs font-bold px-4 py-2 rounded-xl bg-amber-400 text-black">
            Explorar Mapa de Prado →
          </Link>
        </div>
      </main>
    </div>
  );
}

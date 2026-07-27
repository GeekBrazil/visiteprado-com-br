"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { VIDEOS, urlEmbed, urlMiniatura, type VideoPrado } from "@/data/midia";

/**
 * Galeria em fachada: renderiza apenas a miniatura do YouTube e só instancia
 * o player quando o visitante clica. Mantém o JS inicial baixo e evita
 * carregar N iframes de uma vez.
 */
export default function GaleriaVideos() {
  const [aberto, setAberto] = useState<VideoPrado | null>(null);

  const fechar = useCallback(() => setAberto(null), []);

  // Esc fecha; trava o scroll do fundo enquanto o player está aberto.
  useEffect(() => {
    if (!aberto) return;

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", aoTeclar);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto, fechar]);

  return (
    <>
      <ul className="grid list-none gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {VIDEOS.map((video) => (
          <li key={video.id}>
            <button
              type="button"
              onClick={() => setAberto(video)}
              className="group block w-full text-left"
            >
              <span
                className={`moldura-video block ${
                  video.vertical ? "proporcao-9-16" : "proporcao-16-9"
                }`}
              >
                {/* Miniatura oficial do YouTube — sem custo de banda no repo */}
                <Image
                  src={urlMiniatura(video.id)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-tinta/15 transition-colors duration-300 group-hover:bg-tinta/5"
                />
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-areia/92 transition-transform duration-300 ease-out group-hover:scale-110"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="ml-1 h-5 w-5 fill-falesia"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>

              <span className="mt-4 block">
                <span className="t3 block text-tinta transition-colors duration-200 group-hover:text-falesia">
                  {video.titulo}
                </span>
                <span className="mt-1 block text-sm text-tinta-3">
                  {video.local}
                </span>
              </span>

              <span className="sr-only">Assistir vídeo</span>
            </button>
          </li>
        ))}
      </ul>

      {aberto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={aberto.titulo}
          onClick={fechar}
          className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/92 p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar vídeo"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full text-areia transition-colors hover:bg-areia/15"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 stroke-current"
              fill="none"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className={`moldura-video w-full ${
              aberto.vertical
                ? "proporcao-9-16 max-w-[min(420px,calc((100vh_-_8rem)_*_0.5625))]"
                : "proporcao-16-9 max-w-5xl"
            }`}
          >
            <iframe
              src={`${urlEmbed(aberto.id)}&autoplay=1`}
              title={aberto.titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}

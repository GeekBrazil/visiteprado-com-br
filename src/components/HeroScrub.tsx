"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { VIDEO_SCRUB } from "@/data/midia";

/**
 * Hero com vídeo controlado pela rolagem.
 *
 * O container é alto (300vh) e o conteúdo fica grudado no topo. Conforme a
 * página desce, o progresso vira `currentTime` do vídeo — a sensação é de
 * pedalar junto.
 *
 * Detalhes que fazem funcionar de verdade:
 *  - interpolação suave: pular direto pro alvo faz o vídeo tremer no trackpad
 *  - laço em requestAnimationFrame, não no evento de scroll (que dispara
 *    dezenas de vezes por quadro e trava a rolagem)
 *  - `play()` seguido de `pause()` no iOS, senão o vídeo nem fica buscável
 *  - `prefers-reduced-motion` recebe o pôster estático, sem movimento
 */
const CONSULTA_MOVIMENTO = "(prefers-reduced-motion: reduce)";

export default function HeroScrub() {
  const secaoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const alvoRef = useRef(0);
  const atualRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [pronto, setPronto] = useState(false);
  const [falhou, setFalhou] = useState(false);

  const config = VIDEO_SCRUB;

  // Media query é estado externo: useSyncExternalStore evita render em cascata.
  const semMovimento = useSyncExternalStore(
    (aoMudar) => {
      const mq = window.matchMedia(CONSULTA_MOVIMENTO);
      mq.addEventListener("change", aoMudar);
      return () => mq.removeEventListener("change", aoMudar);
    },
    () => window.matchMedia(CONSULTA_MOVIMENTO).matches,
    () => false // no servidor, assume que há movimento
  );

  useEffect(() => {
    if (!config || semMovimento || falhou) return;

    const video = videoRef.current;
    const secao = secaoRef.current;
    if (!video || !secao) return;

    const inicioFracao = config.inicio ?? 0.5;

    // iOS só deixa o vídeo buscável depois de uma tentativa de reprodução.
    const destravar = () => {
      video.play().then(() => video.pause()).catch(() => {});
    };

    const aoCarregar = () => {
      destravar();
      const dur = video.duration;
      if (!Number.isFinite(dur) || dur <= 0) {
        setFalhou(true);
        return;
      }
      const inicio = dur * inicioFracao;
      video.currentTime = inicio;
      atualRef.current = inicio;
      alvoRef.current = inicio;
      setPronto(true);
    };

    const calcularAlvo = () => {
      const dur = video.duration;
      if (!Number.isFinite(dur) || dur <= 0) return;

      const inicio = dur * inicioFracao;
      const retangulo = secao.getBoundingClientRect();
      const percorrivel = retangulo.height - window.innerHeight;
      if (percorrivel <= 0) return;

      // 0 no topo da seção, 1 quando termina de passar.
      const progresso = Math.min(1, Math.max(0, -retangulo.top / percorrivel));
      alvoRef.current = inicio + progresso * (dur - inicio);
    };

    const laco = () => {
      // Interpolação: aproxima 15% da distância por quadro.
      const delta = alvoRef.current - atualRef.current;
      if (Math.abs(delta) > 0.005) {
        atualRef.current += delta * 0.15;
        if (video.readyState >= 2) {
          try {
            video.currentTime = atualRef.current;
          } catch {
            /* buscar durante buffer pode lançar; ignoramos e tentamos no próximo quadro */
          }
        }
      }
      rafRef.current = requestAnimationFrame(laco);
    };

    video.addEventListener("loadedmetadata", aoCarregar);
    video.addEventListener("error", () => setFalhou(true));
    window.addEventListener("scroll", calcularAlvo, { passive: true });
    window.addEventListener("resize", calcularAlvo);

    if (video.readyState >= 1) aoCarregar();
    calcularAlvo();
    rafRef.current = requestAnimationFrame(laco);

    return () => {
      video.removeEventListener("loadedmetadata", aoCarregar);
      window.removeEventListener("scroll", calcularAlvo);
      window.removeEventListener("resize", calcularAlvo);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [config, semMovimento, falhou]);

  if (!config) return null;

  const estatico = semMovimento || falhou;

  return (
    <section
      ref={secaoRef}
      className={estatico ? "relative" : "relative h-[300vh]"}
      aria-label="Pedalando pelas praias de Prado"
    >
      <div
        className={`${
          estatico ? "relative h-[86vh]" : "sticky top-0 h-screen"
        } flex flex-col justify-end overflow-hidden bg-mar-esc`}
      >
        {estatico ? (
          config.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={config.poster}
              alt={config.descricao ?? ""}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null
        ) : (
          <video
            ref={videoRef}
            src={config.arquivo}
            poster={config.poster}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              pronto ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Véu para o texto ter contraste sobre qualquer quadro */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,32,38,0.58) 0%, rgba(11,32,38,0.28) 42%, rgba(11,32,38,0.86) 100%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 lg:px-8">
          <p className="olho olho-claro">Extremo sul da Bahia</p>

          <h1 className="display mt-6 max-w-[15ch] text-areia">
            Falésias coloridas e um mar que recua todo dia
          </h1>

          <p className="medida mt-6 text-lg leading-relaxed text-areia-2">
            Prado guarda o paredão de areia mais fotografado da Costa das
            Baleias, uma cachoeira que cai direto na praia e um banco de areia
            que aparece só quando a maré permite.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#destinos" className="btn btn-claro">
              Ver as praias
            </a>
            <a
              href="#mapa"
              className="btn border-areia-2/50 text-areia hover:bg-areia/10"
            >
              Abrir o mapa
            </a>
          </div>

          {!estatico && (
            <p className="mt-10 flex items-center gap-2 text-xs text-areia-2/70">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 animate-bounce stroke-current"
                fill="none"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" />
              </svg>
              role para seguir o passeio
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

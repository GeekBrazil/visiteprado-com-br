"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { HERO_CAMADAS } from "@/data/midia";

/**
 * Hero em três camadas — o efeito de livro 3D.
 *
 * Como funciona:
 *  - o palco tem `perspective`; cada camada fica num `translateZ` diferente
 *  - a rolagem vira duas variáveis CSS (`--p` de progresso, `--mx`/`--my` do
 *    ponteiro) e o CSS faz toda a matemática de deslocamento por camada
 *  - o título mora ENTRE o plano do meio e o da frente: a crista de areia
 *    passa por cima do pé das letras. É o recorte que dá a sensação de página
 *    montada, não de foto com texto em cima.
 *
 * Detalhes que fazem funcionar de verdade:
 *  - JS escreve 3 variáveis num único elemento por quadro; sem isso, cada
 *    camada viraria um `style` próprio e o React re-renderizaria a árvore
 *  - laço em requestAnimationFrame que DORME quando nada mais se move — hero
 *    parado não gasta bateria
 *  - a escala de cada camada compensa a perspectiva (o que está longe
 *    aparenta o mesmo tamanho); a profundidade aparece no movimento, não no
 *    tamanho, senão o fundo "estoura" a moldura
 *  - `prefers-reduced-motion` recebe a composição montada e imóvel
 */
const CONSULTA_MOVIMENTO = "(prefers-reduced-motion: reduce)";
const CONSULTA_PONTEIRO = "(hover: hover) and (pointer: fine)";

/** Fração da distância percorrida por quadro. Mais alto = mais seco. */
const SUAVIZACAO = 0.12;

export default function HeroCamadas() {
  const palcoRef = useRef<HTMLDivElement>(null);
  const alvoRef = useRef({ p: 0, mx: 0, my: 0 });
  const atualRef = useRef({ p: 0, mx: 0, my: 0 });
  const rafRef = useRef<number | null>(null);

  const config = HERO_CAMADAS;

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
    if (!config || semMovimento) return;

    const palco = palcoRef.current;
    if (!palco) return;

    const temPonteiro = window.matchMedia(CONSULTA_PONTEIRO).matches;

    const calcularAlvo = () => {
      const r = palco.getBoundingClientRect();
      if (r.height <= 0) return;
      // 0 com o hero encaixado no topo, 1 quando ele termina de sair.
      alvoRef.current.p = Math.min(1, Math.max(0, -r.top / r.height));
      acordar();
    };

    const aoMoverPonteiro = (e: PointerEvent) => {
      const r = palco.getBoundingClientRect();
      alvoRef.current.mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      alvoRef.current.my = ((e.clientY - r.top) / r.height) * 2 - 1;
      acordar();
    };

    const aoSairPonteiro = () => {
      alvoRef.current.mx = 0;
      alvoRef.current.my = 0;
      acordar();
    };

    const laco = () => {
      const alvo = alvoRef.current;
      const atual = atualRef.current;

      let movendo = false;
      for (const chave of ["p", "mx", "my"] as const) {
        const delta = alvo[chave] - atual[chave];
        if (Math.abs(delta) > 0.0005) {
          atual[chave] += delta * SUAVIZACAO;
          movendo = true;
        } else {
          atual[chave] = alvo[chave];
        }
      }

      palco.style.setProperty("--p", atual.p.toFixed(4));
      palco.style.setProperty("--mx", atual.mx.toFixed(4));
      palco.style.setProperty("--my", atual.my.toFixed(4));

      // Nada mais a interpolar: dorme até o próximo scroll ou ponteiro.
      rafRef.current = movendo ? requestAnimationFrame(laco) : null;
    };

    const acordar = () => {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(laco);
    };

    window.addEventListener("scroll", calcularAlvo, { passive: true });
    window.addEventListener("resize", calcularAlvo);
    if (temPonteiro) {
      palco.addEventListener("pointermove", aoMoverPonteiro);
      palco.addEventListener("pointerleave", aoSairPonteiro);
    }

    calcularAlvo();

    return () => {
      window.removeEventListener("scroll", calcularAlvo);
      window.removeEventListener("resize", calcularAlvo);
      palco.removeEventListener("pointermove", aoMoverPonteiro);
      palco.removeEventListener("pointerleave", aoSairPonteiro);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [config, semMovimento]);

  if (!config) return null;

  const corte = `${config.corte ?? 52}%`;

  return (
    <section aria-label="Prado, extremo sul da Bahia">
      <div
        ref={palcoRef}
        className="livro relative min-h-[92svh] overflow-hidden bg-mar-claro"
        style={{ ["--corte-base" as string]: corte }}
      >
        {/* --- Camada 1: céu e mar. Anda menos: é o que está longe. --- */}
        <Camada
          nome="ceu"
          imagem={config.ceu}
          larguras={config.larguras}
          alt={config.descricao}
          prioridade
        />

        {/* --- Camada 2: o paredão, recortado --- */}
        <Camada nome="meio" imagem={config.meio} larguras={config.larguras} />

        {/* Véu de contraste: entra depois do paredão e antes do texto */}
        <div aria-hidden="true" className="livro-camada livro-veu" />

        {/* --- Título: encosta na crista e é cortado por ela --- */}
        <div className="livro-camada livro-titulo">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-end px-6 pb-0 lg:px-8">
            <p className="olho olho-claro">Extremo sul da Bahia</p>

            {/* 14ch: o título tem de terminar antes do paredão, senão a última
                linha cai sobre o arenito claro e perde contraste. */}
            <h1 className="display livro-h1 mt-6 max-w-[14ch] text-areia">
              Falésias coloridas e um mar que recua todo dia
            </h1>
          </div>
        </div>

        {/* --- Camada 3: o banco de areia. Passa na frente do título. --- */}
        <Camada
          nome="frente"
          imagem={config.frente}
          larguras={config.larguras}
        />

        {/* --- Base: impressa sobre a areia, na frente de tudo --- */}
        <div className="livro-camada livro-base">
          <div className="mx-auto flex w-full max-w-6xl flex-col px-6 pt-[clamp(1.75rem,6vh,3.5rem)] lg:px-8">
            {/* tinta cheia, não tinta-2: a areia molhada é clara e viva, e o
                texto compete com a textura de marola */}
            <p className="medida text-lg leading-relaxed text-tinta">
              Prado guarda o paredão de areia mais fotografado da Costa das
              Baleias, uma cachoeira que cai direto na praia e um banco de areia
              que aparece só quando a maré permite.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#destinos" className="btn btn-primario">
                Ver as praias
              </a>
              <a href="#mapa" className="btn btn-secundario">
                Abrir o mapa
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Uma folha do livro. O wrapper carrega a profundidade (transform vindo do
 * CSS); a folha interna faz a animação de abertura, para que as duas não
 * disputem a mesma propriedade `transform`.
 *
 * `<img>` cru de propósito: as três camadas são recortadas e exportadas à mão
 * (o alfa da falésia e a crista do banco de areia não sobrevivem a um
 * redimensionamento automático), então o `next/image` não tem o que otimizar —
 * só somaria uma etapa de transformação em cima de arquivo já finalizado.
 */
function Camada({
  nome,
  imagem,
  larguras,
  alt,
  prioridade,
}: {
  nome: "ceu" | "meio" | "frente";
  imagem: string;
  larguras?: number[];
  alt?: string;
  prioridade?: boolean;
}) {
  return (
    <div
      className={`livro-camada livro-${nome}`}
      aria-hidden={alt ? undefined : "true"}
    >
      <div className="livro-folha">
        {/* Sem `fetchPriority="low"` nas outras camadas: todas estão acima da
            dobra e só o fundo ganha prioridade explícita. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagem}
          srcSet={montarSrcSet(imagem, larguras)}
          sizes="100vw"
          alt={alt ?? ""}
          decoding="async"
          fetchPriority={prioridade ? "high" : undefined}
          loading="eager"
        />
      </div>
    </div>
  );
}

/**
 * Monta o `srcset` a partir da convenção de nome: `ceu.webp` (o maior) mais
 * `ceu-960.webp` para cada largura declarada. A largura do arquivo base sai da
 * maior largura declarada + 1 só para ordenar; o `sizes="100vw"` é que decide.
 */
function montarSrcSet(imagem: string, larguras?: number[]): string | undefined {
  if (!larguras?.length) return undefined;

  const ponto = imagem.lastIndexOf(".");
  const base = imagem.slice(0, ponto);
  const ext = imagem.slice(ponto);

  const menores = larguras.map((l) => `${base}-${l}${ext} ${l}w`);
  return [...menores, `${imagem} ${LARGURA_BASE}w`].join(", ");
}

/** Largura real dos arquivos sem sufixo. */
const LARGURA_BASE = 1920;

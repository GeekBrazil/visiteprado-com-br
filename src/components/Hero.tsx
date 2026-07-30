import dynamic from "next/dynamic";
import {
  VIDEO_CAPA,
  TEM_CAPA,
  TEM_CAMADAS,
  TEM_SCRUB,
  urlEmbed,
} from "@/data/midia";

// Só entram no bundle quando o modo correspondente está configurado.
const HeroScrub = dynamic(() => import("@/components/HeroScrub"));
const HeroCamadas = dynamic(() => import("@/components/HeroCamadas"));

/**
 * Quatro estados, mesma mensagem. A ordem é a prioridade:
 *  - VIDEO_SCRUB  -> vídeo avança conforme a página rola
 *  - HERO_CAMADAS -> foto fatiada em 3 planos, com paralaxe (livro 3D)
 *  - VIDEO_CAPA   -> capa cinematográfica com vídeo de fundo do YouTube
 *  - nenhum deles -> capa editorial sobre papel de areia
 */
export default function Hero() {
  if (TEM_SCRUB) return <HeroScrub />;
  if (TEM_CAMADAS) return <HeroCamadas />;
  return TEM_CAPA ? <HeroCinema /> : <HeroEditorial />;
}

/* ------------------------------------------------------------------ */

function HeroEditorial() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pt-28 lg:px-8">
        <p className="olho">Extremo sul da Bahia</p>

        <h1 className="display mt-7 max-w-[15ch]">
          Falésias coloridas e um mar que{" "}
          <em className="not-italic text-falesia">recua todo dia</em>
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <p className="medida text-lg leading-relaxed text-tinta-2">
            Prado guarda o paredão de areia mais fotografado da Costa das
            Baleias, uma cachoeira que cai direto na praia e um banco de areia
            que aparece só quando a maré permite. Entre julho e novembro, as
            baleias-jubarte fazem o resto.
          </p>

          <dl className="grid grid-cols-3 gap-6 border-t border-areia-3 pt-6 md:border-0 md:pt-0">
            <Fato numero="4" rotulo="praias-assinatura" />
            <Fato numero="jul–nov" rotulo="temporada de baleias" />
            <Fato numero="~2h" rotulo="de Porto Seguro" />
          </dl>
        </div>

        <div className="mt-11 flex flex-col gap-3 sm:flex-row">
          <a href="#destinos" className="btn btn-primario">
            Ver as praias
          </a>
          <a href="#mapa" className="btn btn-secundario">
            Abrir o mapa
          </a>
        </div>
      </div>

      {/* Linha do horizonte — desenho geométrico, não ilustração */}
      <div aria-hidden="true" className="relative h-24 sm:h-32">
        <div className="absolute inset-x-0 bottom-0 h-px bg-areia-3" />
        <div className="absolute bottom-0 left-6 h-16 w-px bg-areia-3 sm:left-8" />
        <div className="absolute bottom-0 right-6 h-10 w-px bg-areia-3 sm:right-8" />
      </div>
    </section>
  );
}

function Fato({ numero, rotulo }: { numero: string; rotulo: string }) {
  return (
    <div>
      <dt className="t3 text-mar">{numero}</dt>
      <dd className="mt-1 text-xs leading-snug text-tinta-3">{rotulo}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function HeroCinema() {
  return (
    <section className="relative min-h-[86vh] overflow-hidden bg-mar-esc">
      {/* Vídeo de fundo — mudo, em loop, sem controles, fora da ordem de foco */}
      <div
        aria-hidden="true"
        className="moldura-video video-capa absolute inset-0 rounded-none"
      >
        <iframe
          src={urlEmbed(VIDEO_CAPA as string, { fundo: true })}
          title=""
          tabIndex={-1}
          allow="autoplay; encrypted-media"
        />
      </div>

      {/* Véu para garantir contraste do texto sobre qualquer cena */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,32,38,0.62) 0%, rgba(11,32,38,0.38) 45%, rgba(11,32,38,0.82) 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-end px-6 pb-20 pt-32 lg:px-8">
        <p className="olho olho-claro">Extremo sul da Bahia</p>

        <h1 className="display mt-6 max-w-[15ch] text-areia">
          Falésias coloridas e um mar que recua todo dia
        </h1>

        <p className="medida mt-6 text-lg leading-relaxed text-areia-2">
          Prado guarda o paredão de areia mais fotografado da Costa das Baleias,
          uma cachoeira que cai direto na praia e um banco de areia que aparece
          só quando a maré permite.
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
      </div>
    </section>
  );
}

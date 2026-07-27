import Link from "next/link";
import Hero from "@/components/Hero";
import Revelar from "@/components/Revelar";
import dynamic from "next/dynamic";
import GaleriaVideos from "@/components/GaleriaVideos";
import Newsletter from "@/components/Newsletter";
import NumerosOficiais from "@/components/NumerosOficiais";
import Clima from "@/components/Clima";
import { TEM_GALERIA } from "@/data/midia";
import { DESTINOS, EXPERIENCIAS, PRATICO } from "@/data/prado";
import lugares from "@/data/lugares.json";

// Leaflet só existe no browser; fora do bundle inicial para não pesar o LCP.
const MapaPrado = dynamic(() => import("@/components/MapaPrado"), {
  loading: () => (
    <div className="mt-6 h-[30rem] w-full animate-pulse rounded-[8px] border border-areia-3 bg-areia-2" />
  ),
});

export default function Home() {
  return (
    <>
      <Cabecalho />

      <main id="conteudo" className="relative z-10">
        <Hero />
        <Destinos />
        <Mapa />
        {TEM_GALERIA && <Videos />}
        <Clima />
        <Experiencias />
        <NumerosOficiais />
        <Pratico />
        <Chamada />
      </main>

      <Rodape />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Cabecalho() {
  return (
    <header className="sticky top-0 z-40 border-b border-areia-3 bg-areia/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5 lg:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="t3 leading-none tracking-tight">Visite Prado</span>
          <span className="hidden text-[0.6875rem] uppercase tracking-[0.16em] text-tinta-3 sm:inline">
            Bahia
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-9 md:flex">
          <ItemNav href="#destinos">Praias</ItemNav>
          <ItemNav href="#mapa">Mapa</ItemNav>
          {TEM_GALERIA && <ItemNav href="#videos">Vídeos</ItemNav>}
          <ItemNav href="#clima">Quando ir</ItemNav>
          <ItemNav href="#planeje">Planeje</ItemNav>
        </nav>

        <a href="#newsletter" className="text-sm font-semibold link-sub text-falesia">
          Receber novidades
        </a>
      </div>
    </header>
  );
}

function ItemNav({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-tinta-2 transition-colors hover:text-falesia"
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */

function Destinos() {
  return (
    <section id="destinos" className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
      <Revelar>
        <p className="olho">Onde ir</p>
        <h2 className="t1 mt-6 max-w-[18ch]">
          Quatro paisagens que definem o município
        </h2>
        <p className="medida mt-5 text-tinta-2">
          Prado não se resume à sede. O município se estica por dezenas de
          quilômetros de litoral, e cada trecho tem um caráter próprio — do
          paredão colorido no centro à ponta isolada no extremo norte.
        </p>
      </Revelar>

      <div className="mt-16 grid gap-x-12 gap-y-16 md:grid-cols-2">
        {DESTINOS.map((destino, i) => (
          <Revelar key={destino.slug} atraso={(i % 2) * 90}>
            <article className="flex h-full flex-col border-t border-tinta pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-falesia">
                  {destino.chapeu}
                </p>
                <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-tinta-3">
                  {destino.distancia}
                </p>
              </div>

              <h3 className="t2 mt-4">{destino.nome}</h3>

              <p className="mt-4 flex-1 leading-relaxed text-tinta-2">
                {destino.texto}
              </p>

              <ul className="mt-6 flex list-none flex-wrap gap-x-5 gap-y-2">
                {destino.destaques.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-2 text-sm text-tinta-3"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full bg-falesia"
                    />
                    {d}
                  </li>
                ))}
              </ul>
            </article>
          </Revelar>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Mapa() {
  const t = lugares.totais as Record<string, number>;
  const total = Object.values(t).reduce((a, b) => a + b, 0);

  return (
    <section id="mapa" className="border-y border-areia-3 bg-areia-2">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
        <Revelar>
          <p className="olho">Mapa</p>
          <h2 className="t1 mt-6 max-w-[18ch]">
            {total} pontos do município, no lugar certo
          </h2>
          <p className="medida mt-5 text-tinta-2">
            Praias, falésias, pousadas, campings e onde comer — do centro de
            Prado até Corumbau, no extremo norte. Filtre pelo que interessa e
            toque em cada ponto para ver o que é.
          </p>
        </Revelar>

        <Revelar atraso={80} className="mt-12">
          <MapaPrado />
        </Revelar>
      </div>
    </section>
  );
}

function Videos() {
  return (
    <section id="videos" className="border-y border-areia-3 bg-areia-2">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
        <Revelar>
          <p className="olho">Em movimento</p>
          <h2 className="t1 mt-6 max-w-[16ch]">Prado como ele é, sem retoque</h2>
          <p className="medida mt-5 text-tinta-2">
            Imagens gravadas na região. A maré, a cor da falésia e o tamanho da
            praia mudam de hora em hora — é mais honesto mostrar em vídeo.
          </p>
        </Revelar>

        <Revelar atraso={80} className="mt-14">
          <GaleriaVideos />
        </Revelar>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Experiencias() {
  return (
    <section id="experiencias" className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
      <Revelar>
        <p className="olho">O que fazer</p>
        <h2 className="t1 mt-6 max-w-[17ch]">
          Experiências que dependem da estação
        </h2>
        <p className="medida mt-5 text-tinta-2">
          A região tem um calendário próprio. Baleia tem temporada, maré tem
          hora e estrada de terra tem época boa — o roteiro muda conforme o mês
          em que você vem.
        </p>
      </Revelar>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {EXPERIENCIAS.map((exp, i) => (
          <Revelar key={exp.nome} atraso={(i % 2) * 90}>
            <article className="cartao flex h-full flex-col p-8">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-falesia">
                {exp.chapeu}
              </p>

              <h3 className="t3 mt-3">{exp.nome}</h3>

              <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-tinta-2">
                {exp.texto}
              </p>

              <p className="mt-6 flex items-center gap-2 border-t border-areia-3 pt-4 text-sm text-mar">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 stroke-current"
                  fill="none"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
                </svg>
                {exp.epoca}
              </p>
            </article>
          </Revelar>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Pratico() {
  return (
    <section id="planeje">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
        <div className="grid gap-14 md:grid-cols-[0.85fr_1.15fr]">
          <Revelar>
            <p className="olho">Antes de vir</p>
            <h2 className="t1 mt-6">Planeje a viagem</h2>
            <p className="medida-curta mt-5 text-tinta-2">
              As respostas que mais chegam por mensagem, reunidas aqui.
            </p>
          </Revelar>

          <Revelar atraso={80}>
            <dl className="grid gap-0">
              {PRATICO.map((item) => (
                <div
                  key={item.pergunta}
                  className="border-t border-areia-3 py-7 first:border-t-0 first:pt-0"
                >
                  <dt className="t3">{item.pergunta}</dt>
                  <dd className="medida mt-3 text-[0.9375rem] leading-relaxed text-tinta-2">
                    {item.resposta}
                  </dd>
                </div>
              ))}
            </dl>
          </Revelar>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Chamada() {
  return (
    <section id="newsletter" className="mx-auto max-w-3xl px-6 py-28 lg:px-8">
      <Revelar>
        <p className="olho">Newsletter</p>
        <h2 className="t1 mt-6 max-w-[16ch]">
          Prado muda com a maré e com a estação
        </h2>
        <p className="medida mt-5 text-tinta-2">
          Quando a temporada de baleias abre, quando o mar fica bom para
          Abrolhos, o que mudou nas estradas de terra do norte. Sem
          periodicidade fixa — só quando há algo que muda a sua viagem.
        </p>

        <Newsletter />
      </Revelar>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Rodape() {
  return (
    <footer className="relative z-10 border-t border-areia-3 bg-areia-2">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="t3">Visite Prado</p>
            <p className="medida-curta mt-3 text-sm leading-relaxed text-tinta-3">
              Guia independente sobre Prado e a Costa das Baleias, no extremo
              sul da Bahia.
            </p>
          </div>

          <a href="#newsletter" className="btn btn-secundario self-start sm:self-auto">
            Receber novidades
          </a>
        </div>

        <hr className="regra my-10" />

        <p className="text-xs text-tinta-3">
          © {new Date().getFullYear()} visiteprado.com.br · Allan Candido
        </p>
      </div>
    </footer>
  );
}

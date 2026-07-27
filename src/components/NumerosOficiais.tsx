import oficial from "@/data/oficial.json";
import Revelar from "@/components/Revelar";

/**
 * Números oficiais do Cadastur (Ministério do Turismo).
 *
 * Só agregados: contagens e somas. As planilhas de origem contêm CPF, nome,
 * telefone e e-mail dos cadastrados — republicar isso seria tratamento de
 * dado pessoal sem base legal. Ver scripts/etl-cadastur.py.
 *
 * Para atualizar (a base é trimestral):
 *   python3 scripts/etl-cadastur.py
 */

type Categoria = {
  total: number;
  leitos?: number;
  unidadesHabitacionais?: number;
  leitosAcessiveis?: number;
  uhsAcessiveis?: number;
  tipos?: Record<string, number>;
  referencia?: string;
};

const cat = oficial.categorias as Record<string, Categoria | undefined>;

const hospedagem = cat.hospedagem;
const agencias = cat.agencias;
const transportadoras = cat.transportadoras;
const guias = cat.guias;

const nf = new Intl.NumberFormat("pt-BR");

export default function NumerosOficiais() {
  if (!hospedagem?.total) return null;

  const referencia = hospedagem.referencia ?? "";

  return (
    <section id="numeros" className="border-y border-areia-3 bg-areia-2">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
        <div className="grid gap-14 md:grid-cols-[0.9fr_1.1fr]">
          <Revelar>
            <p className="olho">Números oficiais</p>
            <h2 className="t1 mt-6">A rede formal de Prado</h2>
            <p className="medida-curta mt-5 text-tinta-2">
              Todo estabelecimento de turismo no Brasil precisa estar no
              Cadastur, o cadastro do Ministério do Turismo. Estes são os
              registros regulares do município — não é estimativa nossa, é o
              que consta na base federal.
            </p>
          </Revelar>

          <Revelar atraso={80}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
              <Numero
                valor={nf.format(hospedagem.total)}
                rotulo="meios de hospedagem"
                nota="todos regulares"
              />
              {hospedagem.leitos ? (
                <Numero
                  valor={nf.format(hospedagem.leitos)}
                  rotulo="leitos"
                  nota={
                    hospedagem.unidadesHabitacionais
                      ? `em ${nf.format(hospedagem.unidadesHabitacionais)} unidades`
                      : undefined
                  }
                />
              ) : null}
              {hospedagem.leitosAcessiveis ? (
                <Numero
                  valor={nf.format(hospedagem.leitosAcessiveis)}
                  rotulo="leitos acessíveis"
                  nota="mobilidade reduzida"
                  destaque
                />
              ) : null}
              {agencias?.total ? (
                <Numero valor={nf.format(agencias.total)} rotulo="agências de turismo" />
              ) : null}
              {guias?.total ? (
                <Numero valor={nf.format(guias.total)} rotulo="guias credenciados" />
              ) : null}
              {transportadoras?.total ? (
                <Numero
                  valor={nf.format(transportadoras.total)}
                  rotulo="transportadoras turísticas"
                />
              ) : null}
            </div>

            {hospedagem.tipos ? (
              <p className="mt-10 border-t border-areia-3 pt-6 text-sm leading-relaxed text-tinta-2">
                A hospedagem de Prado é predominantemente de pequeno porte:{" "}
                {Object.entries(hospedagem.tipos)
                  .map(([tipo, n], i, arr) => (
                    <span key={tipo}>
                      <strong className="font-semibold text-tinta">
                        {nf.format(n)} {rotularTipo(tipo, n)}
                      </strong>
                      {i < arr.length - 2 ? ", " : i === arr.length - 2 ? " e " : ""}
                    </span>
                  ))}
                .
              </p>
            ) : null}

            <p className="mt-6 text-xs leading-relaxed text-tinta-3">
              Fonte:{" "}
              <a
                href="https://dados.turismo.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="link-sub"
              >
                Cadastur — Ministério do Turismo
              </a>
              {referencia ? `, ${referencia.toLowerCase()}` : ""}. Consulta feita
              em {formatarData(oficial.geradoEm)}. A base é atualizada a cada
              trimestre.
            </p>
          </Revelar>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Numero({
  valor,
  rotulo,
  nota,
  destaque = false,
}: {
  valor: string;
  rotulo: string;
  nota?: string;
  destaque?: boolean;
}) {
  return (
    <div>
      <p
        className={`t1 leading-none ${destaque ? "text-falesia" : "text-mar"}`}
      >
        {valor}
      </p>
      <p className="mt-2 text-sm font-medium text-tinta">{rotulo}</p>
      {nota ? <p className="mt-0.5 text-xs text-tinta-3">{nota}</p> : null}
    </div>
  );
}

function rotularTipo(tipo: string, n: number): string {
  const t = tipo.toLowerCase();
  if (n === 1) return t;
  if (t === "pousada") return "pousadas";
  if (t === "hotel") return "hotéis";
  return `${t}s`;
}

function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

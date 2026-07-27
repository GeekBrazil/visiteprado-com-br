import clima from "@/data/clima.json";

/**
 * Climatologia mensal a partir de dados reais (ERA5, via Open-Meteo),
 * pré-calculada por scripts/etl-clima.py. Responde "quando ir" com número.
 */

type Mes = {
  mes: number;
  nome: string;
  tempMax: number;
  tempMin: number;
  chuvaMm: number;
  diasComChuva: number;
};

const MESES = clima.meses as Mes[];

/** Temporada de baleias-jubarte no extremo sul da Bahia. */
const BALEIAS = new Set([7, 8, 9, 10, 11]);

export default function Clima() {
  if (!MESES.length) return null;

  const chuvaMax = Math.max(...MESES.map((m) => m.chuvaMm));
  const maisSeco = [...MESES].sort((a, b) => a.chuvaMm - b.chuvaMm)[0];

  // "Melhor mês" = menos chuva entre os que têm baleia.
  const melhor = [...MESES]
    .filter((m) => BALEIAS.has(m.mes))
    .sort((a, b) => a.chuvaMm - b.chuvaMm)[0];

  return (
    <section id="clima" className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
      <div className="grid gap-14 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div>
          <p className="olho">Quando ir</p>
          <h2 className="t1 mt-6">O calendário do lugar</h2>
          <p className="medida-curta mt-5 text-tinta-2">
            Média de {clima.periodo} medida na sede do município. Prado não tem
            inverno rigoroso — o que muda de verdade é a chuva e a presença das
            baleias.
          </p>

          {melhor ? (
            <div className="mt-8 border-l-2 border-falesia pl-5">
              <p className="t3 capitalize">{melhor.nome}</p>
              <p className="medida-curta mt-2 text-sm leading-relaxed text-tinta-2">
                O melhor encaixe do ano: {melhor.chuvaMm} mm de chuva
                {maisSeco.mes === melhor.mes ? " (o mês mais seco)" : ""}, cerca
                de {melhor.diasComChuva} dias com chuva e temperatura entre{" "}
                {Math.round(melhor.tempMin)}°C e {Math.round(melhor.tempMax)}°C —
                tudo isso dentro da temporada de baleias-jubarte.
              </p>
            </div>
          ) : null}

          <p className="mt-8 text-xs leading-relaxed text-tinta-3">
            Fonte:{" "}
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link-sub"
            >
              Open-Meteo
            </a>
            , reanálise ERA5, série de {clima.periodo}.
          </p>
        </div>

        <div>
          <ul className="list-none">
            {MESES.map((m) => {
              const proporcao = chuvaMax ? m.chuvaMm / chuvaMax : 0;
              const temBaleia = BALEIAS.has(m.mes);
              return (
                <li
                  key={m.mes}
                  className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 border-t border-areia-3 py-3 first:border-t-0"
                >
                  <span className="text-sm font-medium capitalize text-tinta">
                    {m.nome.slice(0, 3)}
                    {temBaleia ? (
                      <span
                        className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-mar align-middle"
                        title="Temporada de baleias"
                      />
                    ) : null}
                  </span>

                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-1.5 rounded-full bg-mar/70"
                      style={{ width: `${Math.max(4, proporcao * 100)}%` }}
                    />
                    <span className="whitespace-nowrap text-xs text-tinta-3">
                      {m.chuvaMm} mm
                    </span>
                  </span>

                  <span className="whitespace-nowrap text-xs tabular-nums text-tinta-2">
                    {Math.round(m.tempMin)}–{Math.round(m.tempMax)}°C
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 flex items-center gap-2 text-xs text-tinta-3">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-mar"
            />
            meses com baleias-jubarte na costa
          </p>
        </div>
      </div>
    </section>
  );
}

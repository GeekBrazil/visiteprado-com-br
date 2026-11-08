"use client";

import { useState, useMemo, useRef } from "react";

interface Passeio {
  id: string;
  nome: string;
  descricao: string;
  precoPessoa: number;
  icone: string;
  temporada?: string;
}

const PASSEIOS: Passeio[] = [
  {
    id: "jubarte",
    nome: "Observação de Baleias Jubarte",
    descricao: "Embarcação em alto-mar com biólogos para ver saltos e cantos (temporada oficial)",
    precoPessoa: 380,
    icone: "🐋",
    temporada: "Julho a Novembro",
  },
  {
    id: "abrolhos",
    nome: "Expedição de 1 Dia ao Arquipélago de Abrolhos",
    descricao: "Mergulho de superfície/snorkel nas águas cristalinas do santuário marinho",
    precoPessoa: 560,
    icone: "🐠",
    temporada: "Ano todo (mar calmo no verão)",
  },
  {
    id: "corumbau",
    nome: "Bate-volta 4x4 ou Lancha à Ponta do Corumbau",
    descricao: "Ponta de areia que entra 2 km no mar calmo na maré baixa + falésias",
    precoPessoa: 250,
    icone: "🚙",
  },
  {
    id: "jucurucu",
    nome: "Passeio de Barco no Rio Jucuruçu",
    descricao: "Travessia pelos manguezais preservados até a foz do encontro rio-mar",
    precoPessoa: 120,
    icone: "⛵",
  },
  {
    id: "pataxo",
    nome: "Vivência na Aldeia Indígena Pataxó",
    descricao: "Cultura, trilha na mata nativa e gastronomia tradicional no Descobrimento",
    precoPessoa: 160,
    icone: "🏹",
  },
];

const PERFIS = [
  {
    id: "economico",
    nome: "Mochileiro & Autêntico",
    diariaPessoa: 170,
    descricao: "Pousadas simples e aconchegantes, pratos feitos de peixe fresco na beira da praia e locomoção a pé ou ônibus local.",
    icone: "🎒",
  },
  {
    id: "conforto",
    nome: "Conforto & Charme",
    diariaPessoa: 420,
    descricao: "Pousadas com piscina e café colonial, jantares no Beco das Garrafas com moqueca baiana e passeios estruturados.",
    icone: "🏖️",
  },
  {
    id: "premium",
    nome: "Pé na Areia Exclusivo",
    diariaPessoa: 890,
    descricao: "Pousadas boutique em Cumuruxatiba ou Corumbau, alta gastronomia de frutos do mar e transfers privativos.",
    icone: "✨",
  },
];

const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

export default function CalculadoraViagemPrado() {
  const [dias, setDias] = useState<number>(5);
  const [pessoas, setPessoas] = useState<number>(2);
  const [perfilId, setPerfilId] = useState<string>("conforto");
  const [passeiosSelecionados, setPasseiosSelecionados] = useState<string[]>(["jubarte", "corumbau"]);
  const [modalCardAberto, setModalCardAberto] = useState(false);
  const [formatoCard, setFormatoCard] = useState<"feed" | "story">("feed");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const perfil = PERFIS.find((p) => p.id === perfilId) || PERFIS[1];

  const togglePasseio = (id: string) => {
    setPasseiosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const calculo = useMemo(() => {
    const custoEstadiaTotal = perfil.diariaPessoa * dias * pessoas;
    const custoPasseiosTotal = passeiosSelecionados.reduce((acc, id) => {
      const p = PASSEIOS.find((item) => item.id === id);
      return acc + (p ? p.precoPessoa * pessoas : 0);
    }, 0);

    const total = custoEstadiaTotal + custoPasseiosTotal;
    const porPessoa = total / Math.max(1, pessoas);
    const porDiaPessoa = porPessoa / Math.max(1, dias);

    return {
      custoEstadiaTotal,
      custoPasseiosTotal,
      total,
      porPessoa,
      porDiaPessoa,
    };
  }, [dias, pessoas, perfil, passeiosSelecionados]);

  // Renderizador do Card em Canvas
  const desenharCard = (formato: "feed" | "story") => {
    const w = 1080;
    const h = formato === "story" ? 1920 : 1350;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fundo em papel quente e textura areia
    ctx.fillStyle = "#fbf6ec";
    ctx.fillRect(0, 0, w, h);

    // Margem e moldura terracota / falésia
    const m = 54;
    ctx.strokeStyle = "#c0562c";
    ctx.lineWidth = 4;
    ctx.strokeRect(m, m, w - m * 2, h - m * 2);

    // Header superior
    ctx.fillStyle = "#16262b";
    ctx.font = "bold 34px Georgia, serif";
    ctx.fillText("Visite Prado", m + 36, m + 70);

    ctx.fillStyle = "#c0562c";
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.fillText("COSTA DAS BALEIAS · BAHIA", m + 36, m + 110);

    ctx.fillStyle = "#556970";
    ctx.font = "20px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("visiteprado.com.br", w - m - 36, m + 70);
    ctx.textAlign = "left";

    // Linha divisória
    ctx.strokeStyle = "#e9dcc6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(m + 36, m + 135);
    ctx.lineTo(w - m - 36, m + 135);
    ctx.stroke();

    // Título Principal do Roteiro
    let y = m + 210;
    ctx.fillStyle = "#16262b";
    ctx.font = "bold 56px Georgia, serif";
    ctx.fillText(`Roteiro de ${dias} Dias em Prado`, m + 36, y);

    y += 50;
    ctx.fillStyle = "#3d5158";
    ctx.font = "28px system-ui, sans-serif";
    ctx.fillText(`Para ${pessoas} ${pessoas === 1 ? "pessoa" : "pessoas"} · Estilo ${perfil.nome}`, m + 36, y);

    // Bloco de Preço / Estimativa
    y += 45;
    ctx.fillStyle = "#f4ebdb";
    ctx.fillRect(m + 36, y, w - m * 2 - 72, 220);
    ctx.strokeStyle = "#c0562c";
    ctx.lineWidth = 2;
    ctx.strokeRect(m + 36, y, w - m * 2 - 72, 220);

    ctx.fillStyle = "#c0562c";
    ctx.font = "bold 24px system-ui, sans-serif";
    ctx.fillText("ESTIMATIVA TOTAL DE VIAGEM", m + 72, y + 54);

    ctx.fillStyle = "#16262b";
    ctx.font = "bold 82px Georgia, serif";
    ctx.fillText(brl(calculo.total), m + 72, y + 140);

    ctx.fillStyle = "#3d5158";
    ctx.font = "24px system-ui, sans-serif";
    ctx.fillText(`Média de ${brl(calculo.porPessoa)} por pessoa (${brl(calculo.porDiaPessoa)}/dia)`, m + 72, y + 185);

    // Passeios Incluídos
    y += 265;
    ctx.fillStyle = "#16262b";
    ctx.font = "bold 32px Georgia, serif";
    ctx.fillText("Experiências Selecionadas no Roteiro:", m + 36, y);

    y += 25;
    const listaPasseios = PASSEIOS.filter((p) => passeiosSelecionados.includes(p.id));
    if (listaPasseios.length === 0) {
      y += 40;
      ctx.fillStyle = "#556970";
      ctx.font = "italic 26px Georgia, serif";
      ctx.fillText("• Roteiro livre pelas praias e falésias sem passeios fechados", m + 50, y);
    } else {
      listaPasseios.forEach((p) => {
        y += 54;
        ctx.fillStyle = "#0b6e6b";
        ctx.font = "bold 28px system-ui, sans-serif";
        ctx.fillText(`✓ ${p.nome}`, m + 45, y);

        y += 32;
        ctx.fillStyle = "#556970";
        ctx.font = "22px system-ui, sans-serif";
        ctx.fillText(`${p.descricao.slice(0, 72)}... (${brl(p.precoPessoa)}/pessoa)`, m + 75, y);
      });
    }

    // Dicas Práticas no Rodapé do Card
    const bottomY = h - m - 120;
    ctx.strokeStyle = "#e9dcc6";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(m + 36, bottomY);
    ctx.lineTo(w - m - 36, bottomY);
    ctx.stroke();

    ctx.fillStyle = "#16262b";
    ctx.font = "bold 24px Georgia, serif";
    ctx.fillText("Dica do Guia:", m + 36, bottomY + 36);

    ctx.fillStyle = "#3d5158";
    ctx.font = "20px system-ui, sans-serif";
    ctx.fillText("Consulte a tábua de marés antes de visitar Corumbau e Cumuruxatiba (maré < 0.4m expõe piscinas).", m + 36, bottomY + 68);

    ctx.fillStyle = "#556970";
    ctx.font = "18px system-ui, sans-serif";
    ctx.fillText("visiteprado.com.br · O guia autêntico do extremo sul da Bahia", m + 36, bottomY + 98);

    // Salvar e acionar download
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `roteiro-prado-${dias}dias-${formato}.png`;
    a.click();
  };

  return (
    <section id="calculadora" className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
      <div className="border-t border-tinta pt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-falesia">
              Planejamento Financeiro & Roteiro
            </p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-tinta mt-2">
              Quanto custa viajar para Prado?
            </h2>
            <p className="mt-3 max-w-2xl text-base text-tinta-2 leading-relaxed">
              Simule os custos reais de hospedagem, refeições e passeios pelo litoral de Prado, Cumuruxatiba e Corumbau. Exporte seu card personalizado para compartilhar no Instagram.
            </p>
          </div>
          <span className="rounded-full border border-areia-3 bg-areia-2 px-4 py-1.5 text-xs font-semibold text-tinta-3">
            Valores médios da temporada 2026
          </span>
        </div>

        {/* Grade de Controles */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12 items-start">
          {/* Lado Esquerdo: Parâmetros */}
          <div className="lg:col-span-7 space-y-8 bg-areia-2/60 border border-areia-3 rounded-2xl p-6 sm:p-8">
            {/* Dias de Estadia */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-tinta-3 mb-3">
                Duração da Viagem
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[3, 5, 7, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDias(num)}
                    className={`py-2.5 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      dias === num
                        ? "bg-falesia text-white shadow-sm"
                        : "bg-areia border border-areia-3 text-tinta-2 hover:border-falesia/50"
                    }`}
                  >
                    {num} dias
                  </button>
                ))}
              </div>
            </div>

            {/* Número de Pessoas */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-tinta-3 mb-3">
                Número de Viajantes
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPessoas(num)}
                    className={`py-2.5 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      pessoas === num
                        ? "bg-falesia text-white shadow-sm"
                        : "bg-areia border border-areia-3 text-tinta-2 hover:border-falesia/50"
                    }`}
                  >
                    {num} {num === 1 ? "pessoa" : "pessoas"}
                  </button>
                ))}
              </div>
            </div>

            {/* Estilo / Perfil de Hospedagem & Gastronomia */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-tinta-3 mb-3">
                Estilo de Viagem (Diária Média por Pessoa)
              </label>
              <div className="space-y-3">
                {PERFIS.map((p) => {
                  const ativo = perfilId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setPerfilId(p.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                        ativo
                          ? "bg-areia border-falesia shadow-sm ring-1 ring-falesia"
                          : "bg-areia border-areia-3 hover:border-areia-3"
                      }`}
                    >
                      <span className="text-2xl">{p.icone}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-tinta text-sm">{p.nome}</h4>
                          <span className="text-xs font-bold text-falesia">{brl(p.diariaPessoa)}/dia</span>
                        </div>
                        <p className="mt-1 text-xs text-tinta-3 leading-relaxed">{p.descricao}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Passeios Adicionais */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-tinta-3 mb-3">
                Experiências & Passeios Marcantes
              </label>
              <div className="space-y-2.5">
                {PASSEIOS.map((p) => {
                  const marcado = passeiosSelecionados.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                        marcado
                          ? "bg-mar-claro/50 border-mar/40 text-tinta"
                          : "bg-areia border-areia-3 text-tinta-2 hover:border-areia-3"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={marcado}
                        onChange={() => togglePasseio(p.id)}
                        className="mt-1 h-4 w-4 rounded border-areia-3 text-mar focus:ring-mar cursor-pointer"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-bold text-tinta text-sm">
                            {p.icone} {p.nome}
                          </span>
                          <span className="font-bold text-mar-esc whitespace-nowrap">
                            +{brl(p.precoPessoa)}
                          </span>
                        </div>
                        <p className="text-tinta-3 mt-0.5">{p.descricao}</p>
                        {p.temporada && (
                          <span className="inline-block mt-1 text-[0.65rem] font-semibold text-ouro uppercase tracking-wider">
                            🗓️ {p.temporada}
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lado Direito: Resumo Financeiro & Ações de Compartilhamento */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-areia border border-tinta/80 rounded-2xl p-6 sm:p-8 shadow-sm">
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-falesia">
                Resumo Estimado
              </span>
              <p className="text-4xl sm:text-5xl font-black text-tinta mt-2 tracking-tight">
                {brl(calculo.total)}
              </p>
              <p className="text-xs text-tinta-3 mt-1">
                Estimativa total para {pessoas} {pessoas === 1 ? "pessoa" : "pessoas"} por {dias} dias
              </p>

              <hr className="my-5 border-areia-3" />

              <div className="space-y-3 text-xs text-tinta-2">
                <div className="flex justify-between">
                  <span>Hospedagem + Alimentação:</span>
                  <strong className="text-tinta">{brl(calculo.custoEstadiaTotal)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Passeios Selecionados ({passeiosSelecionados.length}):</span>
                  <strong className="text-tinta">{brl(calculo.custoPasseiosTotal)}</strong>
                </div>
                <div className="flex justify-between border-t border-areia-3 pt-2 font-bold text-tinta">
                  <span>Média por pessoa:</span>
                  <span className="text-falesia text-sm">{brl(calculo.porPessoa)}</span>
                </div>
                <div className="flex justify-between text-tinta-3 text-[0.7rem]">
                  <span>Custo diário individual:</span>
                  <span>{brl(calculo.porDiaPessoa)} / dia</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-areia-3 space-y-3">
                <button
                  type="button"
                  onClick={() => desenharCard("feed")}
                  className="w-full bg-falesia hover:bg-falesia-esc text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📸</span>
                  <span>Baixar Card p/ Feed (1080×1350)</span>
                </button>

                <button
                  type="button"
                  onClick={() => desenharCard("story")}
                  className="w-full bg-areia-2 border border-areia-3 hover:border-falesia text-tinta font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📱</span>
                  <span>Baixar Card p/ Stories (1080×1920)</span>
                </button>

                <a
                  href={`https://wa.me/5524993326966?text=${encodeURIComponent(
                    `Olá Allan! Simulei meu roteiro em Prado no visiteprado.com.br: ${dias} dias para ${pessoas} pessoas no perfil ${perfil.nome} (${brl(
                      calculo.total
                    )}). Gostaria de tirar algumas dúvidas sobre a melhor época e pousadas recomendadas.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-mar hover:bg-mar-esc text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 text-center"
                >
                  <span>💬</span>
                  <span>Tirar Dúvidas com o Allan no WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="bg-areia-2 border border-areia-3 rounded-xl p-4 text-xs text-tinta-3 leading-relaxed">
              <strong className="text-tinta block mb-1">💡 Dica do Allan:</strong>
              As marés baixas nas luas Nova e Cheia são cruciais para a travessia de Corumbau e para as piscinas naturais de Cumuruxatiba. Para Abrolhos e Jubartes, priorize saídas pela manhã com vento sul fraco.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

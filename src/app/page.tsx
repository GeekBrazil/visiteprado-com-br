"use client";

import { useState } from "react";

interface Workshop {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  price: number;
  spotsLeft: number;
  instructor: string;
  description: string;
  included: string[];
}

const WORKSHOPS: Workshop[] = [
  {
    id: "1",
    title: "Workshop de Permacultura Litorânea & Construção Ecológica",
    category: "Permacultura & Ecologia",
    date: "15 a 17 de Novembro",
    location: "Praia do Tororão · Prado/BA",
    price: 490,
    spotsLeft: 6,
    instructor: "Eng. Mestre Allan C.",
    description: "Imersão de 3 dias aprendendo sistemas de energia solar, bioconstrução com materiais locais e hortas agroflorestais à beira-mar.",
    included: ["Hospedagem em Camping Eco", "Alimentação Orgânica", "Certificado de Participação", "Material Didático"],
  },
  {
    id: "2",
    title: "Imersão em Marketing de Experiência & Produção de Conteúdo ao Ar Livre",
    category: "Marketing & Negócios",
    date: "22 a 24 de Novembro",
    location: "Cumuruxatiba · Prado/BA",
    price: 580,
    spotsLeft: 4,
    instructor: "Equipe Visite Prado",
    description: "Aprenda a construir marcas sustentáveis, storytelling imersivo e estratégias de conteúdo utilizando a natureza como cenário.",
    included: ["Workshop Presencial 20h", "Sessão Fotográfica Profissional", "Mentoria de Posicionamento"],
  },
  {
    id: "3",
    title: "Expedição Ecoturismo & Observação de Baleias Jubarte em Abrolhos",
    category: "Ecoturismo & Aventura",
    date: "06 a 08 de Dezembro",
    location: "Arquipélago de Abrolhos / Prado",
    price: 890,
    spotsLeft: 3,
    instructor: "Guias Biólogos Credenciados",
    description: "Navegação e mergulho no Parque Nacional Marinho de Abrolhos com acompanhamento de biólogos marinhos.",
    included: ["Embarcação Catamarã", "Equipamento de Mergulho", "Refeições a Bordo", "Guia Especializado"],
  },
];

const DESTINATIONS = [
  {
    name: "Cumuruxatiba",
    tag: "Praias Virgens & Falésias",
    desc: "Vila de pescadores rústica com mar calmo, rios navegáveis e falésias alaranjadas exuberantes.",
    accent: "from-amber-500/20 to-orange-500/10",
  },
  {
    name: "Praia do Tororão",
    tag: "Cascata de Água Doce na Praia",
    desc: "Famosa pela pequena queda d'água doce que cai diretamente nas areias emolduradas por falésias.",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
  {
    name: "Corumbau",
    tag: "Ponta de Areia & Recife Coralino",
    desc: "Uma ponta de areia que adentra o mar cristalino durante a maré baixa. Um dos refúgios mais preservados do Brasil.",
    accent: "from-cyan-500/20 to-blue-500/10",
  },
  {
    name: "Abrolhos",
    tag: "Santuário Marinho das Jubartes",
    desc: "Berçário natural de baleias e o maior complexo de recifes de corais do Sul da Bahia.",
    accent: "from-indigo-500/20 to-purple-500/10",
  },
];

export default function Home() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userPhone) return;

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsBookingModalOpen(false);
      setSelectedWorkshop(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#070b0d] text-white selection:bg-amber-400 selection:text-black">
      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070b0d]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 flex items-center justify-center font-extrabold text-black text-xl shadow-lg shadow-amber-500/20">
              🌴
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-amber-100 to-emerald-400 bg-clip-text text-transparent">
              Visite<span className="text-amber-400">Prado.com.br</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-400">
            <a href="#workshops" className="hover:text-amber-400 transition-colors">Workshops de Verão</a>
            <a href="#destinos" className="hover:text-amber-400 transition-colors">Destinos & Praias</a>
            <a href="#ecoturismo" className="hover:text-amber-400 transition-colors">Ecoturismo</a>
          </div>

          <div>
            <a
              href="https://api.whatsapp.com/send?phone=5524993326966&text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20workshops%20e%20passeios%20em%20Prado/BA."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-amber-500 to-emerald-400 hover:from-amber-400 hover:to-emerald-300 text-black font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 block"
            >
              💬 Falar com Guia no WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[150px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold mb-6 backdrop-blur-md">
            <span>🌊</span> COSTA DAS BALEIAS · SUL DA BAHIA
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6">
            Onde a Aventura Encontra o Aprendizado e a{" "}
            <span className="bg-gradient-to-r from-amber-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
              Natureza Preservada
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Workshops presenciais de permacultura, ecoturismo sustentável e expedições pelas praias mais paradisíacas de Prado, Cumuruxatiba e Corumbau.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#workshops"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm px-8 py-4 rounded-xl transition-all shadow-xl shadow-amber-500/25 hover:scale-105"
            >
              Ver Workshops Disponíveis ↓
            </a>
            <a
              href="#destinos"
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm px-8 py-4 rounded-xl transition-all"
            >
              Explorar Praias de Prado
            </a>
          </div>
        </div>
      </section>

      {/* ── WORKSHOPS EM DESTAQUE ── */}
      <section id="workshops" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase text-amber-400 tracking-widest">IMERSÃO & CONHECIMENTO</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
            Workshops Presenciais de Verão
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Vagas limitadas para garimpar aprendizado prático rodeado pela natureza intocada do litoral baiano.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {WORKSHOPS.map((ws) => (
            <div
              key={ws.id}
              className="bg-gradient-to-b from-zinc-900/90 to-zinc-900/40 border border-white/10 hover:border-amber-500/40 rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase text-amber-400 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
                    {ws.category}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                    {ws.spotsLeft} vagas restantes
                  </span>
                </div>

                <h3 className="text-xl font-black text-white mt-2 leading-snug">{ws.title}</h3>
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">{ws.description}</p>

                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                  <div className="text-xs text-zinc-300 font-semibold flex items-center gap-2">
                    <span>📅</span> <span>{ws.date}</span>
                  </div>
                  <div className="text-xs text-zinc-300 font-semibold flex items-center gap-2">
                    <span>📍</span> <span>{ws.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Investimento</span>
                  <span className="text-2xl font-black text-amber-400">R$ {ws.price}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedWorkshop(ws);
                    setIsBookingModalOpen(true);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-4 py-3 rounded-xl transition-all shadow-md shadow-amber-500/20"
                >
                  Garantir Vaga ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DESTINOS E PRAIAS ── */}
      <section id="destinos" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase text-emerald-400 tracking-widest">BELEZA NATURAL INTOCADA</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
            Principais Destinos em Prado/BA
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.name}
              className={`bg-gradient-to-b ${dest.accent} border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all`}
            >
              <span className="text-xs font-extrabold uppercase text-amber-400 tracking-wider block">{dest.tag}</span>
              <h3 className="text-2xl font-black text-white mt-1">{dest.name}</h3>
              <p className="text-xs text-zinc-300 mt-3 leading-relaxed">{dest.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MODAL RESERVA WORKSHOP ── */}
      {isBookingModalOpen && selectedWorkshop && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsBookingModalOpen(false)}
        >
          <div
            className="bg-[#0e1317] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-white text-xl"
            >
              ✕
            </button>

            {bookingSuccess ? (
              <div className="text-center py-8">
                <span className="text-5xl">🎉</span>
                <h3 className="text-2xl font-black text-white mt-4">Inscrição Pré-Reservada!</h3>
                <p className="text-sm text-zinc-400 mt-2">
                  Entraremos em contato via WhatsApp para confirmar os detalhes do seu pacote de workshop em Prado/BA.
                </p>
              </div>
            ) : (
              <>
                <span className="text-xs font-black uppercase text-amber-400 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
                  {selectedWorkshop.category}
                </span>

                <h3 className="text-xl font-black text-white mt-3">{selectedWorkshop.title}</h3>
                <p className="text-xs text-zinc-400 mt-1">{selectedWorkshop.date} · {selectedWorkshop.location}</p>

                <div className="my-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs text-zinc-500 font-bold block">INVESTIMENTO</span>
                  <span className="text-2xl font-black text-amber-400">R$ {selectedWorkshop.price}</span>
                </div>

                <form onSubmit={handleBooking} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Seu Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Allan Candido"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">WhatsApp de Contato</label>
                    <input
                      type="tel"
                      required
                      placeholder="(24) 99332-6966"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">E-mail</label>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 bg-gradient-to-r from-amber-500 to-emerald-400 text-black font-extrabold text-sm py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
                  >
                    Confirmar Pré-Inscrição ➔
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 py-12 px-4 text-center text-xs text-zinc-500">
        <p>© 2026 VisitePrado.com.br · Todos os direitos reservados. Allan Candido.</p>
      </footer>
    </div>
  );
}

// RASCUNHO - REVISAR COM ADVOGADO ANTES DE PUBLICAR
// Minuta preliminar da Política de Privacidade para o portal Visite Prado (LGPD).

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade · Visite Prado",
  description: "Política de Privacidade e diretrizes de tratamento de dados pessoais do Visite Prado.",
  robots: { index: true, follow: true },
};

export default function PrivacidadePage() {
  return (
    <main id="conteudo" className="min-h-screen bg-areia text-tinta py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-mar hover:text-mar-esc transition-colors mb-8"
        >
          ← Voltar para a página inicial
        </Link>

        {/* AVISO VISÍVEL DE MINUTA PRELIMINAR */}
        <div
          role="alert"
          className="mb-10 rounded-[4px] border border-ouro/40 bg-areia-2 p-5 text-sm text-tinta-2 leading-relaxed shadow-sm"
        >
          <p className="font-bold text-tinta flex items-center gap-2 mb-1">
            <span>⚠️</span> Minuta Preliminar em Revisão
          </p>
          <p>
            Este documento é uma minuta preliminar em revisão jurídica e ainda não constitui a versão final da Política de Privacidade do Visite Prado.
          </p>
        </div>

        <p className="olho">Transparência & LGPD</p>
        <h1 className="t1 mt-3">Política de Privacidade</h1>
        <p className="mt-2 text-xs text-tinta-3">Última atualização: 30 de setembro de 2026</p>

        <hr className="regra my-8" />

        <div className="space-y-8 text-[0.9375rem] leading-relaxed text-tinta-2">
          <section>
            <h2 className="t3 text-tinta mb-3">1. Identificação do Controlador</h2>
            <p>
              O responsável pelo tratamento dos dados pessoais coletados neste portal é <strong>Allan Candido</strong>, mantenedor do projeto independente <em>visiteprado.com.br</em>.
            </p>
            <p className="mt-2">
              Para esclarecimentos sobre dados, solicitações de descadastro ou exercício de direitos previstos na Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), entre em contato pelo e-mail:{" "}
              <a href="mailto:lider@allancandido.com" className="font-semibold text-mar hover:underline">
                lider@allancandido.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="t3 text-tinta mb-3">2. Dados Coletados e Finalidade</h2>
            <p>
              O portal <em>visiteprado.com.br</em> é um guia informativo. Os dados tratados são estes:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1.5 text-tinta-2">
              <li><strong>Newsletter — dado coletado:</strong> endereço de e-mail, data da inscrição e o registro do consentimento.</li>
              <li><strong>Newsletter — finalidade:</strong> envio de informações sobre Prado e a Costa das Baleias — temporada de baleias-jubarte, marés, estradas de terra e dicas locais.</li>
              <li><strong>Newsletter — base legal:</strong> consentimento (Art. 7º, I, da LGPD), dado ao marcar a caixa do formulário.</li>
              <li><strong>Newsletter — serviço usado:</strong> a inscrição é recebida pelo servidor do allancandido.com (do mesmo mantenedor) e a lista fica guardada em repositório privado no GitHub. O envio é feito pelo próprio mantenedor.</li>
              <li><strong>Chat do site:</strong> o texto que você escreve no chat, usado só para gerar a resposta do atendimento automático. Base legal: legítimo interesse (Art. 7º, IX).</li>
              <li><strong>Estatística de uso:</strong> páginas visitadas, tempo, rolagem, cliques e origem da visita, sem cookie e sem guardar o IP. Ao tocar num botão de WhatsApp, registramos a página de origem antes de abrir a conversa. Base legal: legítimo interesse (Art. 7º, IX) em melhorar o guia.</li>
            </ul>
          </section>

          <section>
            <h2 className="t3 text-tinta mb-3">3. Não Compartilhamento com Terceiros</h2>
            <p>
              Em total conformidade com a declaração de consentimento informada na coleta, <strong>não há cessão, venda, locação ou repartilhamento de e-mails com terceiros ou patrocinadores</strong>. Os envios são operados diretamente pelo mantenedor do site. O servidor fica na Hetzner (Alemanha) e a lista de e-mails no GitHub (EUA); a transferência internacional se apoia nas garantias contratuais desses fornecedores (Art. 33 da LGPD).
            </p>
          </section>

          <section>
            <h2 className="t3 text-tinta mb-3">4. Prazo de Retenção dos Dados</h2>
            <p>
              O e-mail fica na lista enquanto a inscrição estiver ativa. Ao pedir o descadastro, ele sai da lista de envio na hora e é apagado em até 30 dias.
            </p>
          </section>

          <section>
            <h2 className="t3 text-tinta mb-3">5. Direitos do Titular & Descadastro (Opt-out)</h2>
            <p>
              Nos termos do Art. 18 da LGPD, você pode a qualquer momento:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1.5 text-tinta-2">
              <li>Confirmar a existência de tratamento de seus dados;</li>
              <li>Solicitar a alteração ou correção de seu e-mail cadastrado;</li>
              <li>Solicitar a exclusão definitiva e descadastro imediato da lista de envios.</li>
            </ul>
            <p className="mt-3">
              Todo e-mail enviado pela newsletter contém instrução de descadastro, ou você pode requisitar diretamente enviando mensagem para{" "}
              <a href="mailto:lider@allancandido.com" className="font-semibold text-mar hover:underline">
                lider@allancandido.com
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-14 border-t border-areia-3 pt-8 flex items-center justify-between text-xs text-tinta-3">
          <p>© {new Date().getFullYear()} visiteprado.com.br · Allan Candido</p>
          <Link href="/" className="text-mar hover:underline">
            Voltar ao Início
          </Link>
        </div>
      </div>
    </main>
  );
}

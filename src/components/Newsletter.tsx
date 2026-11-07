"use client";

import { useState } from "react";
import Link from "next/link";
import { validarSintaxeEmail } from "@/lib/validacaoEmail";

type Estado = "parado" | "enviando" | "ok" | "erro";

/* A lista de inscritos mora no allancandido.com, que já tem a credencial de
 * escrita no repositório privado. Assim o GITHUB_TOKEN existe em um lugar só,
 * em vez de ser replicado a cada site novo. O campo `origem` mantém as listas
 * separáveis. Este site é público — nada de segredo aqui. */
const ENDPOINT = "https://allancandido.com/api/newsletter/subscribe";

/**
 * `id` existe porque a captura aparece duas vezes na home — uma no pico de
 * interesse, depois de "O que fazer", e outra no fecho. Dois campos com o
 * mesmo id quebrariam a associacao com o <label>.
 */
export default function Newsletter({ id = "email" }: { id?: string }) {
  const [email, setEmail] = useState("");
  const [sugestao, setSugestao] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [estado, setEstado] = useState<Estado>("parado");
  const [mensagem, setMensagem] = useState("");

  function aoMudarEmail(val: string) {
    setEmail(val);
    setSugestao(null);
    if (estado === "erro") setEstado("parado");
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setSugestao(null);

    const checagem = validarSintaxeEmail(email, "pt");
    if (!checagem.valido) {
      setEstado("erro");
      setMensagem(checagem.erro || "E-mail inválido.");
      if (checagem.sugestao) {
        setSugestao(checagem.sugestao);
      }
      return;
    }

    setEstado("enviando");
    setMensagem("");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: checagem.emailLimpo, consent, origem: "visiteprado" }),
      });
      const dados = await res.json().catch(() => ({}));

      if (res.ok) {
        setEstado("ok");
        setMensagem(dados.confirmar ? "Falta um passo: mandamos um e-mail de confirmação. Clique no link para a inscrição valer." : (dados.message ?? "Pronto. Você recebe as próximas."));
        setEmail("");
        setConsent(false);
      } else {
        setEstado("erro");
        setMensagem(dados.error ?? "Não foi possível concluir agora.");
      }
    } catch {
      setEstado("erro");
      setMensagem("Falha de conexão. Tente de novo em instantes.");
    }
  }

  if (estado === "ok") {
    return (
      <p
        role="status"
        className="mt-9 rounded-[4px] border border-mar/30 bg-mar-claro px-5 py-4 text-sm text-mar-esc"
      >
        {mensagem}
      </p>
    );
  }

  return (
    <form onSubmit={enviar} className="mt-9">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={id} className="sr-only">
          Seu e-mail
        </label>
        <input
          id={id}
          type="email"
          required
          value={email}
          onChange={(e) => aoMudarEmail(e.target.value)}
          placeholder="seu@email.com"
          autoComplete="email"
          className="w-full rounded-[4px] border border-areia-3 bg-areia px-4 py-3.5 text-tinta transition-colors placeholder:text-tinta-3/60 focus:border-mar focus:outline-none"
        />
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="btn btn-primario shrink-0 disabled:opacity-60"
        >
          {estado === "enviando" ? "Enviando…" : "Quero receber"}
        </button>
      </div>

      {sugestao && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded">
          <span>Você quis dizer <strong>{sugestao}</strong>?</span>
          <button
            type="button"
            onClick={() => {
              setEmail(sugestao);
              setSugestao(null);
              setEstado("parado");
              setMensagem("");
            }}
            className="underline font-bold text-amber-900 ml-auto hover:text-black"
          >
            Usar {sugestao}
          </button>
        </div>
      )}

      <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-tinta-2">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-falesia"
        />
        <span>
          Autorizo o envio de e-mails sobre Prado e a Costa das Baleias. Sem
          repasse a terceiros; dá para sair a qualquer momento (veja nossa{" "}
          <Link href="/privacidade" className="underline text-mar hover:text-mar-esc font-medium">
            Política de Privacidade
          </Link>).
        </span>
      </label>

      {estado === "erro" && (
        <p
          role="alert"
          className="mt-4 rounded-[4px] border border-falesia/40 bg-falesia/5 px-4 py-3 text-sm text-falesia-esc"
        >
          {mensagem}
        </p>
      )}
    </form>
  );
}

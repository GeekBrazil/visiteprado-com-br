"use client";

import { useState } from "react";

type Estado = "parado" | "enviando" | "ok" | "erro";

/* A lista de inscritos mora no allancandido.com, que já tem a credencial de
 * escrita no repositório privado. Assim o GITHUB_TOKEN existe em um lugar só,
 * em vez de ser replicado a cada site novo. O campo `origem` mantém as listas
 * separáveis. Este site é público — nada de segredo aqui. */
const ENDPOINT = "https://allancandido.com/api/newsletter/subscribe";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [estado, setEstado] = useState<Estado>("parado");
  const [mensagem, setMensagem] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    setMensagem("");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, origem: "visiteprado" }),
      });
      const dados = await res.json().catch(() => ({}));

      if (res.ok) {
        setEstado("ok");
        setMensagem(dados.message ?? "Pronto. Você recebe as próximas.");
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
        <label htmlFor="email" className="sr-only">
          Seu e-mail
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          repasse a terceiros; dá para sair a qualquer momento.
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

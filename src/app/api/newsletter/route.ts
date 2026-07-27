import { NextRequest, NextResponse } from "next/server";

/* Inscrição na newsletter do Visite Prado.
 *
 * ATENÇÃO: o repositório DESTE site (GeekBrazil/visiteprado-com-br) é PÚBLICO.
 * Os e-mails são gravados no repo PRIVADO GeekBrazil/allancandido-com, nunca
 * aqui — commitar inscrito num repo público exporia dado pessoal (LGPD).
 * Cada registro leva `origem: "visiteprado"` para as listas não se misturarem.
 *
 * Exige GITHUB_TOKEN nas variáveis de ambiente do projeto na Vercel, com
 * permissão de escrita no repo privado. Sem o token a rota devolve 503 e o
 * formulário avisa o visitante — melhor recusar do que perder o e-mail em
 * silêncio.
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const REPO = "GeekBrazil/allancandido-com";
const FILE_PATH = "data/newsletter-subscribers.json";

interface Inscrito {
  email: string;
  subscribedAt: string;
  origem?: string;
}

const CABECALHOS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
};

async function lerInscritos(): Promise<{ lista: Inscrito[]; sha: string }> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    { headers: CABECALHOS, cache: "no-store" }
  );
  if (res.status === 404) return { lista: [], sha: "" };
  if (!res.ok) throw new Error(`GitHub GET ${res.status}`);
  const dados = await res.json();
  const lista: Inscrito[] = JSON.parse(
    Buffer.from(dados.content, "base64").toString("utf-8")
  );
  return { lista, sha: dados.sha };
}

async function gravarInscritos(lista: Inscrito[], sha: string) {
  return fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
    method: "PUT",
    headers: { ...CABECALHOS, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "feat(newsletter): novo inscrito (visiteprado)",
      content: Buffer.from(JSON.stringify(lista, null, 2)).toString("base64"),
      sha: sha || undefined,
    }),
  });
}

export async function POST(req: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "Inscrições temporariamente indisponíveis." },
      { status: 503 }
    );
  }

  try {
    const corpo = await req.json();
    const email = String(corpo.email || "").trim().toLowerCase();
    const consentimento = corpo.consent === true;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }
    if (!consentimento) {
      return NextResponse.json(
        { error: "Consentimento obrigatório (LGPD)." },
        { status: 400 }
      );
    }

    // Retry para o caso de duas inscrições simultâneas (409 = sha desatualizado).
    for (let tentativa = 0; tentativa < 3; tentativa++) {
      const { lista, sha } = await lerInscritos();
      if (lista.some((i) => i.email === email)) {
        return NextResponse.json({ ok: true, message: "Já inscrito." });
      }
      lista.push({
        email,
        subscribedAt: new Date().toISOString(),
        origem: "visiteprado",
      });
      const res = await gravarInscritos(lista, sha);
      if (res.ok) return NextResponse.json({ ok: true });
      if (res.status !== 409) throw new Error(`GitHub PUT ${res.status}`);
    }
    throw new Error("conflitos consecutivos");
  } catch {
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}

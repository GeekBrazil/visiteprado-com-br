@AGENTS.md

# visiteprado.com.br — Contexto para o Agente

> **Portal de Ecoturismo, Experiências e Workshops Presenciais em Prado & Costa das Baleias (BA).**

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript, Lucide Icons |
| Estilo | Tailwind CSS 4, CSS-in-JS & keyframes customizados |
| Deploy | Vercel (Hobby) |

## Regras Críticas

- **Nunca** adicionar `Co-Authored-By: Claude` em commits — autoria exclusiva de Allan Candido.
- **Deploy = Git.** A Vercel builda o `origin/main` (integração GitHub). Padrão: `npm run build` → `git commit` → **`git push origin main`**.
- Identidade visual: Inspirada nas cores da Costa das Baleias (Azul oceano `#0284c7`, Turquesa mar `#14b8a6`, Dourado sol `#f59e0b` e fundo tropical escuro `#06121e`).

## O que está em Produção

- **Portal Principal (`src/app/page.tsx`)**:
  - Hero com imagens imersivas de Prado (BA), praias, falésias e observação de baleias-jubarte.
  - Vitrine de **Roteiros de Ecoturismo & Passeios**: Abrolhos, Observação de Baleias, Cumuruxatiba, Corumbau, Mergulho e Trilhas.
  - Seção dedicada a **Workshops & Capacitação Presencial**: Cursos práticos de Inteligência Artificial aplicada ao turismo, Gastronomia baiana contemporânea, Fotografia de destino e Marketing Digital para pousadas/restaurantes.
  - Modal interativo de **Inscrição em Workshops**: Cadastro de participantes para vagas limitadas com confirmação via WhatsApp.
  - Modal de **Reserva de Roteiro**: Solicitação de cotação e guia credenciado.
  - Seção de infraestrutura local, depoimentos e canal de contato direto.

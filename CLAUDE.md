@AGENTS.md

# visiteprado.com.br — Contexto para o Agente

> **Guia de destino de Prado e da Costa das Baleias (extremo sul da Bahia).**
> Turismo primeiro: praias, falésias, baleias. Vídeo é o meio principal.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript |
| Estilo | Tailwind CSS 4 + sistema próprio em `globals.css` |
| Tipografia | Fraunces (display, serifada) + Inter (corpo) via `next/font` |
| Deploy | Vercel (Hobby) |

## Regras Críticas

- **Nunca** adicionar `Co-Authored-By: Claude` em commits — autoria exclusiva de Allan Candido.
- **Deploy = Git.** A Vercel builda o `origin/main`. Padrão: `npm run build` → `git commit` → **`git push origin main`**.
- **Tema claro, sempre.** Nada de modo escuro nesta marca.
- **Sem estética de IA**: proibido gradiente roxo, glassmorphism, emoji em heading,
  sombra neon, escassez falsa ("3 vagas restantes") e preço inventado.
- **Nada de dado fabricado.** Sem preço, data ou vaga que não seja real. O que não
  for verificável vira conversa no WhatsApp.

## Identidade visual

Paleta tirada da paisagem real, não de template:

| Token | Hex | Uso |
|---|---|---|
| `areia` | `#fbf6ec` | fundo (papel quente) |
| `areia-2` / `areia-3` | `#f4ebdb` / `#e9dcc6` | faixas alternadas, bordas |
| `tinta` | `#16262b` | texto principal |
| `tinta-2` / `tinta-3` | `#3d5158` / `#6b8189` | corpo, legenda |
| `falesia` | `#c0562c` | acento primário (a cor real do paredão) |
| `mar` | `#0b6e6b` | acento secundário, foco |

Textura de grão sutil no `body::before` — é o que tira o ar de "flat template".

## Estrutura

```
src/
├── app/
│   ├── layout.tsx      fontes, metadata, OG, JSON-LD TouristDestination
│   ├── globals.css     sistema de design completo
│   └── page.tsx        composição das seções (server component)
├── components/
│   ├── Hero.tsx        2 modos: editorial (sem vídeo) e cinema (com vídeo)
│   ├── GaleriaVideos.tsx  fachada: miniatura -> player só no clique
│   ├── FormularioRoteiro.tsx  lead REAL via WhatsApp
│   └── Revelar.tsx     scroll-reveal, respeita prefers-reduced-motion
└── data/
    ├── midia.ts        *** VÍDEOS ficam aqui — único arquivo a editar ***
    └── prado.ts        destinos, experiências, FAQ, WhatsApp
```

## Vídeos (o ponto principal)

Tudo em `src/data/midia.ts`:

- `VIDEO_CAPA` — ID do YouTube. Preenchido, o hero vira cinematográfico com
  vídeo de fundo mudo em loop. `null` mantém o hero editorial.
- `VIDEOS[]` — galeria. Vazia, a seção inteira some do site e do menu.
  `vertical: true` para Reels/Shorts (9:16).

Embeds usam `youtube-nocookie.com`. Miniaturas passam pelo `next/image`
(host liberado em `next.config.ts`).

## Dados oficiais (Cadastur / MTur)

A seção "A rede formal de Prado" usa números reais da base federal, não estimativa.

```bash
python3 scripts/etl-cadastur.py              # atualiza src/data/oficial.json
python3 scripts/etl-cadastur.py --historico  # + série histórica (NÃO publicar, ver abaixo)
```

**Não publicar a série histórica como crescimento.** Ela mostra 22 (2024) → 26
(2025) → 37 (2026) estabelecimentos, mas isso mede **cadastros regulares**, não
capacidade real: reflete formalização e ciclo de renovação de certificado, não
pousadas novas. Por isso `oficial.json` é gerado sem ela por padrão.

Sem dependências: o script lê XLSX com a biblioteca padrão (é ZIP + XML).
A base do MTur é **trimestral** — rodar 1× por trimestre basta. Se a coleta
falhar, o JSON antigo é preservado (o script não sobrescreve com vazio).

**Regra inegociável — LGPD:** as planilhas de origem contêm CPF, nome completo,
telefone e e-mail dos cadastrados. O ETL extrai **apenas agregados** (contagens
e somas). Nunca publicar lista nominal de pousadas, guias ou agências a partir
dessa fonte — para diretório, é preciso convite e consentimento de cada
estabelecimento.

Números atuais (2º tri 2026): 37 meios de hospedagem regulares, 1.763 leitos,
615 UHs, 70 leitos acessíveis, 7 agências, 3 transportadoras, 3 guias.

### Fontes investigadas e descartadas

| Fonte | Situação |
|---|---|
| Tábua de marés (Marinha/CHM) | HTTP 403 a acesso automatizado. Caminho viável: pedir as **constantes harmônicas** ao CHM por e-mail e calcular a previsão localmente — oficial, gratuito e sem dependência de terceiro. |
| INMET (clima) | Conexão resetada pelo servidor. Não depender disso em produção. |
| ICMBio (visitação Abrolhos/Monte Pascoal) | Existe, mas em painel, sem API limpa. |
| Mapa do Turismo Brasileiro | Último recurso aberto é de 2019 — desatualizado. |

## Pendências

- [ ] Allan fornecer os IDs dos vídeos do YouTube/Instagram.
- [ ] Fotos reais de Prado (`~/Documents/Assets/fotos/` está vazio) — hoje o site
      se sustenta em tipografia e cor, sem foto de banco de imagem.
- [ ] Decidir se os workshops presenciais voltam como seção própria. Foram
      retirados por conterem preço, data e vaga fabricados.
- [ ] Confirmar o WhatsApp: `5524993326966` é DDD 24 (RJ) num site da Bahia.

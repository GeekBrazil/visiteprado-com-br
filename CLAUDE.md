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
│   ├── Hero.tsx        4 modos, nesta prioridade: scrub, camadas, cinema, editorial
│   ├── HeroCamadas.tsx foto em 3 planos com paralaxe (o "livro 3D")
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

## Hero em camadas (o "livro 3D")

`HERO_CAMADAS` em `src/data/midia.ts` liga o hero de três planos: céu, falésia
e banco de areia se movem em velocidades diferentes na rolagem, e a crista de
areia passa **na frente** do título, cortando o pé das letras.

Regras que o CSS assume (`.livro-*` em `globals.css`):

1. **`ceu`** — imagem opaca, sangra a tela inteira.
2. **`meio`** — PNG/WebP com alfa: só a falésia.
3. **`frente`** — PNG/WebP com alfa **cuja crista está na primeira linha de
   pixels**. O topo dessa camada encosta na linha `corte` (padrão 52%), e é
   isso que faz o recorte cair no mesmo ponto em qualquer proporção de tela.
   Se a crista estiver no meio do arquivo, o `object-fit: cover` desloca o
   corte e o título é engolido no celular.
4. **Texto não entra na profundidade.** Título e base andam em 2D puro; texto
   dentro de camada com `scale` em 3D é rasterizado e sai borrado.
5. **A animação de entrada não mexe em opacidade.** Aba oculta ou navegador
   que pause animações deixaria o hero em branco.

Camadas em produção: `public/hero/{ceu,falesia,banco}.webp` (~398 KB somadas).
Foram preparadas a partir de três imagens geradas (Gemini), guardadas em
`~/Documents/Assets/fotos/ hero/`:

```bash
# fundo: recorte que põe o horizonte a 34% da altura + remove a marca d'água
magick ceu-original.png -crop 2400x1142+0+394 +repage -resize 1920x -quality 72 public/hero/ceu.webp
# falésia: chroma key do cinza chapado (#808080) + limpeza da marca d'água
magick falesia-original.png -alpha off -fuzz 14% -transparent "#808080" \
  -region 200x170+2480+1205 -alpha transparent +region -resize 1920x -quality 82 public/hero/falesia.webp
# banco: corta na segunda crista (o gerador duplicou a faixa) -> crista na 1ª linha
magick banco-original.png -crop 2880x974+0+370 +repage -resize 1920x -quality 72 public/hero/banco.webp
```

**Ressalva registrada:** são imagens geradas, não fotos de Prado. Trocar por foto
real do lugar quando houver — a falésia da imagem não corresponde ao paredão real.

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
- [ ] Trocar as camadas do hero (hoje imagens geradas) por foto real de Prado:
      céu/mar, falésia recortada com alfa e banco de areia com a crista na
      primeira linha de pixels.
- [ ] Decidir se os workshops presenciais voltam como seção própria. Foram
      retirados por conterem preço, data e vaga fabricados.
- [ ] Confirmar o WhatsApp: `5524993326966` é DDD 24 (RJ) num site da Bahia.

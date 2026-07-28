/**
 * ============================================================
 *  VÍDEOS DE PRADO — ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR
 * ============================================================
 *
 * COMO ADICIONAR UM VÍDEO
 * -----------------------
 * Pegue o ID do YouTube: é o trecho depois de `v=` na URL.
 *
 *   https://www.youtube.com/watch?v=dQw4w9WgXcQ  ->  "dQw4w9WgXcQ"
 *   https://youtu.be/dQw4w9WgXcQ                 ->  "dQw4w9WgXcQ"
 *   https://www.youtube.com/shorts/dQw4w9WgXcQ   ->  "dQw4w9WgXcQ"  (marque vertical: true)
 *
 * O site se adapta sozinho:
 *   - Sem vídeo nenhum  -> hero editorial, seção de vídeos some.
 *   - Com VIDEO_CAPA    -> hero vira cinematográfico, vídeo de fundo.
 *   - Com VIDEOS        -> galeria aparece automaticamente.
 */

export interface VideoPrado {
  /** ID do YouTube (só o código, não a URL inteira). */
  id: string;
  /** Título curto que aparece sob o vídeo. */
  titulo: string;
  /** Onde foi gravado. Ex: "Cumuruxatiba" */
  local: string;
  /** Formato Reels/Shorts (9:16). Deixe de fora para vídeo normal (16:9). */
  vertical?: boolean;
}

/**
 * Vídeo de fundo do hero. Use uma tomada aérea, longa e sem cortes bruscos —
 * roda mudo, em loop, sem controles.
 *
 * Deixe `null` para manter o hero editorial (também bonito, e mais rápido).
 */
export const VIDEO_CAPA: string | null = null;

/**
 * Vídeo do hero controlado pelo scroll: a rolagem da página avança o vídeo,
 * quadro a quadro, como se você estivesse pedalando junto.
 *
 * PRECISA SER ARQUIVO LOCAL. Embed do YouTube não serve: cada `seekTo` dispara
 * requisição de rede, com centenas de ms de latência e sem precisão de quadro —
 * amarrado ao scroll, trava visivelmente. Com arquivo já carregado, mudar o
 * `currentTime` é instantâneo.
 *
 * COMO PREPARAR O ARQUIVO
 * -----------------------
 * 1. Baixe o vídeo original no YouTube Studio (Conteúdo -> ⋮ -> Fazer download).
 * 2. Corte o trecho e otimize. O `-g 1` é o segredo: transforma todo quadro em
 *    quadro-chave, que é o que permite buscar qualquer ponto sem engasgo.
 *    Sem isso o vídeo "pula" ao rolar.
 *
 *    ffmpeg -ss 00:01:30 -t 12 -i original.mp4 \
 *      -an -vf "scale=1280:-2,fps=25" \
 *      -c:v libx264 -crf 26 -preset slow -g 1 -pix_fmt yuv420p \
 *      -movflags +faststart public/video/pedalando-prado.mp4
 *
 *    -an remove o áudio (vídeo de scroll é sempre mudo)
 *    Alvo: 10 a 15 segundos, até ~6 MB. Mais que isso atrasa o primeiro paint.
 *
 * 3. Gere o pôster do primeiro quadro exibido:
 *    ffmpeg -ss 6 -i public/video/pedalando-prado.mp4 -frames:v 1 \
 *      public/video/pedalando-prado.jpg
 *
 * 4. Preencha a constante abaixo. Nulo, o hero volta ao formato editorial.
 */
export interface VideoScrub {
  /** Caminho a partir de /public. Ex.: "/video/pedalando-prado.mp4" */
  arquivo: string;
  /** Imagem exibida antes de o vídeo carregar e quando há movimento reduzido. */
  poster?: string;
  /** Onde o vídeo começa, em fração da duração. 0.5 = no meio. */
  inicio?: number;
  /** Texto alternativo para leitores de tela. */
  descricao?: string;
}

export const VIDEO_SCRUB: VideoScrub | null = null;

export const TEM_SCRUB = VIDEO_SCRUB !== null;

/**
 * Galeria de vídeos. Adicione quantos quiser.
 *
 * Exemplo preenchido:
 *
 *   export const VIDEOS: VideoPrado[] = [
 *     { id: "AbCdEf12345", titulo: "Falésias do amanhecer", local: "Praia do Farol" },
 *     { id: "GhIjKl67890", titulo: "Maré baixa na ponta", local: "Corumbau" },
 *     { id: "MnOpQr13579", titulo: "Cachoeira na areia", local: "Tororão", vertical: true },
 *   ];
 */
export const VIDEOS: VideoPrado[] = [];

/** Há vídeo suficiente para montar a galeria? */
export const TEM_GALERIA = VIDEOS.length > 0;

/** O hero deve rodar em modo cinematográfico? */
export const TEM_CAPA = VIDEO_CAPA !== null && VIDEO_CAPA !== "";

/**
 * Monta a URL de embed com privacidade reforçada (youtube-nocookie)
 * e sem vídeos relacionados de terceiros ao final.
 */
export function urlEmbed(
  id: string,
  opcoes: { fundo?: boolean } = {}
): string {
  const p = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });

  if (opcoes.fundo) {
    p.set("autoplay", "1");
    p.set("mute", "1");
    p.set("controls", "0");
    p.set("loop", "1");
    p.set("playlist", id);
    p.set("disablekb", "1");
  }

  return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`;
}

/** Miniatura oficial do YouTube — evita hospedar imagem no repositório. */
export function urlMiniatura(id: string): string {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

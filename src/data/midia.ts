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

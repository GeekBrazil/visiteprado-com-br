#!/usr/bin/env bash
# Prepara o vídeo do hero controlado por rolagem.
#
#   ./scripts/preparar-video-hero.sh ORIGEM INICIO [DURACAO]
#
#   ORIGEM   arquivo baixado do YouTube Studio
#   INICIO   onde começa o trecho (00:01:30 ou 90)
#   DURACAO  segundos a aproveitar (padrão 12)
#
# Exemplo:
#   ./scripts/preparar-video-hero.sh ~/Downloads/pedalando.mp4 00:02:15
#
# O QUE ELE FAZ E POR QUÊ
# -----------------------
# -g 1     todo quadro vira quadro-chave. É o que permite parar em qualquer
#          ponto ao rolar. Sem isso o navegador só consegue pousar nos
#          quadros-chave (a cada ~10s por padrão) e o vídeo PULA.
# -an      remove o áudio. Vídeo de scroll é sempre mudo.
# scale    1280px de largura basta para tela cheia; acima disso só pesa.
# faststart move o índice pro início, pro vídeo começar antes de baixar tudo.

set -euo pipefail

ORIGEM="${1:-}"
INICIO="${2:-}"
DURACAO="${3:-12}"

if [ -z "$ORIGEM" ] || [ -z "$INICIO" ]; then
  sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
  exit 1
fi

if [ ! -f "$ORIGEM" ]; then
  echo "Arquivo não encontrado: $ORIGEM" >&2
  exit 1
fi

# Aceita ffmpeg do sistema ou o binário do pacote npm ffmpeg-static.
if command -v ffmpeg >/dev/null 2>&1; then
  FFMPEG=ffmpeg
elif [ -x "node_modules/ffmpeg-static/ffmpeg" ]; then
  FFMPEG="node_modules/ffmpeg-static/ffmpeg"
else
  echo "ffmpeg não encontrado. Instale com:" >&2
  echo "   sudo apt install ffmpeg      (sistema)" >&2
  echo "   npm install -D ffmpeg-static (só neste projeto)" >&2
  exit 1
fi

DESTINO_DIR="public/video"
NOME="pedalando-prado"
MP4="$DESTINO_DIR/$NOME.mp4"
POSTER="$DESTINO_DIR/$NOME.jpg"

mkdir -p "$DESTINO_DIR"

echo "-> cortando ${DURACAO}s a partir de $INICIO"
"$FFMPEG" -y -loglevel error -ss "$INICIO" -t "$DURACAO" -i "$ORIGEM" \
  -an \
  -vf "scale=1280:-2,fps=25" \
  -c:v libx264 -crf 26 -preset slow -g 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$MP4"

echo "-> gerando pôster do quadro do meio"
"$FFMPEG" -y -loglevel error -ss "$(awk "BEGIN{print $DURACAO/2}")" -i "$MP4" \
  -frames:v 1 -q:v 3 "$POSTER"

TAM=$(du -h "$MP4" | cut -f1)
echo
echo "Pronto:"
echo "   $MP4     ($TAM)"
echo "   $POSTER"
echo
echo "Agora ligue em src/data/midia.ts:"
cat <<EOF

export const VIDEO_SCRUB: VideoScrub | null = {
  arquivo: "/video/$NOME.mp4",
  poster: "/video/$NOME.jpg",
  inicio: 0,
  descricao: "Pedalando pela praia de Prado, com as falésias coloridas ao fundo",
};
EOF
echo
if [ "${TAM%M}" != "$TAM" ] && [ "$(echo "$TAM" | tr -d 'M')" -gt 8 ] 2>/dev/null; then
  echo "AVISO: acima de 8 MB atrasa o primeiro paint. Reduza a duração"
  echo "       ou aumente o -crf (27, 28) para comprimir mais."
fi

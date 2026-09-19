#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$DIR")"

echo "==> [1/3] Enviando alterações para origin main..."
git -C "$ROOT_DIR" push origin main

echo "==> [2/3] Fazendo deploy na Vercel (Produção)..."
cd "$ROOT_DIR"
npx -y vercel --prod --yes

echo "==> [3/3] Executando auditoria externa pós-deploy..."
bash "$DIR/verify-deploy.sh"

echo "✅ Deploy e validação de VisitePrado.com.br concluídos com 100% de sucesso!"

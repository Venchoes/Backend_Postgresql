#!/bin/bash

echo "🔍 Verificando estrutura do projeto..."

# Verificar arquivos essenciais
files=(
  "src/server.ts"
  "src/app.ts"
  "src/models/user.model.ts"
  "src/controllers/auth.controller.ts"
  "src/routes/auth.routes.ts"
  "src/middlewares/auth.middleware.ts"
  "src/services/auth.service.ts"
  "requests/requests.yaml"
  ".env.example"
  "tsconfig.json"
  "package.json"
)

missing=0
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (FALTANDO)"
    missing=$((missing + 1))
  fi
done

if [ $missing -eq 0 ]; then
  echo ""
  echo "✅ Estrutura do projeto OK!"
  echo ""
  echo "🔍 Verificando TypeScript..."
  npx tsc --noEmit
  
  if [ $? -eq 0 ]; then
    echo "✅ TypeScript OK - Sem erros de compilação!"
    echo ""
    echo "📋 Para rodar o projeto:"
    echo "  1. Configure o .env (copie de .env.example)"
    echo "  2. npm run dev"
    echo ""
    echo "📦 Para testar os endpoints:"
    echo "  - Importe requests/requests.yaml no Insomnia"
  else
    echo "❌ Erros de TypeScript encontrados"
    exit 1
  fi
else
  echo ""
  echo "❌ $missing arquivo(s) faltando"
  exit 1
fi

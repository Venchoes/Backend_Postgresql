#!/bin/bash
set -e

echo "🔧 Instalando dependências com --legacy-peer-deps..."
npm install --legacy-peer-deps

echo "🏗️  Compilando TypeScript..."
npm run build

echo "✅ Build concluído!"

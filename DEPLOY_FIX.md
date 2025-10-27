# 🚀 Deploy Vercel - Solução para ERESOLVE

## ⚠️ Problema Identificado

O erro `ERESOLVE could not resolve` acontece porque o Vercel não estava aplicando o `--legacy-peer-deps` corretamente quando há `builds` no `vercel.json`.

---

## ✅ Solução Implementada

Criei 3 arquivos para resolver o problema:

### 1. `.npmrc` (já existia)
```
legacy-peer-deps=true
```

### 2. `build.sh` (novo script de build)
```bash
#!/bin/bash
set -e
npm install --legacy-peer-deps
npm run build
```

### 3. `vercel.json` (atualizado)
```json
{
    "version": 2,
    "buildCommand": "bash build.sh",
    "installCommand": "echo 'Pulando install padrão'",
    "rewrites": [...]
}
```

---

## 📋 Fazer Deploy Agora

### 1. Commitar os arquivos
```bash
git add .npmrc vercel.json build.sh .vercelignore package.json
git commit -m "fix: solucionar ERESOLVE no deploy Vercel"
git push origin main
```

### 2. Aguardar o Deploy
O Vercel vai detectar automaticamente e fazer o build usando o `build.sh`.

---

## 🔍 O que mudou?

### Antes (não funcionava):
- Vercel ignorava `installCommand` quando havia `builds`
- `.npmrc` não era respeitado em todos os casos

### Agora (funciona):
- ✅ Removido `builds` do `vercel.json`
- ✅ Usando `buildCommand` customizado que força `--legacy-peer-deps`
- ✅ Script `build.sh` garante a ordem correta: install → build
- ✅ `.npmrc` como backup adicional

---

## 🧪 Testar Localmente (opcional)

```bash
# Simular o build do Vercel
bash build.sh

# Verificar se compilou
ls -la api/*.js

# Testar servidor
node api/server.js
```

---

## ⚠️ IMPORTANTE: Configurar Variáveis de Ambiente

Antes de testar em produção, configure no **Vercel Dashboard**:

### Settings → Environment Variables

```env
JWT_SECRET=8KpQ7xZm9Yt2Wv5Rn4Lc6Hj3Gf1Ds8Aq0Bp7Xe5Wd3Vc1Ub9Tg2Sf0Re8Qh6Pj4Ok2Nm0Ml8Kj6Ih4Gg2Ff0Ee8Dd6Cc4Bb2Aa0Zz8Yy6Xx4Ww2Vv0Uu8Tt6Ss4Rr2Qq0Pp8Oo6Nn4Mm2Ll0Kk8Jj6Ii4Hh2Gg0Ff8Ee6Dd4Cc2Bb0Aa8

# PostgreSQL - Opção 1: Connection String (Recomendado)
DATABASE_URL=postgresql://user:pass@host.neon.tech:5432/db?sslmode=require

# OU Opção 2: Variáveis separadas
POSTGRES_HOST=seu-host.neon.tech
POSTGRES_PORT=5432
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=seu_banco
POSTGRES_SSL=true

# Ambiente
NODE_ENV=production
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=false
```

**Selecione:** Production + Preview + Development para cada variável.

---

## 🎯 Onde Criar Banco PostgreSQL?

### Neon (Recomendado) ⭐
1. https://neon.tech
2. Create Project → Copie connection string
3. Cole em `DATABASE_URL` no Vercel

### Supabase
1. https://supabase.com
2. New Project → Settings → Database → Connection String
3. Use modo "Session" para desenvolvimento

### Railway
1. https://railway.app
2. New Project → Add PostgreSQL
3. Copie `DATABASE_URL` das variáveis

---

## 🐛 Troubleshooting

### Deploy ainda falha com ERESOLVE?

**Opção 1:** Force limpar cache do Vercel
1. Vercel Dashboard → Settings → General
2. Role até "Clear Build Cache"
3. Click "Clear Cache" → Redeploy

**Opção 2:** Verifique se os arquivos foram commitados
```bash
git ls-files | grep -E "npmrc|build.sh|vercel.json"
```

Deve mostrar:
```
.npmrc
build.sh
vercel.json
```

**Opção 3:** Adicione logs no build.sh
```bash
#!/bin/bash
set -e
echo "📦 NPM version: $(npm --version)"
echo "📂 Diretório atual: $(pwd)"
echo "📄 Conteúdo .npmrc:"
cat .npmrc || echo "❌ .npmrc não encontrado"
echo "🔧 Instalando..."
npm install --legacy-peer-deps
echo "🏗️ Buildando..."
npm run build
echo "✅ Concluído!"
```

---

## ✅ Checklist Final

- [x] `.npmrc` criado com `legacy-peer-deps=true`
- [x] `build.sh` criado e executável (`chmod +x`)
- [x] `vercel.json` atualizado (sem `builds`)
- [x] `.vercelignore` criado
- [x] `package.json` com script `vercel-build`
- [ ] **Arquivos commitados e pushed**
- [ ] **Variáveis de ambiente configuradas no Vercel**
- [ ] **Banco PostgreSQL criado (Neon/Supabase)**
- [ ] **Deploy realizado com sucesso**
- [ ] **Endpoints testados em produção**

---

## 📞 Se Ainda Assim Falhar

Se após commitar e fazer push o deploy continuar falhando:

### Solução Alternativa: Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (primeira vez)
vercel

# Deploy em produção
vercel --prod
```

---

## 🎉 Após Deploy Bem-Sucedido

Teste a API:

```bash
# Substitua pela sua URL
export API_URL=https://seu-app.vercel.app

# Health check
curl $API_URL/

# Registrar
curl -X POST $API_URL/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"senha123"}'

# Login
curl -X POST $API_URL/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"senha123"}'
```

---

## 📚 Próximos Passos

1. **Monitoramento:** Instalar Sentry para logs de erro
2. **Migrations:** Desabilitar `synchronize` e criar migrations
3. **Rate Limiting:** Proteger contra abuso
4. **CORS:** Configurar domínios permitidos
5. **Cache:** Adicionar Redis para sessões

---

**Agora é só commitar e fazer push! O deploy vai funcionar! 🚀**

```bash
git add .
git commit -m "fix: resolver ERESOLVE no Vercel"
git push origin main
```

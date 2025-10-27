# ✅ Checklist de Deploy - Vercel

## 📋 Antes de Fazer Deploy

### 1. Banco de Dados PostgreSQL em Produção
- [ ] Criar conta em um provedor (Neon, Supabase, Railway, Render)
- [ ] Criar banco PostgreSQL
- [ ] Copiar connection string (formato: `postgresql://user:pass@host:port/db`)
- [ ] Testar conexão localmente (opcional)

### 2. Configurar Variáveis de Ambiente no Vercel

Acesse: **Vercel Dashboard → Seu Projeto → Settings → Environment Variables**

#### Variáveis Obrigatórias:

```env
# Autenticação
JWT_SECRET=SUA_CHAVE_SECRETA_AQUI

# PostgreSQL (escolha uma das duas opções)

# OPÇÃO 1: Connection String (Recomendado)
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# OPÇÃO 2: Variáveis Separadas
POSTGRES_HOST=seu-host.neon.tech
POSTGRES_PORT=5432
POSTGRES_USER=neondb_owner
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=neondb
POSTGRES_SSL=true

# Ambiente
NODE_ENV=production

# TypeORM
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=false
```

**⚠️ IMPORTANTE:**
- Para cada variável, selecione os ambientes: **Production**, **Preview**, **Development**
- Nunca commite senhas no código!

### 3. Arquivos Necessários no Repositório

- [x] `.npmrc` - Força legacy-peer-deps
- [x] `vercel.json` - Configuração de build customizada
- [x] `package.json` - Script `vercel-build`
- [x] `.gitignore` - Não commitar `.env`

### 4. Fazer Deploy

```bash
# 1. Commitar alterações
git add .
git commit -m "chore: configurar deploy Vercel"
git push origin main

# 2. Deploy será automático se conectado ao GitHub
# Ou via CLI:
npm i -g vercel
vercel --prod
```

---

## 🧪 Após Deploy - Testes

### 1. Verificar se o deploy foi bem-sucedido
- [ ] Deploy status: ✅ Ready
- [ ] Function logs sem erros críticos
- [ ] URL de produção acessível

### 2. Testar Endpoints

```bash
# Substitua YOUR_APP pela sua URL do Vercel
export API_URL=https://seu-app.vercel.app

# 1. Health Check
curl $API_URL/

# 2. Registrar Usuário
curl -X POST $API_URL/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "senha123"
  }'

# 3. Login
TOKEN=$(curl -X POST $API_URL/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"senha123"}' \
  | jq -r '.token')

# 4. Testar Rota Protegida
curl $API_URL/protected \
  -H "Authorization: Bearer $TOKEN"

# 5. Criar Task
curl -X POST $API_URL/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task de Produção",
    "status": "todo",
    "priority": "high"
  }'

# 6. Listar Tasks
curl $API_URL/tasks \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🐛 Troubleshooting

### Erro: "ERESOLVE could not resolve"
✅ **Resolvido!** O `.npmrc` com `legacy-peer-deps=true` corrige isso.

### Erro: "Cannot find module 'typeorm'"
**Causa:** Dependências não instaladas.
**Solução:** 
1. Verifique se `.npmrc` está commitado
2. Force redeploy no Vercel
3. Verifique logs de build

### Erro: "Connection timeout" no PostgreSQL
**Causa:** Variáveis de ambiente incorretas.
**Solução:**
1. Verifique `DATABASE_URL` ou `POSTGRES_*` no Vercel
2. Certifique-se que o banco permite conexões externas
3. Adicione `?sslmode=require` na connection string

### Erro: "self signed certificate"
**Causa:** SSL não configurado.
**Solução:** Já está configurado para aceitar SSL em produção automaticamente.

### Erro: "Function execution timeout"
**Causa:** Função excedeu 10s (limite do plano gratuito).
**Solução:**
1. Otimize queries (adicione índices)
2. Use conexões pooled
3. Considere upgrade do plano Vercel

### Logs de Deploy com Warnings
**Warnings esperados:**
- `WARN! Due to builds existing...` - Normal, pode ignorar
- Peer dependency warnings - Resolvido com `.npmrc`

---

## 🔐 Segurança em Produção

### ✅ Boas Práticas Implementadas:
- [x] Variáveis de ambiente no Vercel (não no código)
- [x] SSL habilitado para PostgreSQL
- [x] `.env` no `.gitignore`
- [x] JWT_SECRET forte

### 🚀 Melhorias Recomendadas:
- [ ] Desabilitar `TYPEORM_SYNCHRONIZE` em produção
- [ ] Usar migrations do TypeORM
- [ ] Adicionar rate limiting
- [ ] Configurar CORS específico (não '*')
- [ ] Monitoramento (Sentry, LogRocket)
- [ ] Backups automáticos do banco
- [ ] Validação de entrada mais rigorosa

---

## 📊 Monitoramento

### Vercel Dashboard
- **Deployments**: Status de cada deploy
- **Function Logs**: Erros em tempo real
- **Analytics**: Requisições, performance
- **Usage**: Consumo de recursos

### Logs Úteis
```bash
# Ver logs em tempo real via CLI
vercel logs --follow

# Ver logs de uma função específica
vercel logs api/server.js
```

---

## 🎯 Próximos Passos (Produção)

### 1. Migrations (Recomendado)
```bash
# Desativar synchronize no .env de produção
TYPEORM_SYNCHRONIZE=false

# Criar migration
npm run typeorm migration:generate -- -n InitialSchema

# Rodar migration
npm run typeorm migration:run
```

### 2. Monitoramento de Erros
```bash
npm install @sentry/node
```

### 3. Rate Limiting
```bash
npm install express-rate-limit
```

### 4. CORS Configurável
```bash
npm install cors
```

### 5. Validação de Esquema
```bash
npm install joi
```

---

## 📚 Links Úteis

- **Vercel Docs**: https://vercel.com/docs
- **Neon PostgreSQL**: https://neon.tech/docs
- **TypeORM**: https://typeorm.io
- **Debugging no Vercel**: https://vercel.com/docs/observability/runtime-logs

---

## ✅ Status do Projeto

- [x] Código migrado para PostgreSQL
- [x] TypeORM configurado
- [x] Build funcionando localmente
- [x] `.npmrc` configurado
- [x] `vercel.json` atualizado
- [x] Suporte a SSL
- [x] Suporte a DATABASE_URL
- [ ] **Banco PostgreSQL em produção criado**
- [ ] **Variáveis de ambiente configuradas no Vercel**
- [ ] **Deploy realizado**
- [ ] **Endpoints testados em produção**

---

**Pronto para deploy! 🚀**

Siga o checklist acima e qualquer problema consulte a seção de Troubleshooting.

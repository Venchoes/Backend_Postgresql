# 🚀 Deploy no Vercel - Backend PostgreSQL

## ⚠️ Requisitos Importantes

### 1. Banco de Dados PostgreSQL em Produção

O Vercel é **serverless** e não suporta bancos de dados com estado persistente localmente. Você **precisa de um PostgreSQL externo**:

#### Opções Recomendadas (Grátis):

- **[Neon](https://neon.tech)** ⭐ (Recomendado)
  - Tier grátis generoso
  - PostgreSQL serverless
  - Ótima integração com Vercel
  
- **[Supabase](https://supabase.com)**
  - PostgreSQL + API REST + Auth
  - 500 MB grátis
  
- **[Railway](https://railway.app)**
  - $5 crédito inicial
  - Deploy fácil

- **[Render PostgreSQL](https://render.com)**
  - 90 dias grátis

---

## 📋 Passo a Passo para Deploy

### 1️⃣ Criar Banco PostgreSQL na Nuvem

#### Exemplo com Neon:

1. Acesse [https://neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Clique em **Create Project**
4. Copie a **connection string** (formato: `postgresql://user:pass@host/db`)

Exemplo:
```
postgresql://neondb_owner:npg_abc123@ep-cool-cloud-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

### 2️⃣ Configurar Variáveis de Ambiente no Vercel

No painel do Vercel:

1. Vá em **Settings** → **Environment Variables**
2. Adicione as seguintes variáveis:

```env
# JWT
JWT_SECRET=8KpQ7xZm9Yt2Wv5Rn4Lc6Hj3Gf1Ds8Aq0Bp7Xe5Wd3Vc1Ub9Tg2Sf0Re8Qh6Pj4Ok2Nm0Ml8Kj6Ih4Gg2Ff0Ee8Dd6Cc4Bb2Aa0Zz8Yy6Xx4Ww2Vv0Uu8Tt6Ss4Rr2Qq0Pp8Oo6Nn4Mm2Ll0Kk8Jj6Ii4Hh2Gg0Ff8Ee6Dd4Cc2Bb0Aa8

# PostgreSQL (use a connection string da Neon/Supabase)
POSTGRES_HOST=ep-cool-cloud-123456.us-east-1.aws.neon.tech
POSTGRES_PORT=5432
POSTGRES_USER=neondb_owner
POSTGRES_PASSWORD=npg_abc123xyz
POSTGRES_DB=neondb

# OU use DATABASE_URL (mais simples)
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Ambiente
NODE_ENV=production
PORT=3000

# TypeORM
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=false
```

⚠️ **Importante:** 
- Use `TYPEORM_SYNCHRONIZE=true` **apenas em dev/staging**
- Em produção, use **migrations** (mais seguro)

---

### 3️⃣ Atualizar Conexão para Usar DATABASE_URL

O código já está preparado, mas se precisar ajustar manualmente:

```typescript
// api/database/connection.database.ts
export const getDataSource = (): DataSource => {
  if (!AppDataSource) {
    // Se DATABASE_URL existir, use-a (mais simples para Vercel)
    const databaseUrl = process.env.DATABASE_URL;
    
    if (databaseUrl) {
      AppDataSource = new DataSource({
        type: 'postgres',
        url: databaseUrl,
        ssl: { rejectUnauthorized: false }, // Necessário para Neon/Supabase
        synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
        logging: false,
        entities: [User, Task],
      });
    } else {
      // Fallback para variáveis separadas
      AppDataSource = new DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT || 5432),
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DB || 'appdb',
        ssl: process.env.POSTGRES_SSL === 'true' 
          ? { rejectUnauthorized: false } 
          : false,
        synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
        logging: false,
        entities: [User, Task],
      });
    }
  }
  return AppDataSource;
};
```

---

### 4️⃣ Fazer Deploy

```bash
# Commitar as alterações
git add .
git commit -m "fix: configurar deploy Vercel com PostgreSQL"
git push origin main
```

O Vercel vai detectar automaticamente e fazer o deploy.

---

### 5️⃣ Testar o Deploy

Após o deploy concluir, você receberá uma URL tipo:
```
https://backend-postgresql-abc123.vercel.app
```

Teste os endpoints:

```bash
# Testar health check
curl https://SEU_APP.vercel.app/

# Registrar usuário
curl -X POST https://SEU_APP.vercel.app/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"senha123"}'

# Login
curl -X POST https://SEU_APP.vercel.app/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"senha123"}'
```

---

## 🐛 Problemas Comuns

### ❌ Erro: "ERESOLVE could not resolve"

**Solução:** Já corrigido! Agora usamos `.npmrc` com `legacy-peer-deps=true`

---

### ❌ Erro: "Connection timeout" ou "ECONNREFUSED"

**Causa:** Variáveis de ambiente do PostgreSQL não configuradas.

**Solução:**
1. Verifique se as variáveis estão corretas no Vercel
2. Certifique-se que o banco está acessível publicamente
3. Verifique se a connection string inclui `?sslmode=require`

---

### ❌ Erro: "self signed certificate"

**Causa:** SSL do banco não está configurado.

**Solução:** Adicione no `connection.database.ts`:
```typescript
ssl: { rejectUnauthorized: false }
```

---

### ❌ Erro: "Function timeout after 10 seconds"

**Causa:** Vercel tem limite de 10s para execução de funções (plano gratuito).

**Soluções:**
- Otimize queries pesadas
- Use índices no banco
- Considere fazer upgrade do plano Vercel
- Use caching (Redis)

---

### ❌ Erro: "Module not found: typeorm"

**Causa:** Dependências não foram instaladas corretamente.

**Solução:** 
- Certifique-se que `.npmrc` existe no repo
- Verifique se `vercel-build` está no `package.json`
- Force um redeploy no Vercel

---

## 📌 Arquivos Alterados

✅ **`.npmrc`** (novo) - Força `legacy-peer-deps`  
✅ **`vercel.json`** - Comando de build customizado  
✅ **`package.json`** - Script `vercel-build`  

---

## 🎯 Checklist Pré-Deploy

- [ ] PostgreSQL em produção criado (Neon/Supabase/Railway)
- [ ] Connection string copiada
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] `.npmrc` commitado no repositório
- [ ] `vercel.json` atualizado
- [ ] Git push feito
- [ ] Deploy concluído com sucesso
- [ ] Endpoints testados na URL de produção

---

## 🔐 Segurança

### Variáveis que NUNCA devem estar no código:

❌ `JWT_SECRET`  
❌ `POSTGRES_PASSWORD`  
❌ `DATABASE_URL`  

✅ Use **Environment Variables** do Vercel  
✅ Nunca commite arquivos `.env` no Git  
✅ Use `.env.example` como template (sem valores reais)  

---

## 🚀 Próximos Passos (Produção)

1. **Desativar `synchronize`** e criar migrations:
   ```typescript
   synchronize: false
   ```

2. **Criar script de migration:**
   ```bash
   npm run typeorm migration:generate -- -n InitialSchema
   npm run typeorm migration:run
   ```

3. **Adicionar monitoramento:**
   - [Sentry](https://sentry.io) para erros
   - [LogRocket](https://logrocket.com) para logs
   - Vercel Analytics

4. **Configurar rate limiting:**
   ```bash
   npm install express-rate-limit
   ```

5. **Adicionar CORS configurável:**
   ```bash
   npm install cors
   ```

6. **Configurar CI/CD:**
   - Testes automáticos antes do deploy
   - Preview deployments para PRs

---

## 📚 Recursos Úteis

- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [TypeORM Migrations](https://typeorm.io/migrations)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don't_Do_This)

---

**Pronto! Agora seu backend está pronto para deploy no Vercel! 🎉**

Se encontrar problemas, verifique os logs do Vercel em **Deployments → [seu deploy] → Function Logs**.

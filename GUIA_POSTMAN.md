# 🚀 Guia Rápido - Testando a API no Postman

## ⚠️ Problema: Erro 401 (Não Autorizado)

O erro 401 acontece quando você tenta acessar rotas protegidas **sem enviar o token JWT** ou com um **token inválido/expirado**.

---

## ✅ Como Resolver - Passo a Passo

### 1️⃣ Certifique-se que o servidor está rodando

```bash
npm run dev
```

Deve aparecer:
```
[SERVER] ✅ Servidor rodando em http://localhost:3000
[DATABASE] ✅ Conexão estabelecida com PostgreSQL
```

### 2️⃣ Registrar um Novo Usuário

**POST** `http://localhost:3000/register`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta esperada (201 Created):**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

---

### 3️⃣ Fazer Login e Obter o Token JWT

**POST** `http://localhost:3000/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta esperada (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImpvYW9AZXhhbXBsZS5jb20iLCJpYXQiOjE3MzAwNzA1NjUsImV4cCI6MTczMDA3NDE2NX0.xyz..."
}
```

**⚠️ IMPORTANTE:** Copie o valor do campo `"token"` (sem as aspas). Você vai precisar dele nas próximas requisições!

---

### 4️⃣ Configurar Autenticação no Postman

#### Opção A: Usando a aba "Authorization" (Recomendado)

1. Clique na aba **Authorization**
2. Em **Type**, selecione **Bearer Token**
3. Cole o token que você copiou no campo **Token**
4. Pronto! O Postman vai enviar automaticamente o header `Authorization: Bearer SEU_TOKEN`

#### Opção B: Adicionando manualmente nos Headers

1. Vá na aba **Headers**
2. Adicione uma nova linha:
   - **Key:** `Authorization`
   - **Value:** `Bearer SEU_TOKEN_AQUI`
   
   ⚠️ **Não esqueça da palavra "Bearer " antes do token!**

---

### 5️⃣ Testar Rota Protegida

**GET** `http://localhost:3000/protected`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta esperada (200 OK):**
```json
{
  "message": "Acesso autorizado"
}
```

Se você ver **401 Unauthorized**, verifique:
- ✅ Você colocou `Bearer ` antes do token?
- ✅ O token está correto (sem espaços extras)?
- ✅ O token não expirou? (validade: 1 hora)

---

### 6️⃣ Criar uma Task (CRUD Protegido)

**POST** `http://localhost:3000/tasks`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "title": "Estudar PostgreSQL",
  "description": "Aprender TypeORM",
  "status": "todo",
  "priority": "high",
  "dueDate": "2025-12-31T23:59:59.000Z"
}
```

**Resposta esperada (201 Created):**
```json
{
  "id": 1,
  "title": "Estudar PostgreSQL",
  "description": "Aprender TypeORM",
  "status": "todo",
  "priority": "high",
  "dueDate": "2025-12-31T23:59:59.000Z",
  "createdAt": "2025-10-27T01:09:58.157Z",
  "updatedAt": "2025-10-27T01:09:58.157Z",
  "user": {
    "id": 1
  }
}
```

---

### 7️⃣ Listar Todas as Tasks

**GET** `http://localhost:3000/tasks`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta esperada (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Estudar PostgreSQL",
    "description": "Aprender TypeORM",
    "status": "todo",
    "priority": "high",
    "dueDate": "2025-12-31T23:59:59.000Z",
    "createdAt": "2025-10-27T01:09:58.157Z",
    "updatedAt": "2025-10-27T01:09:58.157Z"
  }
]
```

---

### 8️⃣ Atualizar uma Task (PATCH)

**PATCH** `http://localhost:3000/tasks/1`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "status": "in-progress"
}
```

---

### 9️⃣ Deletar uma Task

**DELETE** `http://localhost:3000/tasks/1`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta esperada:** 204 No Content (corpo vazio)

---

## 🔐 Dicas Importantes

### Token Expirado?
- O token JWT expira em **1 hora**.
- Se você receber **401** depois de um tempo, faça login novamente e pegue um novo token.

### Configurar Variável de Ambiente no Postman (Avançado)
1. Clique no ícone de **olho** no canto superior direito
2. Clique em **Add** e crie uma variável chamada `token`
3. Após fazer login, clique com botão direito na resposta → **Set: Postman Collection → token**
4. Use `{{token}}` nas requisições

---

## 📌 Endpoints Disponíveis

### Públicos (sem token)
- `GET /` - Status da API
- `POST /register` - Registrar usuário
- `POST /login` - Fazer login

### Protegidos (requer token)
- `GET /protected` - Testar autenticação
- `POST /tasks` - Criar task
- `GET /tasks` - Listar tasks
- `GET /tasks/:id` - Detalhes de uma task
- `PUT /tasks/:id` - Atualizar task (completo)
- `PATCH /tasks/:id` - Atualizar task (parcial)
- `DELETE /tasks/:id` - Deletar task

---

## 🐛 Troubleshooting

### Erro: "Token não fornecido"
- Verifique se o header `Authorization` está sendo enviado.

### Erro: "Token inválido"
- O token pode estar mal formatado ou o JWT_SECRET mudou.
- Faça login novamente e pegue um token novo.

### Erro: "Connection refused" ao acessar localhost:3000
- O servidor não está rodando. Execute `npm run dev`.

### Erro 422: "Título é obrigatório"
- Verifique se você está enviando todos os campos obrigatórios no body.
- Para criar task: `title` é obrigatório.

---

## 🎯 Exemplo Completo de Fluxo

```bash
# 1. Registrar
POST /register
Body: {"name":"João","email":"joao@test.com","password":"senha123"}

# 2. Login
POST /login
Body: {"email":"joao@test.com","password":"senha123"}
→ Copie o token da resposta

# 3. Criar Task
POST /tasks
Headers: Authorization: Bearer SEU_TOKEN
Body: {"title":"Minha task","status":"todo","priority":"high"}

# 4. Listar Tasks
GET /tasks
Headers: Authorization: Bearer SEU_TOKEN
```

---

## 🌐 Portas em Uso

- **API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:5050 (ou 8081 dependendo do seu docker-compose)

---

## ✅ Checklist Rápido

- [ ] Servidor rodando (`npm run dev`)
- [ ] Postgres rodando (verifique com `docker ps`)
- [ ] Arquivo `.env` existe na raiz do projeto
- [ ] JWT_SECRET configurado no `.env`
- [ ] Fez login e copiou o token
- [ ] Token incluído no header `Authorization: Bearer TOKEN`
- [ ] Token não expirou (validade: 1 hora)

---

**Pronto! Agora você já pode testar todos os endpoints no Postman sem erro 401! 🚀**

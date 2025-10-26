# Backend_PostgreSQL

#video do youtube (parte 1): https://www.youtube.com/watch?v=8roSmcjYvPM

#video do youtube (parte 2): https://www.youtube.com/watch?v=j15WMb6vSec

Backend completo em Node.js (TypeScript) + Express + PostgreSQL com autenticação JWT, seguindo arquitetura de camadas. Nesta versão, foi adicionada a funcionalidade completa de CRUD de Task-List protegida por JWT.

## 📋 Funcionalidades

### Rotas Públicas
- **POST /register** - Cadastro de usuário com validações (nome, e-mail, senha)
- **POST /login** - Autenticação e geração de token JWT

### Rotas Protegidas
- **GET /protected** - Acesso autorizado apenas com token JWT válido

### Task-List (CRUD protegido)
- **POST /tasks** - Cria uma tarefa
- **GET /tasks** - Lista todas as tarefas do usuário autenticado (filtros opcionais)
  - Filtros: `status=todo|in-progress|done`, `priority=low|medium|high`, `title=<substring>`, `dueDateFrom=<ISO>`, `dueDateTo=<ISO>`
- **GET /tasks/:id** - Detalhes de uma tarefa
- **PUT /tasks/:id** - Atualiza totalmente uma tarefa
- **PATCH /tasks/:id** - Atualiza parcialmente uma tarefa
- **DELETE /tasks/:id** - Remove uma tarefa

## 🏗️ Arquitetura

```
api/
├── controllers/    # Lógica de requisição/resposta
├── services/       # Regras de negócio
├── models/         # Entidades do PostgreSQL (TypeORM)
├── routes/         # Definição de rotas
├── middlewares/    # Auth, validação, error handling
├── database/       # Conexão com PostgreSQL (TypeORM)
├── utils/          # Logs, JWT, exceções
├── types/          # Interfaces TypeScript
└── config/         # Configurações de ambiente
```

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js v14+
- PostgreSQL 16+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Venchoes/Backend_MongoDB.git
cd Backend_MongoDB/Backend_MongoDB

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais
```

### Configuração do .env

```env
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=appdb
JWT_SECRET=sua_chave_secreta_super_segura
NODE_ENV=development
```

### Subir PostgreSQL local (via Docker Compose)

```bash
docker compose up -d
```

O PostgreSQL ficará disponível em `postgres://postgres:postgres@localhost:5432/appdb`.

### Executar

```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm start
```

A API estará disponível em `http://localhost:3000`

## 📦 Testando os Endpoints

### Importar no Insomnia/Postman

1. Abra o Insomnia
2. Application → Preferences → Data → Import Data
3. Selecione o arquivo `requests/requests.yaml`
4. Ajuste a variável `baseUrl` no ambiente (ex.: http://localhost:3000) e defina `token` após o login

### Exemplos de Requisição

**Cadastro**
```bash
POST /register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "password": "SenhaSegura123!"
}
```

**Login**
```bash
POST /login
Content-Type: application/json

{
  "email": "joao.silva@example.com",
  "password": "SenhaSegura123!"
}
```

**Acesso Protegido**
```bash
GET /protected
Authorization: Bearer <seu_token_jwt>
```

## 📝 Status HTTP e Respostas

### Cadastro (/register)
- ✅ **201** - Usuário criado com sucesso
- ❌ **409** - E-mail já existente
- ❌ **422** - Dados inválidos (nome, e-mail ou senha)

### Login (/login)
- ✅ **200** - Login bem-sucedido (retorna token)
- ❌ **400** - Requisição mal formatada
- ❌ **401** - Senha incorreta
- ❌ **404** - Usuário não encontrado

### Rota Protegida (/protected)
- ✅ **200** - Acesso autorizado
- ❌ **401** - Token não fornecido ou inválido

### Tasks (/tasks)
- ✅ **201** - Criado com sucesso (POST)
- ✅ **200** - Sucesso (GET/PUT/PATCH)
- ✅ **204** - Removido com sucesso (DELETE)
- ❌ **400/422** - Dados inválidos (ex.: título muito curto)
- ❌ **401** - Token ausente ou inválido
- ❌ **403** - Acesso negado a recurso de outro usuário
- ❌ **404** - Task não encontrada

## 🔒 Segurança

- Senhas hashadas com `bcrypt` (salt rounds: 10)
- Tokens JWT com expiração de 1 hora
- Validação de e-mail e senha (tamanho mínimo, formato)
- Middleware de autenticação para rotas protegidas
- Error handling centralizado

## 🛠️ Tecnologias

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **MongoDB** + **Mongoose** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **winston** - Logging
- **express-validator** - Validação de entrada

## 📊 Logs

Logs são salvos em:
- `combined.log` - Todos os logs
- `error.log` - Apenas erros
- Console - Logs em tempo real (desenvolvimento)

## 🌐 Deploy

### MongoDB Atlas (Produção)
1. Crie um cluster no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Obtenha a connection string
3. Atualize `MONGODB_URI_ATLAS` no ambiente de produção (ou use `MONGODB_DUAL_SYNC=true` + `MONGODB_URI_LOCAL`)

### Vercel/Render
Configure as variáveis de ambiente no painel da plataforma:
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`

## 📄 Licença

ISC

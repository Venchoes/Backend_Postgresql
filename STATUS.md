# ✅ Backend MongoDB - Status do Projeto

## 📊 Checklist da Atividade

### ✅ Estrutura de Projeto (10%)
- [x] Pastas: middlewares/, routes/, controllers/, services/, models/, database/
- [x] Arquivos nomeados semanticamente (ex: auth.controller.ts, user.service.ts)
- [x] Arquitetura de camadas implementada corretamente

### ✅ Cadastro de Usuário - POST /register (15%)
- [x] Validação de nome (mínimo 3 caracteres)
- [x] Validação de e-mail (formato válido)
- [x] Validação de senha (mínimo 6 caracteres)
- [x] Senha transformada em hash (bcrypt)
- [x] Usuário salvo corretamente no MongoDB
- [x] Respostas adequadas:
  - HTTP 201: Usuário criado com sucesso
  - HTTP 422: E-mail inválido, senha inválida, nome inválido
  - HTTP 409: E-mail já existente

### ✅ Login de Usuário - POST /login (15%)
- [x] Validação de e-mail (formato válido)
- [x] Validação de senha (não nula)
- [x] Senha comparada com hash do banco
- [x] Usuário buscado no MongoDB
- [x] Token JWT gerado e retornado
- [x] Respostas adequadas:
  - HTTP 200: Login bem-sucedido (retorna token)
  - HTTP 400: Requisição mal formatada
  - HTTP 401: Senha incorreta
  - HTTP 404: Usuário não encontrado

### ✅ Proteção da Rota - GET /protected (5%)
- [x] Rota protegida com middleware de autenticação
- [x] Aceita apenas requisições com token JWT válido
- [x] Retorna 401 se token não fornecido ou inválido
- [x] Retorna 200 com mensagem "Acesso autorizado"

### ✅ Variáveis de Ambiente (5%)
- [x] Arquivo .env.example criado
- [x] Uso de dotenv para carregar variáveis
- [x] Variáveis críticas:
  - JWT_SECRET
  - MONGODB_URI
  - PORT
  - NODE_ENV

### ✅ Arquivos de Requisição (5%)
- [x] Pasta requests/ criada
- [x] Arquivo requests.yaml no formato Insomnia v4
- [x] Cenários implementados:
  - ✅ Cadastro bem-sucedido
  - ✅ Cadastro com erro (e-mail repetido)
  - ✅ Cadastro com erro (senha inválida)
  - ✅ Cadastro com erro (e-mail inválido)
  - ✅ Cadastro com erro (requisição mal formatada)
  - ✅ Login bem-sucedido
  - ✅ Login com erro (senha inválida)
  - ✅ Login com erro (e-mail inválido)
  - ✅ Login com erro (requisição mal formatada)
  - ✅ Acesso /protected com token válido
  - ✅ Acesso /protected sem token
  - ✅ Acesso /protected com token inválido

### ✅ Implementação de Logs (5%)
- [x] Logger configurado (winston)
- [x] Logs em pontos críticos:
  - [x] Conexão com banco de dados
  - [x] Início do servidor
  - [x] Registro de usuário
  - [x] Login de usuário
  - [x] Autenticação (token válido/inválido)
  - [x] Acesso a rotas protegidas
  - [x] Erros (500+)

### ⏳ Hospedagem Funcional (10%)
- [ ] Deploy em plataforma cloud (Vercel/Render)
- [ ] MongoDB Atlas configurado
- [ ] Variáveis de ambiente configuradas em produção
- **Nota:** Este item será feito após o código estar completo

### ⏳ Vídeo Demonstrativo (20%)
- [ ] Requisições no Insomnia (todos os cenários)
- [ ] Interface do banco de dados (local e produção)
- [ ] Demonstração endpoints locais e produção
- [ ] Tela e rosto visíveis simultaneamente
- **Nota:** Gravar após hospedagem estar funcional

### ✅ Qualidade Geral do Código (10%)
- [x] TypeScript configurado corretamente
- [x] Sem erros de compilação
- [x] Código limpo e organizado
- [x] Seguindo boas práticas (DRY, SOLID)
- [x] Tipagem adequada
- [x] Error handling centralizado
- [x] Validações robustas

## 🔧 Configuração do Projeto

### Não gera pasta dist/
O projeto foi configurado para **rodar TypeScript diretamente** usando `ts-node` e `ts-node-dev`.

**Por quê?**
- Desenvolvimento mais rápido (sem necessidade de compilar)
- Código-fonte permanece em TypeScript
- Auto-reload com ts-node-dev
- Produção pode usar ts-node ou build se necessário

### Scripts Disponíveis

```bash
npm start       # Inicia em produção (ts-node)
npm run dev     # Inicia em desenvolvimento (ts-node-dev com auto-reload)
npm test        # Roda testes (se configurado)
```

### Estrutura de Pastas

```
Backend_MongoDB/
├── src/
│   ├── app.ts                    # Configuração do Express
│   ├── server.ts                 # Inicialização do servidor
│   ├── controllers/              # Requisições HTTP
│   │   ├── auth.controller.ts
│   │   └── protected.controller.ts
│   ├── services/                 # Lógica de negócio
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── models/                   # Schemas Mongoose
│   │   └── user.model.ts
│   ├── routes/                   # Definição de rotas
│   │   ├── auth.routes.ts
│   │   └── protected.routes.ts
│   ├── middlewares/              # Middlewares Express
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   └── validation.middleware.ts
│   ├── database/                 # Conexão MongoDB
│   │   └── connection.database.ts
│   ├── utils/                    # Utilitários
│   │   ├── exceptions.util.ts
│   │   ├── jwt.util.ts
│   │   └── logger.util.ts
│   ├── types/                    # Tipos TypeScript
│   │   └── index.ts
│   └── config/                   # Configurações
│       └── env.config.ts
├── requests/
│   └── requests.yaml             # Requisições Insomnia
├── .env.example                  # Exemplo de variáveis
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── check-setup.sh               # Script de verificação

```

## 🚀 Próximos Passos

### 1. Hospedagem (Obrigatória)

**MongoDB Atlas:**
1. Criar conta em https://www.mongodb.com/cloud/atlas
2. Criar cluster gratuito
3. Obter connection string
4. Adicionar IP do servidor à whitelist

**Vercel (Recomendado para Node.js):**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variáveis de ambiente no dashboard
# - MONGODB_URI
# - JWT_SECRET
# - NODE_ENV=production
```

**Render (Alternativa):**
1. Criar conta em https://render.com
2. New → Web Service
3. Conectar repositório GitHub
4. Configurar variáveis de ambiente
5. Deploy automático

### 2. Vídeo Demonstrativo (Obrigatório)

**Checklist do vídeo:**
- [ ] Mostrar todas as requisições do requests.yaml funcionando
- [ ] Mostrar banco de dados local com usuários cadastrados
- [ ] Mostrar banco de dados produção (Atlas) com usuários
- [ ] Testar endpoints locais (localhost:3000)
- [ ] Testar endpoints em produção (seu-dominio.vercel.app)
- [ ] Tela + rosto visíveis ao mesmo tempo (usar Clipchamp)
- [ ] Duração máxima: 2 minutos

**Sugestão de roteiro (2 min):**
- 0:00-0:15: Apresentação e overview do projeto
- 0:15-0:45: Demonstração local (register, login, protected)
- 0:45-1:00: Mostrar MongoDB local
- 1:00-1:30: Demonstração produção (mesmos endpoints)
- 1:30-1:45: Mostrar MongoDB Atlas
- 1:45-2:00: Conclusão

### 3. Melhorias Opcionais (Pontos Extras)

- [ ] Adicionar testes unitários (Jest + Supertest)
- [ ] Implementar refresh tokens
- [ ] Adicionar rate limiting
- [ ] Documentação Swagger/OpenAPI
- [ ] CI/CD com GitHub Actions
- [ ] Validações adicionais de senha (caracteres especiais, números)
- [ ] Endpoint de logout
- [ ] Reset de senha por e-mail

## 📝 Notas Importantes

### Segurança
- ✅ Senhas nunca são retornadas nas respostas
- ✅ JWT_SECRET deve ser forte em produção
- ✅ MONGODB_URI não está commitado no repositório
- ✅ Validações impedem SQL injection e XSS básico

### Boas Práticas Implementadas
- ✅ Separação de concerns (controllers, services, models)
- ✅ Error handling centralizado
- ✅ Validação de entrada em múltiplas camadas
- ✅ Logs estruturados
- ✅ Tipagem forte com TypeScript
- ✅ Variáveis de ambiente para configuração

### Pontos de Atenção
- O MongoDB deve estar rodando antes de iniciar o servidor
- O .env deve ser configurado antes do primeiro run
- Para produção, usar JWT_SECRET forte (64+ caracteres aleatórios)
- Não commitar o arquivo .env (já está no .gitignore)

## 🎯 Estimativa de Nota

Com base no barema fornecido:

| Critério | Peso | Status | Estimativa |
|----------|------|--------|------------|
| Estrutura de projeto | 10% | ✅ Completo | 10/10 |
| Cadastro (/register) | 15% | ✅ Completo | 15/15 |
| Login (/login) | 15% | ✅ Completo | 15/15 |
| Proteção /protected | 5% | ✅ Completo | 5/5 |
| Variáveis ambiente | 5% | ✅ Completo | 5/5 |
| Arquivos requests/ | 5% | ✅ Completo | 5/5 |
| Logs | 5% | ✅ Completo | 5/5 |
| Hospedagem | 10% | ⏳ Pendente | 0/10 |
| Vídeo | 20% | ⏳ Pendente | 0/20 |
| Qualidade código | 10% | ✅ Completo | 10/10 |

**Total Atual:** 70/100  
**Com hospedagem e vídeo:** 100/100

## ✅ Projeto Pronto para Hospedagem e Vídeo!

Todos os requisitos técnicos foram implementados. Agora basta:
1. Hospedar no Vercel/Render + MongoDB Atlas
2. Gravar o vídeo demonstrativo
3. Submeter o link do repositório + link da aplicação + vídeo

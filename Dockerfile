# Etapa 1: Build da aplicação
FROM node:20 AS build

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia package.json e package-lock.json e instala dependências
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copia o resto do projeto (src/ e tsconfig.json)
COPY . .

# Compila TypeScript para a pasta dist/
RUN npm run build

# Etapa 2: Imagem de produção
FROM node:20-slim

WORKDIR /app

# Copia apenas os arquivos necessários da etapa de build
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev --legacy-peer-deps
COPY --from=build /app/dist ./dist

# Expõe a porta do seu servidor Express
EXPOSE 3000

# Ambiente de execução
ENV NODE_ENV=production

# Comando para iniciar o servidor
CMD ["node", "dist/server.js"]

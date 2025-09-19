# Dockerfile para Backend Node.js/TypeScript
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apk add --no-cache git

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Instalar ts-node-dev globalmente para desenvolvimento
RUN npm install -g ts-node-dev nodemon

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Comando para desenvolvimento com hot reload
CMD ["npm", "run", "dev"]


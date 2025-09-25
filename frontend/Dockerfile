FROM node:20-bullseye-slim

WORKDIR /app

# Copiar package.json + package-lock.json e instalar dependências + ngrok global
COPY package*.json ./
RUN npm install --no-audit --no-fund \
    && npm install -g @expo/ngrok@latest

# Copiar todo o projeto
COPY . .

# Expor portas padrão do Expo
EXPOSE 19000 19001 19002

CMD ["npm", "start"]

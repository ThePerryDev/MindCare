# Dockerfile para Frontend React Native + Expo
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache git bash

# Instalar Expo CLI globalmente
RUN npm install -g @expo/cli

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Expor portas do Expo
EXPOSE 8081 19000 19001 19002

# Definir variáveis de ambiente para Expo
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# Comando para iniciar o Expo em modo desenvolvimento
CMD ["npx", "expo", "start", "--tunnel"]


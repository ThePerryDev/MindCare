## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão LTS recomendada)
- npm (geralmente vem com o Node.js)
- [Expo Go](https://expo.dev/client) instalado no dispositivo móvel (para testes)
- [Docker](https://www.docker.com/) e Docker Compose (opcional, para executar via container)

## 🚀 Instalação

Clone o repositório e instale as dependências:

```bash
npm install
```

## 💻 Executando o Projeto

### Modo Development (Local)

Inicie o servidor de desenvolvimento do Expo:

```bash
npm start
```

Este comando abre o Expo DevTools no navegador, onde você pode escolher como executar o app.

### Executar em Plataformas Específicas

**Android:**
```bash
npm run android
```

**iOS (somente em macOS):**
```bash
npm run ios
```

**Web:**
```bash
npm run web
```

## 🐳 Executando com Docker

> ⚠️ **Nota:** O hot reload do Expo dentro do container ainda não está funcionando completamente. Esta é uma limitação conhecida que está sendo trabalhada.

### Build da imagem Docker:

```bash
docker-compose build
```

### Iniciar o container:

```bash
docker-compose up
```

Ou em modo detached (segundo plano):

```bash
docker-compose up -d
```

### Parar o container:

```bash
docker-compose down
```

## 🔍 Ferramentas de Qualidade de Código

### ESLint

Verificar problemas e erros no código:

```bash
npm run lint
```

### Prettier

**Formatar automaticamente todos os arquivos:**
```bash
npm run format
```

**Verificar formatação sem modificar arquivos:**
```bash
npm run format:check
```

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o Expo em modo tunnel |
| `npm run android` | Executa no emulador/dispositivo Android |
| `npm run ios` | Executa no simulador/dispositivo iOS |
| `npm run web` | Executa no navegador web |
| `npm run lint` | Verifica problemas no código com ESLint |
| `npm run format` | Formata código com Prettier |
| `npm run format:check` | Verifica formatação sem modificar |

## 🔧 Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Docker](https://www.docker.com/)

## 📝 Status do Projeto

Este projeto está em **fase inicial de desenvolvimento**. Funcionalidades atuais:

✅ Configuração base do React Native + Expo  
✅ TypeScript configurado  
✅ ESLint e Prettier para qualidade de código  
✅ Docker configurado (build e execução)  
⚠️ Hot reload no Docker (em desenvolvimento)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
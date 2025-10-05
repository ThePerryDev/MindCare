# MindCare - Ambiente de Desenvolvimento com Docker

Este projeto utiliza Docker e Docker Compose para criar um ambiente de desenvolvimento consistente e isolado, além de um pipeline de CI/CD automatizado no GitHub Actions.

## 🏗️ Arquitetura do Projeto

```
MindCare/
├── backend/                 # API Node.js/TypeScript
├── frontend/               # App React Native + Expo
├── .devcontainer/          # Configuração GitHub Codespaces
├── .github/workflows/      # Pipeline CI/CD
├── docker-compose.yml      # Ambiente de desenvolvimento
└── docker-compose.test.yml # Ambiente de testes
```

## 🚀 Início Rápido

### Pré-requisitos

- Docker Desktop
- Docker Compose
- Git

### Configuração Local

1. **Clone o repositório:**
   ```bash
   git clone <seu-repositorio>
   cd mindcare-project
   ```

2. **Inicie os serviços:**
   ```bash
   # Todos os serviços
   docker-compose up

   # Ou serviços específicos
   docker-compose up backend
   docker-compose up frontend
   ```

3. **Acesse os serviços:**
   - Backend API: http://localhost:3000
   - Frontend Expo: http://localhost:19000
   - MongoDB: localhost:27017

## 🐳 Containers Disponíveis

### Backend (Node.js/TypeScript)
- **Porta:** 3000
- **Hot Reload:** Habilitado com ts-node-dev
- **Banco:** MongoDB (container separado)

### Frontend (React Native + Expo)
- **Portas:** 8081 (Metro), 19000-19002 (Expo)
- **Hot Reload:** Habilitado
- **Modo:** Tunnel para acesso externo

### MongoDB
- **Porta:** 27017
- **Usuário:** admin
- **Senha:** password123
- **Database:** mindcare

## 🧪 Executando Testes

### Localmente
```bash
# Executar todos os testes
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Apenas backend
docker-compose -f docker-compose.test.yml up backend-test

# Apenas frontend
docker-compose -f docker-compose.test.yml up frontend-test
```

### Cobertura de Testes
```bash
# Gerar relatório de cobertura
docker-compose -f docker-compose.test.yml exec backend-test npm run test:coverage
docker-compose -f docker-compose.test.yml exec frontend-test npm run test:coverage
```

## 🔍 Linting e Formatação

### ESLint
```bash
# Backend
cd backend && npx eslint . --ext .ts

# Frontend
cd frontend && npx eslint . --ext .ts,.tsx,.js,.jsx
```

### Prettier
```bash
# Verificar formatação
npx prettier --check .

# Corrigir formatação
npx prettier --write .
```

## 🌐 GitHub Codespaces

Este projeto está configurado para funcionar perfeitamente no GitHub Codespaces:

1. **Abra no Codespaces:**
   - Vá para seu repositório no GitHub
   - Clique em "Code" > "Codespaces" > "Create codespace"

2. **Ambiente automático:**
   - Containers são iniciados automaticamente
   - Extensões do VS Code são instaladas
   - Portas são expostas automaticamente

## 🔄 Pipeline CI/CD

O pipeline é executado automaticamente em:
- Push para `main` ou `develop`
- Pull Requests para `main` ou `develop`

### Etapas do Pipeline

1. **Build:** Construção das imagens Docker
2. **Testes:** Execução de testes unitários
3. **Cobertura:** Geração de relatórios de cobertura
4. **Linting:** Verificação de qualidade do código
5. **Formatação:** Verificação de padronização
6. **Segurança:** Auditoria de vulnerabilidades

### Artefatos Gerados

- Relatórios de cobertura (30 dias)
- Relatórios ESLint (30 dias)
- Imagens Docker de produção (7 dias)

## 📁 Estrutura de Arquivos

### Configurações Docker
- `backend/Dockerfile` - Container de desenvolvimento do backend
- `frontend/Dockerfile` - Container de desenvolvimento do frontend
- `backend/Dockerfile.test` - Container de testes do backend
- `frontend/Dockerfile.test` - Container de testes do frontend

### Configurações de Qualidade
- `.eslintrc.js` - Regras de linting
- `.prettierrc` - Regras de formatação
- `jest.config.js` - Configuração de testes

### CI/CD
- `.github/workflows/ci.yml` - Pipeline principal
- `docker-compose.test.yml` - Ambiente de testes

## 🛠️ Comandos Úteis

### Docker
```bash
# Reconstruir containers
docker-compose build --no-cache

# Ver logs
docker-compose logs -f [service]

# Executar comandos nos containers
docker-compose exec backend bash
docker-compose exec frontend sh

# Limpar volumes
docker-compose down -v
```

### Desenvolvimento
```bash
# Instalar dependências
docker-compose exec backend npm install
docker-compose exec frontend npm install

# Executar migrações (quando implementadas)
docker-compose exec backend npm run migrate

# Seed do banco (quando implementado)
docker-compose exec backend npm run seed
```

## 🔧 Troubleshooting

### Container não inicia
1. Verifique se as portas não estão em uso
2. Reconstrua as imagens: `docker-compose build --no-cache`
3. Limpe volumes: `docker-compose down -v`

### Expo não conecta
1. Verifique se está usando modo tunnel: `--tunnel`
2. Confirme se as portas estão expostas corretamente
3. Use o IP correto no aplicativo Expo Go

### Testes falham
1. Verifique se o MongoDB de teste está funcionando
2. Confirme se as dependências de teste estão instaladas
3. Execute `docker-compose -f docker-compose.test.yml build --no-cache`

## 📚 Próximos Passos

1. **Implementar testes:** Adicionar testes unitários e de integração
2. **Configurar banco:** Implementar migrações e seeds
3. **Deploy:** Configurar deploy automático para staging/produção
4. **Monitoramento:** Adicionar logs e métricas
5. **Documentação:** Expandir documentação da API

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

O pipeline de CI/CD irá executar automaticamente todos os testes e verificações.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
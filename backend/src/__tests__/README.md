# 🧪 Testes Backend - MindCare

Suite de testes automatizados completa para validação do backend.

## 🎯 Status Atual

```
✅ 130 testes passando
✅ 9 suítes de teste
✅ 100% Statements
✅ 100% Functions
✅ 100% Lines
✅ 97.26% Branches
⏱️ Tempo: ~32 segundos
```

## 🚀 Execução dos Testes

```bash
npm test                    # Executa todos os testes
npm run test:coverage       # Gera relatório de cobertura
npm run test:watch          # Modo watch para desenvolvimento
```

## 📁 Estrutura dos Testes

```
src/__tests__/
├── controllers/           # API Controllers (44 testes)
│   ├── auth.controller.test.ts      # Autenticação (17 testes)
│   └── user.controller.test.ts      # CRUD usuários (27 testes)
├── security/              # Middleware de segurança (7 testes)
├── routes/                # Integração de rotas (13 testes)
├── app/                   # Configuração da aplicação (17 testes)
├── database/              # Conexão com banco de dados
├── models/                # Validações do modelo User
└── server/                # Configuração do servidor
```

## 📊 Cobertura de Código Alcançada

| Arquivo                | Statements | Branches | Functions | Lines |
| ---------------------- | ---------- | -------- | --------- | ----- |
| **app.ts**             | 100%       | 100%     | 100%      | 100%  |
| **auth.controller.ts** | 100%       | 93.1%    | 100%      | 100%  |
| **user.controller.ts** | 100%       | 100%     | 100%      | 100%  |
| **auth.middleware.ts** | 100%       | 100%     | 100%      | 100%  |
| **connection.ts**      | 100%       | 100%     | 100%      | 100%  |
| **user.model.ts**      | 100%       | 100%     | 100%      | 100%  |
| **Todas as rotas**     | 100%       | 100%     | 100%      | 100%  |

## 🧪 Funcionalidades Testadas

### 🔐 Autenticação (17 testes)

- **Registro**: Validação de dados, senhas, email único
- **Login**: Credenciais, geração de JWT
- **Refresh Token**: Renovação automática de tokens
- **Logout**: Invalidação de cookies
- **Validações**: Campos obrigatórios, formato de dados

### 👥 CRUD Usuários (27 testes)

- **Criação**: Validação de dados, hash de senhas
- **Listagem**: Busca geral e por ID
- **Atualização**: Dados pessoais e senhas
- **Remoção**: Soft e hard delete
- **Métricas**: Altura, peso, data nascimento
- **Projeções**: Campos específicos via query params

### 🔒 Segurança (7 testes)

- **JWT Middleware**: Validação de tokens
- **Autorização**: Headers e cookies
- **Error Handling**: Tokens inválidos/expirados

### 🛣️ Rotas e App (30 testes)

- **Estrutura API**: `/api/v1/*` endpoints
- **CORS**: Política de origens permitidas
- **Middlewares**: JSON parser, cookies
- **Health Check**: Status da aplicação

### 🗄️ Database e Model (49 testes)

- **Conexão**: MongoDB lifecycle
- **Schema**: Validações do modelo User
- **Transformações**: JSON output limpo

## ⚙️ Configuração Técnica

### Arquivos Principais

- **`jest.config.js`** - Configuração do Jest com TypeScript
- **`jest.setup.ts`** - Setup de mocks e variáveis de ambiente

### Mocks Implementados

- **MongoDB/Mongoose**: Simulação sem banco real
- **bcrypt**: Hash e comparação de senhas
- **JWT**: Geração e validação de tokens
- **Variáveis de ambiente**: Configuração automática para testes

## 🎯 Resultados Finais

### Cobertura de Código

```
File                 | % Stmts | % Branch | % Funcs | % Lines
---------------------|---------|----------|---------|--------
All files            |   100%  |   97.26% |   100%  |   100%
 controllers/        |   100%  |   96.87% |   100%  |   100%
 routes/             |   100%  |   100%   |   100%  |   100%
 security/           |   100%  |   100%   |   100%  |   100%
 models/             |   100%  |   100%   |   100%  |   100%
```

### Performance

- **Testes**: 130 passando (100% sucesso)
- **Suítes**: 9 completas
- **Tempo**: ~32 segundos

## 🛠️ Comandos de Desenvolvimento

```bash
# Execução dos testes
npm test                    # Todos os testes
npm run test:coverage       # Com relatório de cobertura
npm run test:watch          # Modo watch para desenvolvimento

# Execução específica
npm test auth.controller    # Apenas testes de autenticação
npm test user.controller    # Apenas testes de usuário
npm test -- --verbose      # Saída detalhada
```

## � Status do Projeto

### ✅ Conquistado

- 100% Statement, Function e Line Coverage
- 97.26% Branch Coverage
- Todos os endpoints validados
- Error handling completo
- Validações de dados robustas

### 🎯 Qualidade Garantida

O backend está **completamente validado** com cobertura de testes e todas as funcionalidades críticas testadas.

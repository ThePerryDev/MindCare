# Testes do Backend - MindCare

Este diretório contém os testes automatizados para o backend da aplicação MindCare.

## Estrutura dos Testes

```
src/__tests__/
├── controllers/
│   ├── auth.controller.test.ts    # Testes do controlador de autenticação
│   ├── user.controller.test.ts    # Testes do controlador de usuários
└── utils/
    └── test-helpers.utils.ts      # Utilitários para testes
```

## Controladores Testados

### Auth Controller (`auth.controller.test.ts`)

Testa os endpoints de autenticação:

- **POST /register** - Registro de novos usuários

  - ✅ Registro com dados válidos
  - ✅ Validação de campos obrigatórios
  - ✅ Validação de confirmação de senha
  - ✅ Verificação de email duplicado
  - ✅ Tratamento de erros do servidor

- **POST /login** - Login de usuários

  - ✅ Login com credenciais válidas
  - ✅ Validação de campos obrigatórios
  - ✅ Verificação de usuário inexistente
  - ✅ Verificação de senha incorreta
  - ✅ Tratamento de erros do servidor

- **POST /refresh** - Renovação de tokens

  - ✅ Renovação com token válido
  - ✅ Verificação de token ausente
  - ✅ Verificação de usuário inexistente
  - ✅ Verificação de token inválido

- **POST /logout** - Logout de usuários
  - ✅ Logout com sucesso

### User Controller (`user.controller.test.ts`)

Testa os endpoints de gerenciamento de usuários:

- **POST /users** - Criação de usuários

  - ✅ Criação com dados válidos
  - ✅ Validação de confirmação de senha
  - ✅ Verificação de email duplicado
  - ✅ Tratamento de erros de validação
  - ✅ Tratamento de erros do servidor

- **GET /users/:id** - Busca de usuário por ID

  - ✅ Busca com ID válido
  - ✅ Busca com campos específicos
  - ✅ Verificação de usuário inexistente
  - ✅ Tratamento de erros do servidor

- **GET /users** - Listagem de usuários

  - ✅ Listagem com usuários existentes
  - ✅ Listagem vazia

- **DELETE /users/:id** - Remoção de usuários

  - ✅ Remoção com sucesso
  - ✅ Verificação de usuário inexistente

- **PUT /users/:id** - Atualização completa de usuários

  - ✅ Atualização com dados válidos
  - ✅ Atualização de senha
  - ✅ Validação de confirmação de senha
  - ✅ Verificação de usuário inexistente
  - ✅ Verificação de email duplicado

- **PATCH /users/:id/metrics** - Atualização de métricas
  - ✅ Atualização com dados válidos
  - ✅ Atualização parcial
  - ✅ Verificação de usuário inexistente
  - ✅ Validação de tipos de dados
  - ✅ Tratamento de erros do servidor

## Como Executar os Testes

### Scripts de Conveniência Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (re-executa automaticamente quando arquivos mudam)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar apenas testes dos controladores
npm run test:controllers

# Executar apenas testes de autenticação
npm run test:auth

# Executar apenas testes de usuários
npm run test:user
```

### Comandos Diretos (Alternativos)

```bash
# Apenas testes de autenticação (método alternativo)
npm test auth.controller.test.ts

# Apenas testes de usuários (método alternativo)
npm test user.controller.test.ts

# Executar com cobertura (método alternativo)
npm test -- --coverage

# Executar em modo watch (método alternativo)
npm test -- --watch

# Executar apenas controladores (método alternativo)
npm test -- --testPathPattern=controllers
```

## Configuração dos Testes

Os testes são configurados através dos seguintes arquivos:

- **jest.config.js** - Configuração principal do Jest
- **jest.setup.ts** - Setup global dos testes (variáveis de ambiente, conexão DB)

### Configurações Importantes do Jest

- **testPathIgnorePatterns**: Ignora arquivos utilitários (`test-helpers.utils.ts`)
- **testTimeout**: 10 segundos por teste
- **testEnvironment**: Node.js
- **preset**: ts-jest para TypeScript

### Variáveis de Ambiente para Testes

As seguintes variáveis são configuradas automaticamente no `jest.setup.ts`:

```typescript
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.ACCESS_TOKEN_TTL = '15m';
process.env.REFRESH_TOKEN_TTL = '7d';
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/mindcare-test';
```

## Mocks Utilizados

### UserModel Mock

Os testes utilizam mocks do Mongoose para simular operações de banco de dados:

```typescript
jest.mock('../../models/user.model');
const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
```

### Bcrypt e JWT

Os testes fazem mock das funções de criptografia e geração de tokens conforme necessário.

## Utilitários de Teste

O arquivo `test-helpers.utils.ts` contém:

- **validUserData** - Dados válidos para criação de usuários
- **invalidUserData** - Dados inválidos para testes de validação
- **createMockUser()** - Função para criar mocks de usuários
- **createValidTokens()** - Função para criar tokens JWT válidos
- **createHashedPassword()** - Função para criar senhas hasheadas
- **createAuthHeaders()** - Função para criar headers de autenticação

## Considerações Importantes

1. **Banco de Dados**: Os testes usam mocks do Mongoose, não um banco real
2. **Isolamento**: Cada teste é isolado e não afeta outros testes
3. **Cleanup**: Os mocks são limpos entre cada teste usando `beforeEach()`
4. **Timeouts**: Configurado para 10 segundos por teste
5. **Cobertura**: Meta de 70% de cobertura configurada no Jest
6. **Scripts Convenientes**: Use os scripts `npm run test:*` para execução mais rápida e específica
7. **Arquivos Utilitários**: `test-helpers.utils.ts` é ignorado pelo Jest (não é executado como teste)

## Troubleshooting

### Problema: "MongoDB não disponível"

- Os testes usam mocks, então não precisam de MongoDB real
- A mensagem é apenas um aviso do setup

### Problema: Testes lentos

- Execute testes específicos em vez de toda a suíte
- Use `--maxWorkers=1` se houver problemas de concorrência

### Problema: Timeouts

- Aumente o timeout no `jest.config.js` se necessário
- Verifique se não há vazamentos de memória

## Métricas de Cobertura

Meta atual configurada:

- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

### Para visualizar a cobertura:

```bash
# Usando script de conveniência (recomendado)
npm run test:coverage

# Método alternativo
npm test -- --coverage
```

### Cobertura Atual dos Controladores:

- **Auth Controller**: ~100% statements, ~79% branches
- **User Controller**: ~92% statements, ~80% branches

O relatório será gerado na pasta `coverage/` com visualização HTML detalhada.

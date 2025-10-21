# Testes Backend - MindCare

Suite de testes automatizados cobrindo **87 testes** com **~70% de cobertura**.

## 🚀 Execução Rápida

```bash
npm test                    # Todos os testes
npm run test:coverage       # Com relatório de cobertura
npm run test:controllers    # Apenas controladores
npm run test:auth          # Apenas autenticação
npm run test:user          # Apenas usuários
```

## 📁 Estrutura

```
src/__tests__/
├── app/                   # Testes da aplicação (CORS, middlewares)
├── controllers/           # Testes dos controladores (auth, user)
├── security/             # Testes do middleware de autenticação
├── routes/               # Testes de integração das rotas
├── models/               # Testes de validações do modelo
└── utils/                # Utilitários para testes
```

## 📊 Cobertura por Componente

| Componente      | Testes | Cobertura | Status |
| --------------- | ------ | --------- | ------ |
| **Controllers** | 39     | 96%       | ✅     |
| **Security**    | 7      | 100%      | ✅     |
| **Routes**      | 13     | 100%      | ✅     |
| **App**         | 15     | 95%       | ✅     |
| **Models**      | 13     | 39%       | ⚠️     |

## 🧪 Endpoints Testados

### Autenticação (`/api/v1/auth`)

- ✅ `POST /register` - Cadastro de usuários
- ✅ `POST /login` - Login de usuários
- ✅ `POST /refresh` - Renovação de tokens
- ✅ `POST /logout` - Logout de usuários

### Usuários (`/api/v1/users`)

- ✅ `POST /users` - Criar usuário
- ✅ `GET /users` - Listar usuários
- ✅ `GET /users/:id` - Buscar por ID
- ✅ `PUT /users/:id` - Atualizar usuário
- ✅ `DELETE /users/:id` - Remover usuário
- ✅ `PATCH /users/:id/metrics` - Atualizar métricas

### Outras Validações

- ✅ Middleware de autenticação (`authGuard`)
- ✅ Configuração CORS e middlewares
- ✅ Validações de modelo (email, senha, telefone)
- ✅ Tratamento de erros e casos extremos

## ⚙️ Configuração

**Arquivos principais:**

- `jest.config.js` - Configuração do Jest
- `jest.setup.ts` - Setup global (variáveis de ambiente, mocks)

**Variáveis de ambiente configuradas automaticamente:**

- `JWT_SECRET` / `JWT_REFRESH_SECRET`
- `NODE_ENV=test`
- Timeouts e configurações de teste

**Características:**

- ✅ Mocks do Mongoose (sem banco real)
- ✅ Isolamento entre testes
- ✅ Cleanup automático
- ✅ Cobertura com threshold configurado

## 🎯 Resultados

**Métricas de Cobertura Atingidas:**

- **Statements**: 69.57%
- **Branches**: 70.58%
- **Lines**: 70.52%
- **Functions**: 47.16%

**Total**: 87 testes aprovados ✅

## 🔧 Troubleshooting

**Testes lentos?**  
→ Use `npm run test:controllers` para testar apenas o essencial

**Problemas de timeout?**  
→ Configure `testTimeout` no `jest.config.js`

**Erro "MongoDB não disponível"?**  
→ Normal, testes usam mocks (não precisam de banco real)

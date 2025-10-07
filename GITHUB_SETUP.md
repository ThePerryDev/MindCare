# Configuração do GitHub - MindCare

Este guia explica como configurar o repositório GitHub para funcionar com o pipeline de CI/CD e GitHub Codespaces.

## 🔧 Configuração do Repositório

### 1. Secrets do GitHub Actions

Configure os seguintes secrets no seu repositório:

**Caminho**: Settings → Secrets and variables → Actions → New repository secret

| Nome | Descrição | Exemplo |
|------|-----------|---------|
| `MONGODB_URI` | URI do MongoDB para testes | `mongodb://admin:password123@localhost:27017/mindcare_test` |
| `JWT_SECRET` | Chave secreta para JWT | `sua-chave-jwt-super-secreta` |
| `DOCKER_USERNAME` | Usuário Docker Hub (opcional) | `seu-usuario-docker` |
| `DOCKER_PASSWORD` | Senha Docker Hub (opcional) | `sua-senha-docker` |

### 2. Variáveis de Ambiente

Configure as seguintes variáveis:

**Caminho**: Settings → Secrets and variables → Actions → Variables

| Nome | Valor | Descrição |
|------|-------|-----------|
| `NODE_VERSION` | `18` | Versão do Node.js |
| `MONGODB_VERSION` | `6.0` | Versão do MongoDB |

## 🚀 Configuração do GitHub Codespaces

### 1. Habilitar Codespaces

1. Vá para **Settings** → **Codespaces**
2. Habilite **Codespaces** para o repositório
3. Configure as seguintes opções:

```json
{
  "timeout": 30,
  "retention": 7,
  "prebuild": true
}
```

### 2. Configurar Prebuilds (Opcional)

Para acelerar a inicialização do Codespace:

1. Vá para **Settings** → **Codespaces** → **Prebuilds**
2. Clique em **Set up prebuild**
3. Configure:
   - **Branch**: `main`
   - **Configuration file**: `.devcontainer/devcontainer.json`
   - **Trigger**: `On push` e `On configuration change`

## 🔄 Configuração do Pipeline CI/CD

### 1. Branch Protection Rules

Configure regras de proteção para a branch `main`:

**Caminho**: Settings → Branches → Add rule

```
Branch name pattern: main

☑️ Require a pull request before merging
  ☑️ Require approvals (1)
  ☑️ Dismiss stale reviews
  ☑️ Require review from code owners

☑️ Require status checks to pass before merging
  ☑️ Require branches to be up to date
  Status checks:
    - build-and-test
    - security-scan

☑️ Require conversation resolution before merging
☑️ Include administrators
```

### 2. Configurar CODEOWNERS

Crie o arquivo `.github/CODEOWNERS`:

```
# Global owners
* @seu-usuario @outro-mantenedor

# Backend specific
/backend/ @backend-team

# Frontend specific  
/frontend/ @frontend-team

# CI/CD and Docker
/.github/ @devops-team
/docker-compose*.yml @devops-team
/Dockerfile* @devops-team
```

### 3. Templates de Issues e PRs

#### Issue Template

Crie `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug Report
about: Criar um relatório de bug
title: '[BUG] '
labels: bug
assignees: ''
---

## 🐛 Descrição do Bug
Descrição clara e concisa do bug.

## 🔄 Passos para Reproduzir
1. Vá para '...'
2. Clique em '....'
3. Role para baixo até '....'
4. Veja o erro

## ✅ Comportamento Esperado
Descrição clara do que deveria acontecer.

## 📱 Ambiente
- OS: [ex: iOS 15.0]
- Browser: [ex: Chrome 95]
- Versão: [ex: 1.0.0]

## 📎 Screenshots
Se aplicável, adicione screenshots.
```

#### PR Template

Crie `.github/pull_request_template.md`:

```markdown
## 📝 Descrição
Breve descrição das mudanças.

## 🔧 Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## ✅ Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Pipeline de CI passa

## 🧪 Como Testar
Instruções para testar as mudanças.

## 📎 Screenshots (se aplicável)
```

## 🔐 Configuração de Segurança

### 1. Dependabot

Crie `.github/dependabot.yml`:

```yaml
version: 2
updates:
  # Backend dependencies
  - package-ecosystem: "npm"
    directory: "/backend"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5

  # Frontend dependencies
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5

  # Docker
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
```

### 2. CodeQL Analysis

Crie `.github/workflows/codeql.yml`:

```yaml
name: "CodeQL"

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1'

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write

    strategy:
      fail-fast: false
      matrix:
        language: [ 'javascript' ]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Initialize CodeQL
      uses: github/codeql-action/init@v2
      with:
        languages: ${{ matrix.language }}

    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2
```

## 📊 Configuração de Monitoramento

### 1. GitHub Insights

Configure as seguintes métricas:

- **Pulse**: Atividade do repositório
- **Contributors**: Contribuições por desenvolvedor
- **Traffic**: Visualizações e clones
- **Dependency graph**: Dependências e vulnerabilidades

### 2. Notifications

Configure notificações para:

- **Failed workflows**: Falhas no CI/CD
- **Security alerts**: Vulnerabilidades
- **Dependabot**: Atualizações de dependências

## 🎯 Configuração de Labels

Configure labels padrão para organização:

```
Type:
- bug (red)
- enhancement (blue)
- feature (green)
- documentation (yellow)

Priority:
- priority/high (red)
- priority/medium (orange)
- priority/low (green)

Status:
- status/in-progress (yellow)
- status/review (purple)
- status/blocked (red)

Component:
- backend (blue)
- frontend (green)
- database (orange)
- ci/cd (gray)
```

## 🚀 Deploy e Produção

### 1. Environments

Configure environments:

**Development**:
- Auto-deploy from `develop` branch
- Require reviewers: false

**Staging**:
- Auto-deploy from `main` branch
- Require reviewers: true (1 reviewer)

**Production**:
- Manual deploy only
- Require reviewers: true (2 reviewers)

### 2. Deployment Secrets

Para cada environment, configure:

```
MONGODB_URI_PROD
JWT_SECRET_PROD
API_URL_PROD
```

## ✅ Checklist de Configuração

- [ ] Secrets configurados
- [ ] Variáveis de ambiente definidas
- [ ] Branch protection rules ativas
- [ ] CODEOWNERS configurado
- [ ] Templates de issue/PR criados
- [ ] Dependabot configurado
- [ ] CodeQL habilitado
- [ ] Labels organizados
- [ ] Environments configurados
- [ ] Notifications ativas

---

**Nota**: Ajuste as configurações conforme as necessidades específicas do seu projeto e equipe.


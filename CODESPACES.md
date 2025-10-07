# Guia do GitHub Codespaces - MindCare

Este guia explica como configurar e usar o GitHub Codespaces para desenvolvimento do projeto MindCare.

## 🚀 Configuração Inicial

### 1. Criando um Codespace

1. Vá para o repositório do projeto no GitHub
2. Clique no botão **"Code"**
3. Selecione a aba **"Codespaces"**
4. Clique em **"Create codespace on main"**

O Codespace será criado automaticamente com todas as configurações necessárias.

### 2. Configuração Automática

Quando o Codespace iniciar, os seguintes processos acontecem automaticamente:

- ✅ Containers Docker são construídos
- ✅ Dependências são instaladas
- ✅ Extensões do VS Code são configuradas
- ✅ Portas são expostas automaticamente
- ✅ Ambiente de desenvolvimento está pronto

## 🐳 Serviços Disponíveis

### Portas Expostas Automaticamente

| Serviço | Porta | Descrição | Acesso |
|---------|-------|-----------|--------|
| Backend API | 3000 | API Node.js/TypeScript | Automático |
| Metro Bundler | 8081 | React Native bundler | Automático |
| Expo DevTools | 19000 | Interface do Expo | Browser |
| Expo | 19001-19002 | Serviços Expo | Automático |
| MongoDB | 27017 | Banco de dados | Interno |

### Acessando os Serviços

1. **Backend API**: Clique na notificação de porta ou vá para a aba "Ports"
2. **Expo DevTools**: Será aberto automaticamente no browser
3. **App Mobile**: Use o QR code no Expo DevTools com o app Expo Go

## 🛠️ Comandos Úteis no Codespace

### Terminal Integrado

O VS Code no Codespace já vem com terminal integrado. Use os seguintes comandos:

```bash
# Ver status dos containers
docker-compose ps

# Ver logs dos serviços
docker-compose logs -f backend
docker-compose logs -f frontend

# Reiniciar serviços
docker-compose restart backend
docker-compose restart frontend

# Executar comandos nos containers
docker-compose exec backend bash
docker-compose exec frontend sh
```

### Desenvolvimento

```bash
# Instalar nova dependência no backend
docker-compose exec backend npm install <pacote>

# Instalar nova dependência no frontend
docker-compose exec frontend npm install <pacote>

# Executar testes
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Executar linting
docker-compose exec frontend npx eslint .
docker-compose exec backend npx eslint .
```

## 📱 Testando o App Mobile

### Usando Expo Go

1. **Instale o Expo Go** no seu dispositivo móvel
2. **Acesse o Expo DevTools** (porta 19000)
3. **Escaneie o QR Code** com o app Expo Go
4. **O app será carregado** no seu dispositivo

### Usando Simulador Web

1. No Expo DevTools, clique em **"Run in web browser"**
2. O app será aberto em uma nova aba do browser
3. Ideal para desenvolvimento rápido de UI

## 🔧 Configurações Personalizadas

### Extensões do VS Code

As seguintes extensões são instaladas automaticamente:

- **TypeScript**: Suporte completo ao TypeScript
- **ESLint**: Linting em tempo real
- **Prettier**: Formatação automática
- **Docker**: Gerenciamento de containers
- **Expo Tools**: Ferramentas específicas do Expo
- **React Native Tools**: Debug e desenvolvimento RN

### Configurações do Editor

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🐛 Troubleshooting

### Container não inicia

```bash
# Reconstruir containers
docker-compose build --no-cache
docker-compose up --force-recreate
```

### Expo não conecta

1. Verifique se a porta 19000 está exposta
2. Use o modo tunnel se necessário:
   ```bash
   docker-compose exec frontend npx expo start --tunnel
   ```

### Problemas de Performance

1. **Feche abas desnecessárias** no browser
2. **Pare containers não utilizados**:
   ```bash
   docker-compose stop frontend  # Se só estiver trabalhando no backend
   ```
3. **Use o modo web** para desenvolvimento de UI

### Perdeu as alterações?

- **Commits são salvos** no Codespace
- **Faça push regularmente** para não perder trabalho
- **Codespaces são pausados** após inatividade, mas dados são preservados

## 💡 Dicas de Produtividade

### 1. Atalhos Úteis

- `Ctrl+Shift+P`: Command Palette
- `Ctrl+`` `: Abrir terminal
- `Ctrl+Shift+E`: Explorer de arquivos
- `F5`: Iniciar debug

### 2. Desenvolvimento Eficiente

- **Use Hot Reload**: Alterações aparecem instantaneamente
- **Debug no VS Code**: Breakpoints funcionam normalmente
- **Terminal múltiplo**: Abra vários terminais para diferentes tarefas

### 3. Colaboração

- **Live Share**: Compartilhe seu Codespace com outros desenvolvedores
- **Port forwarding**: Outros podem acessar seus serviços
- **Git integrado**: Commits e pushes direto no VS Code

## 🔄 Workflow Recomendado

### 1. Início do Dia
```bash
# Verificar status
docker-compose ps

# Iniciar serviços se necessário
docker-compose up -d

# Ver logs para verificar se tudo está funcionando
docker-compose logs
```

### 2. Durante o Desenvolvimento
```bash
# Fazer alterações no código
# Hot reload acontece automaticamente

# Executar testes quando necessário
docker-compose -f docker-compose.test.yml up backend-test

# Commit frequente
git add .
git commit -m "feat: nova funcionalidade"
git push
```

### 3. Final do Dia
```bash
# Commit final
git add .
git commit -m "wip: trabalho em progresso"
git push

# Opcional: parar containers para economizar recursos
docker-compose down
```

## 📊 Monitoramento

### Recursos do Codespace

- **CPU**: Monitore uso no terminal
- **Memória**: Containers consomem RAM
- **Storage**: Projetos ocupam espaço

### Logs dos Serviços

```bash
# Logs em tempo real
docker-compose logs -f

# Logs específicos
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

## 🎯 Próximos Passos

1. **Personalize** as configurações conforme sua preferência
2. **Explore** as extensões disponíveis
3. **Configure** atalhos personalizados
4. **Integre** com outras ferramentas de desenvolvimento

---

**Dica**: O Codespace é um ambiente completo de desenvolvimento. Tudo que você faria localmente, pode fazer aqui!


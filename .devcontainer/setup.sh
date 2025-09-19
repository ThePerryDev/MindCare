#!/bin/bash

echo "🚀 Configurando ambiente de desenvolvimento MindCare..."

# Instalar dependências globais
echo "📦 Instalando dependências globais..."
npm install -g @expo/cli typescript ts-node nodemon

# Configurar Git (se necessário)
echo "🔧 Configurando Git..."
git config --global init.defaultBranch main
git config --global pull.rebase false

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd /app/backend && npm install

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd /app/frontend && npm install

# Configurar hooks do Git
echo "🪝 Configurando Git hooks..."
cd /app
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🔍 Executando verificações pré-commit..."

# Executar ESLint no frontend
echo "Verificando código com ESLint..."
cd frontend && npx eslint . --ext .ts,.tsx,.js,.jsx

# Verificar formatação com Prettier
echo "Verificando formatação com Prettier..."
npx prettier --check .

echo "✅ Verificações pré-commit concluídas!"
EOF

chmod +x .git/hooks/pre-commit

echo "✅ Ambiente de desenvolvimento configurado com sucesso!"
echo "🎯 Para iniciar o desenvolvimento:"
echo "   - Backend: docker-compose up backend"
echo "   - Frontend: docker-compose up frontend"
echo "   - Todos os serviços: docker-compose up"


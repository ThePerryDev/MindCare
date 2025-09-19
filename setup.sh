#!/bin/bash

# Script de configuração inicial do projeto MindCare
# Execute: chmod +x setup.sh && ./setup.sh

set -e  # Parar em caso de erro

echo "🚀 Configurando projeto MindCare..."
echo "=================================="

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Por favor, instale o Docker primeiro."
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado. Por favor, instale o Docker Compose primeiro."
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker e Docker Compose encontrados"

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📄 Criando arquivo .env a partir do exemplo..."
    cp .env.example .env
    echo "✅ Arquivo .env criado. Ajuste as configurações conforme necessário."
else
    echo "✅ Arquivo .env já existe"
fi

# Criar arquivo .env para o backend se não existir
if [ ! -f backend/.env ]; then
    echo "📄 Criando arquivo .env para o backend..."
    cat > backend/.env << 'EOF'
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://admin:password123@mongodb:27017/mindcare?authSource=admin
JWT_SECRET=desenvolvimento-jwt-secret-nao-usar-em-producao
EOF
    echo "✅ Arquivo backend/.env criado"
else
    echo "✅ Arquivo backend/.env já existe"
fi

# Criar diretórios necessários
echo "📁 Criando diretórios necessários..."
mkdir -p logs
mkdir -p uploads
mkdir -p backend/src/__tests__
mkdir -p frontend/src/__tests__
mkdir -p mongodb-init

echo "✅ Diretórios criados"

# Criar script de inicialização do MongoDB
if [ ! -f mongodb-init/init.js ]; then
    echo "📄 Criando script de inicialização do MongoDB..."
    cat > mongodb-init/init.js << 'EOF'
// Script de inicialização do MongoDB
db = db.getSiblingDB('mindcare');

// Criar usuário para a aplicação
db.createUser({
  user: 'mindcare_user',
  pwd: 'mindcare_password',
  roles: [
    {
      role: 'readWrite',
      db: 'mindcare'
    }
  ]
});

// Criar coleções iniciais (opcional)
db.createCollection('users');
db.createCollection('sessions');

print('✅ Banco de dados MindCare inicializado');
EOF
    echo "✅ Script de inicialização do MongoDB criado"
fi

# Construir imagens Docker
echo "🏗️ Construindo imagens Docker..."
echo "Isso pode levar alguns minutos na primeira execução..."

if docker-compose build; then
    echo "✅ Imagens Docker construídas com sucesso"
else
    echo "❌ Erro ao construir imagens Docker"
    exit 1
fi

# Iniciar serviços
echo "🚀 Iniciando serviços..."
if docker-compose up -d; then
    echo "✅ Serviços iniciados com sucesso"
else
    echo "❌ Erro ao iniciar serviços"
    exit 1
fi

# Aguardar serviços ficarem prontos
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 10

# Verificar status dos serviços
echo "📊 Status dos serviços:"
docker-compose ps

# Verificar se os serviços estão respondendo
echo "🔍 Verificando conectividade dos serviços..."

# Verificar backend
if curl -f http://localhost:3000 &> /dev/null; then
    echo "✅ Backend respondendo na porta 3000"
else
    echo "⚠️  Backend pode ainda estar inicializando..."
fi

# Verificar MongoDB
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
    echo "✅ MongoDB respondendo"
else
    echo "⚠️  MongoDB pode ainda estar inicializando..."
fi

echo ""
echo "🎉 Configuração concluída!"
echo "========================="
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse http://localhost:3000 para o backend"
echo "2. Acesse http://localhost:19000 para o Expo DevTools"
echo "3. Use o app Expo Go para testar no dispositivo móvel"
echo ""
echo "🛠️ Comandos úteis:"
echo "• Ver logs: docker-compose logs -f"
echo "• Parar serviços: docker-compose down"
echo "• Reiniciar: docker-compose restart"
echo "• Executar testes: docker-compose -f docker-compose.test.yml up"
echo ""
echo "📚 Consulte o README.md para mais informações"
echo ""
echo "✨ Bom desenvolvimento!"


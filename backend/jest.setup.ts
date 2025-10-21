import mongoose from 'mongoose';

// Mock das variáveis de ambiente necessárias para os testes
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.ACCESS_TOKEN_TTL = '15m';
process.env.REFRESH_TOKEN_TTL = '7d';
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/mindcare-test';

// Configuração para usar banco em memória se necessário
beforeAll(async () => {
  // Conectar ao banco de teste ou usar in-memory database
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(
        process.env.MONGODB_URI || 'mongodb://localhost:27017/mindcare-test'
      );
    } catch (error) {
      console.warn('MongoDB não disponível, alguns testes podem falhar');
    }
  }
});

afterAll(async () => {
  // Limpar e fechar conexão do banco após os testes
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
});

// Limpar dados entre testes
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

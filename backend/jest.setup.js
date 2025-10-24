"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
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
    if (mongoose_1.default.connection.readyState === 0) {
        try {
            await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindcare-test');
        }
        catch (error) {
            // agora usamos a variável 'error' para evitar o warning e ajudar no debug
            console.warn('MongoDB não disponível, alguns testes podem falhar', error);
        }
    }
});
afterAll(async () => {
    // Limpar e fechar conexão do banco após os testes
    if (mongoose_1.default.connection.readyState !== 0) {
        await mongoose_1.default.connection.dropDatabase();
        await mongoose_1.default.connection.close();
    }
});
// Limpar dados entre testes
afterEach(async () => {
    if (mongoose_1.default.connection.readyState !== 0) {
        const collections = mongoose_1.default.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    }
});

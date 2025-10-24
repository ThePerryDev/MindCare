"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../../routes/index"));
describe('Routes Integration', () => {
    let app;
    beforeAll(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(index_1.default);
    });
    describe('Route Structure', () => {
        it('deve ter estrutura de rotas /api/v1', async () => {
            // Testa se as rotas estão montadas corretamente
            // Estas rotas devem retornar 404 ou outro status, mas não 400 (bad request)
            const authResponse = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/nonexistent')
                .send({});
            const userResponse = await (0, supertest_1.default)(app).get('/api/v1/users/nonexistent');
            // Se as rotas estão montadas, devemos receber pelo menos um status que não seja de erro de rota
            expect(authResponse.status).not.toBe(500); // Não deve ser erro de servidor por rota inexistente
            expect(userResponse.status).not.toBe(500); // Não deve ser erro de servidor por rota inexistente
        });
        it('deve retornar 404 para rota inexistente', async () => {
            const response = await (0, supertest_1.default)(app).get('/api/v1/nonexistent');
            expect(response.status).toBe(404);
        });
        it('deve aceitar requests para /api/v1/auth', async () => {
            // Testa se a rota de auth está montada
            const response = await (0, supertest_1.default)(app).post('/api/v1/auth/login').send({});
            // Deve retornar erro de validação (400) e não erro de rota (404)
            expect(response.status).not.toBe(404);
        });
        it('deve aceitar requests para /api/v1/users', async () => {
            // Testa se a rota de users está montada
            const response = await (0, supertest_1.default)(app).get('/api/v1/users');
            // Deve retornar alguma resposta e não erro de rota (404)
            expect(response.status).not.toBe(404);
        });
    });
    describe('Auth Routes', () => {
        it('deve ter rota POST /api/v1/auth/register', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/register')
                .send({});
            // Não deve ser 404 (rota não encontrada)
            expect(response.status).not.toBe(404);
        });
        it('deve ter rota POST /api/v1/auth/login', async () => {
            const response = await (0, supertest_1.default)(app).post('/api/v1/auth/login').send({});
            // Não deve ser 404 (rota não encontrada)
            expect(response.status).not.toBe(404);
        });
        it('deve ter rota POST /api/v1/auth/refresh', async () => {
            const response = await (0, supertest_1.default)(app).post('/api/v1/auth/refresh').send({});
            // Não deve ser 404 (rota não encontrada)
            expect(response.status).not.toBe(404);
        });
        it('deve ter rota POST /api/v1/auth/logout', async () => {
            const response = await (0, supertest_1.default)(app).post('/api/v1/auth/logout').send({});
            // Não deve ser 404 (rota não encontrada)
            expect(response.status).not.toBe(404);
        });
    });
    describe('User Routes', () => {
        it('deve ter rota GET /api/v1/users', async () => {
            const response = await (0, supertest_1.default)(app).get('/api/v1/users');
            // Não deve ser 404 (rota não encontrada)
            expect(response.status).not.toBe(404);
        });
        it('deve ter rota POST /api/v1/users', async () => {
            const response = await (0, supertest_1.default)(app).post('/api/v1/users').send({});
            // Não deve ser 404 (rota não encontrada)
            expect(response.status).not.toBe(404);
        });
        it('deve ter rota GET /api/v1/users/:id', async () => {
            const response = await (0, supertest_1.default)(app).get('/api/v1/users/123');
            // Não deve ser 404 (rota não encontrada)
            expect(response.status).not.toBe(404);
        });
        it('deve ter rota PUT /api/v1/users/:id', async () => {
            const response = await (0, supertest_1.default)(app).put('/api/v1/users/123').send({});
            // Não deve ser 404 (rota não encontrada)
            expect(response.status).not.toBe(404);
        });
        it('deve ter rota DELETE /api/v1/users/:id', async () => {
            const response = await (0, supertest_1.default)(app).delete('/api/v1/users/123');
            // Não deve ser 404 (rota não encontrada)
            expect(response.status).not.toBe(404);
        });
        it('deve ter rota PATCH /api/v1/users/:id/metrics', async () => {
            const response = await (0, supertest_1.default)(app)
                .patch('/api/v1/users/123/metrics')
                .send({});
            // Não deve ser 404 (rota não encontrada)
            expect(response.status).not.toBe(404);
        });
    });
});

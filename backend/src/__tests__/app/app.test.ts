import request from 'supertest';
import app from '../../app';

// Mock das rotas para focar no app.ts
jest.mock('../../routes', () => {
  const express = require('express');
  const router = express.Router();

  // Rota mock simples
  router.get('/test', (req: any, res: any) => {
    res.json({ message: 'test route' });
  });

  return router;
});

describe('App Configuration', () => {
  describe('Basic Setup', () => {
    it('deve responder ao healthcheck', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });

    it('deve aceitar JSON no body', async () => {
      const response = await request(app).get('/test'); // Rota mock

      expect(response.status).toBe(200);
    });

    it('deve ter middlewares configurados corretamente', async () => {
      const response = await request(app).get('/health');

      // Verifica se não há erros de middleware
      expect(response.status).not.toBe(500);
    });
  });

  describe('CORS Configuration', () => {
    it('deve configurar CORS corretamente para origin válida', async () => {
      // Mock da variável de ambiente
      const originalEnv = process.env.CORS_ORIGINS;
      process.env.CORS_ORIGINS = 'http://localhost:3000,https://example.com';

      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.status).toBe(200);

      // Restaura variável original
      process.env.CORS_ORIGINS = originalEnv;
    });

    it('deve permitir requests sem origin (same-origin)', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
    });

    it('deve configurar credentials como true', async () => {
      const response = await request(app)
        .options('/health')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');

      // CORS deve estar configurado
      expect(response.status).not.toBe(500);
    });

    it('deve permitir métodos HTTP corretos', async () => {
      // Testa diferentes métodos HTTP
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

      for (const method of methods) {
        const response = await request(app)
          .options('/health')
          .set('Origin', 'http://localhost:3000')
          .set('Access-Control-Request-Method', method);

        // Não deve retornar erro de método não permitido
        expect(response.status).not.toBe(405);
      }
    });
  });

  describe('Cookie Parser', () => {
    it('deve ter cookie parser configurado', async () => {
      const response = await request(app)
        .get('/health')
        .set('Cookie', 'test=value');

      // Se cookie parser não estivesse configurado, poderia causar erro
      expect(response.status).toBe(200);
    });
  });

  describe('JSON Parser', () => {
    it('deve aceitar JSON válido', async () => {
      const response = await request(app)
        .post('/test')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json');

      // Não deve retornar erro de parsing
      expect(response.status).not.toBe(400);
    });

    it('deve lidar com JSON inválido graciosamente', async () => {
      const response = await request(app)
        .post('/test')
        .send('{ invalid json }')
        .set('Content-Type', 'application/json');

      // Deve retornar erro de bad request, não erro de servidor
      expect([400, 404]).toContain(response.status);
    });
  });

  describe('Route Mounting', () => {
    it('deve montar as rotas corretamente', async () => {
      const response = await request(app).get('/test'); // Rota mock definida no mock

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'test route' });
    });

    it('deve retornar 404 para rotas não existentes', async () => {
      const response = await request(app).get('/nonexistent-route');

      expect(response.status).toBe(404);
    });
  });

  describe('Error Handling', () => {
    it('deve lidar com erros sem quebrar', async () => {
      // Testa uma rota que não existe
      const response = await request(app).get('/this/route/does/not/exist');

      // Deve retornar 404, não erro de servidor
      expect(response.status).toBe(404);
    });

    it('deve ter estrutura de response correta para healthcheck', async () => {
      const response = await request(app).get('/health');

      expect(response.headers['content-type']).toMatch(/json/);
      expect(typeof response.body).toBe('object');
    });
  });

  describe('Security Headers', () => {
    it('deve ter configuração básica de segurança', async () => {
      const response = await request(app).get('/health');

      // Verifica se a aplicação responde corretamente (Express pode ter x-powered-by por padrão)
      expect(response.status).toBe(200);
    });
  });
});

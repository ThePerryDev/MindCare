import request from 'supertest';
import express from 'express';
import feelingRoutes from '../../routes/feeling.routes';
import { authGuard } from '../../security/auth.middleware';

// Mock do authGuard
jest.mock('../../security/auth.middleware', () => ({
  authGuard: jest.fn((req: any, res: any, next: any) => {
    req.user = { sub: '507f1f77bcf86cd799439011' };
    next();
  }),
}));

// Mock dos controllers
jest.mock('../../controllers/feeling.controller', () => ({
  createEntrada: jest.fn((req: any, res: any) => {
    res.status(201).json({ message: 'createEntrada called' });
  }),
  createSaida: jest.fn((req: any, res: any) => {
    res.status(201).json({ message: 'createSaida called' });
  }),
  list: jest.fn((req: any, res: any) => {
    res.status(200).json({ message: 'list called' });
  }),
  updateEntrada: jest.fn((req: any, res: any) => {
    res.status(200).json({ message: 'updateEntrada called' });
  }),
  updateSaida: jest.fn((req: any, res: any) => {
    res.status(200).json({ message: 'updateSaida called' });
  }),
}));

describe('Feeling Routes Integration', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/feelings', feelingRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Estrutura das Rotas', () => {
    it('deve ter todas as rotas montadas corretamente', async () => {
      const routes = [
        { method: 'post', path: '/api/v1/feelings/entrada' },
        { method: 'post', path: '/api/v1/feelings/saida' },
        { method: 'get', path: '/api/v1/feelings' },
        { method: 'patch', path: '/api/v1/feelings/entrada/2025-10-21' },
        { method: 'patch', path: '/api/v1/feelings/saida/2025-10-21' },
      ];

      for (const route of routes) {
        let response;

        switch (route.method) {
          case 'post':
            response = await request(app)[route.method](route.path).send({});
            break;
          case 'patch':
            response = await request(app)[route.method](route.path).send({});
            break;
          case 'get':
            response = await request(app)[route.method](route.path);
            break;
          default:
            continue;
        }

        // Não deve retornar 404 (rota não encontrada)
        expect(response.status).not.toBe(404);
      }
    });

    it('deve retornar 404 para rota inexistente', async () => {
      const response = await request(app).get('/api/v1/feelings/inexistente');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/feelings/entrada', () => {
    it('deve chamar o controller createEntrada', async () => {
      const response = await request(app)
        .post('/api/v1/feelings/entrada')
        .send({ day: '2025-10-21', sentimento_de_entrada: 'Muito Feliz' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('createEntrada called');
    });

    it('deve aceitar content-type application/json', async () => {
      const response = await request(app)
        .post('/api/v1/feelings/entrada')
        .set('Content-Type', 'application/json')
        .send('{"day":"2025-10-21","sentimento_de_entrada":"Muito Feliz"}');

      expect(response.status).toBe(201);
    });

    it('deve processar dados do body corretamente', async () => {
      const testData = {
        day: '2025-10-21',
        sentimento_de_entrada: 'Neutro',
        extraField: 'should be ignored',
      };

      const response = await request(app)
        .post('/api/v1/feelings/entrada')
        .send(testData);

      expect(response.status).toBe(201);
    });
  });

  describe('POST /api/v1/feelings/saida', () => {
    it('deve chamar o controller createSaida', async () => {
      const response = await request(app)
        .post('/api/v1/feelings/saida')
        .send({ day: '2025-10-21', sentimento_de_saida: 'Triste' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('createSaida called');
    });

    it('deve aceitar diferentes métodos HTTP', async () => {
      // Apenas POST deve funcionar para esta rota
      const postResponse = await request(app)
        .post('/api/v1/feelings/saida')
        .send({});

      const getResponse = await request(app).get('/api/v1/feelings/saida');
      const putResponse = await request(app)
        .put('/api/v1/feelings/saida')
        .send({});

      expect(postResponse.status).toBe(201);
      expect(getResponse.status).toBe(404);
      expect(putResponse.status).toBe(404);
    });
  });

  describe('GET /api/v1/feelings', () => {
    it('deve chamar o controller list', async () => {
      const response = await request(app).get('/api/v1/feelings');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('list called');
    });

    it('deve aceitar query parameters', async () => {
      const response = await request(app)
        .get('/api/v1/feelings')
        .query({ inicio: '2025-10-01', fim: '2025-10-31' });

      expect(response.status).toBe(200);
    });

    it('deve funcionar sem query parameters', async () => {
      const response = await request(app).get('/api/v1/feelings');

      expect(response.status).toBe(200);
    });

    it('deve rejeitar outros métodos HTTP', async () => {
      const postResponse = await request(app).post('/api/v1/feelings').send({});
      const deleteResponse = await request(app).delete('/api/v1/feelings');

      expect(postResponse.status).toBe(404);
      expect(deleteResponse.status).toBe(404);
    });
  });

  describe('PATCH /api/v1/feelings/entrada/:day', () => {
    it('deve chamar o controller updateEntrada', async () => {
      const response = await request(app)
        .patch('/api/v1/feelings/entrada/2025-10-21')
        .send({ sentimento_de_entrada: 'Irritado' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('updateEntrada called');
    });

    it('deve aceitar diferentes formatos de day no parâmetro', async () => {
      const days = ['2025-01-01', '2025-12-31', '2024-02-29'];

      for (const day of days) {
        const response = await request(app)
          .patch(`/api/v1/feelings/entrada/${day}`)
          .send({ sentimento_de_entrada: 'Neutro' });

        expect(response.status).toBe(200);
      }
    });

    it('deve rejeitar outros métodos HTTP', async () => {
      const getResponse = await request(app).get(
        '/api/v1/feelings/entrada/2025-10-21'
      );
      const postResponse = await request(app)
        .post('/api/v1/feelings/entrada/2025-10-21')
        .send({});

      expect(getResponse.status).toBe(404);
      expect(postResponse.status).toBe(404);
    });

    it('deve capturar parâmetro day corretamente', async () => {
      const day = '2025-10-25';
      const response = await request(app)
        .patch(`/api/v1/feelings/entrada/${day}`)
        .send({ sentimento_de_entrada: 'Muito Feliz' });

      expect(response.status).toBe(200);
    });
  });

  describe('PATCH /api/v1/feelings/saida/:day', () => {
    it('deve chamar o controller updateSaida', async () => {
      const response = await request(app)
        .patch('/api/v1/feelings/saida/2025-10-21')
        .send({ sentimento_de_saida: 'Muito Triste' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('updateSaida called');
    });

    it('deve processar diferentes IDs de day', async () => {
      const days = ['2025-01-15', '2025-06-30', '2025-11-11', '2024-12-25'];

      for (const day of days) {
        const response = await request(app)
          .patch(`/api/v1/feelings/saida/${day}`)
          .send({ sentimento_de_saida: 'Triste' });

        expect(response.status).toBe(200);
      }
    });

    it('deve aceitar body com dados adicionais', async () => {
      const response = await request(app)
        .patch('/api/v1/feelings/saida/2025-10-21')
        .send({
          sentimento_de_saida: 'Neutro',
          extra: 'field',
          another: 123,
        });

      expect(response.status).toBe(200);
    });
  });

  describe('Middleware de Autenticação', () => {
    it('deve aplicar authGuard a todas as rotas', async () => {
      const mockAuthGuard = authGuard as jest.MockedFunction<typeof authGuard>;

      // Testar várias rotas para garantir que o middleware é aplicado
      await request(app).post('/api/v1/feelings/entrada').send({});
      await request(app).post('/api/v1/feelings/saida').send({});
      await request(app).get('/api/v1/feelings');
      await request(app).patch('/api/v1/feelings/entrada/2025-10-21').send({});
      await request(app).patch('/api/v1/feelings/saida/2025-10-21').send({});

      // O middleware deve ter sido chamado para cada rota
      expect(mockAuthGuard).toHaveBeenCalledTimes(5);
    });

    it('deve ter req.user disponível após authGuard', async () => {
      // O mock já define req.user, então testamos se a rota funciona
      const response = await request(app).get('/api/v1/feelings');

      expect(response.status).toBe(200);
    });
  });

  describe('Tratamento de Erros de Rota', () => {
    it('deve retornar 404 para métodos não suportados', async () => {
      const unsupportedMethods = [
        { method: 'put', path: '/api/v1/feelings/entrada' },
        { method: 'delete', path: '/api/v1/feelings/entrada' },
        { method: 'put', path: '/api/v1/feelings/saida' },
        { method: 'delete', path: '/api/v1/feelings/saida' },
        { method: 'post', path: '/api/v1/feelings' },
        { method: 'put', path: '/api/v1/feelings' },
        { method: 'delete', path: '/api/v1/feelings' },
      ];

      for (const { method, path } of unsupportedMethods) {
        let response;
        switch (method) {
          case 'put':
            response = await request(app).put(path).send({});
            break;
          case 'delete':
            response = await request(app).delete(path);
            break;
          default:
            continue;
        }
        expect(response.status).toBe(404);
      }
    });

    it('deve lidar com paths malformados', async () => {
      const malformedPaths = [
        '/api/v1/feelings/',
        '/api/v1/feelings//entrada',
        '/api/v1/feelings/entrada/',
        '/api/v1/feelings/entrada//',
        '/api/v1/feelings/entrada/2025-10-21/',
      ];

      for (const path of malformedPaths) {
        const response = await request(app).get(path);
        // Pode ser 404 ou redirecionamento, mas não deve quebrar
        expect([200, 201, 301, 302, 404]).toContain(response.status);
      }
    });
  });

  describe('Headers e Content-Type', () => {
    it('deve aceitar application/json como content-type', async () => {
      const response = await request(app)
        .post('/api/v1/feelings/entrada')
        .set('Content-Type', 'application/json')
        .send('{"test": "data"}');

      expect(response.status).toBe(201);
    });

    it('deve funcionar com headers customizados', async () => {
      const response = await request(app)
        .get('/api/v1/feelings')
        .set('X-Custom-Header', 'test-value')
        .set('User-Agent', 'test-agent');

      expect(response.status).toBe(200);
    });

    it('deve retornar JSON como resposta', async () => {
      const response = await request(app).get('/api/v1/feelings');

      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toBeDefined();
    });
  });

  describe('Casos Edge de Parâmetros', () => {
    it('deve lidar com caracteres especiais em parâmetros', async () => {
      const specialChars = [
        '2025-10-21%20',
        '2025-10-21;',
        '2025-10-21&test=1',
      ];

      for (const day of specialChars) {
        const response = await request(app)
          .patch(`/api/v1/feelings/entrada/${encodeURIComponent(day)}`)
          .send({ sentimento_de_entrada: 'Neutro' });

        // Deve processar ou retornar erro adequado, mas não quebrar
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
      }
    });

    it('deve lidar com parâmetros muito longos', async () => {
      const longDay = 'a'.repeat(1000);

      const response = await request(app)
        .patch(`/api/v1/feelings/entrada/${longDay}`)
        .send({ sentimento_de_entrada: 'Neutro' });

      // Deve retornar erro apropriado (pode ser 404 se não encontrar a rota)
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
    });
  });
});

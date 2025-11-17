import request from 'supertest';
import express from 'express';
import feelingBotRoutes from '../../routes/feeling_bot.routes';
import { authGuard } from '../../security/auth.middleware';

// Mock do authGuard
jest.mock('../../security/auth.middleware', () => ({
  authGuard: jest.fn((req: any, res: any, next: any) => {
    req.user = { sub: '507f1f77bcf86cd799439011' };
    next();
  }),
}));

// Mock dos controllers
jest.mock('../../controllers/feeling_bot.controller', () => ({
  list: jest.fn((req: any, res: any) => {
    res.status(200).json({ message: 'list called' });
  }),
  deleteByDay: jest.fn((req: any, res: any) => {
    res.status(200).json({ message: 'deleteByDay called' });
  }),
  deleteAll: jest.fn((req: any, res: any) => {
    res.status(200).json({ message: 'deleteAll called' });
  }),
}));

describe('FeelingBot Routes Integration', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/feeling-bot', feelingBotRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Estrutura das Rotas', () => {
    it('deve ter todas as rotas montadas corretamente', async () => {
      const routes = [
        { method: 'get', path: '/api/v1/feeling-bot' },
        { method: 'delete', path: '/api/v1/feeling-bot/2025-10-21' },
        { method: 'delete', path: '/api/v1/feeling-bot' },
      ];

      for (const route of routes) {
        let response;
        switch (route.method) {
          case 'get':
            response = await request(app).get(route.path);
            break;
          case 'delete':
            response = await request(app).delete(route.path);
            break;
          default:
            continue;
        }

        // Não deve retornar 404 (rota não encontrada)
        expect(response.status).not.toBe(404);
      }
    });

    it('deve retornar 404 para rota inexistente', async () => {
      const response = await request(app).get(
        '/api/v1/feeling-bot/inexistente'
      );
      expect(response.status).toBe(404);
    });

    it('deve diferenciar entre DELETE / e DELETE /:day', async () => {
      const deleteAllResponse = await request(app).delete(
        '/api/v1/feeling-bot'
      );
      const deleteByDayResponse = await request(app).delete(
        '/api/v1/feeling-bot/2025-10-21'
      );

      expect(deleteAllResponse.status).toBe(200);
      expect(deleteAllResponse.body.message).toBe('deleteAll called');

      expect(deleteByDayResponse.status).toBe(200);
      expect(deleteByDayResponse.body.message).toBe('deleteByDay called');
    });
  });

  describe('GET /api/v1/feeling-bot', () => {
    it('deve chamar o controller list', async () => {
      const response = await request(app).get('/api/v1/feeling-bot');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('list called');
    });

    it('deve funcionar sem parâmetros', async () => {
      const response = await request(app).get('/api/v1/feeling-bot');

      expect(response.status).toBe(200);
    });

    it('deve ignorar query parameters (não são usados nesta rota)', async () => {
      const response = await request(app)
        .get('/api/v1/feeling-bot')
        .query({ unused: 'parameter' });

      expect(response.status).toBe(200);
    });

    it('deve rejeitar outros métodos HTTP para rota base', async () => {
      const postResponse = await request(app)
        .post('/api/v1/feeling-bot')
        .send({});
      const putResponse = await request(app)
        .put('/api/v1/feeling-bot')
        .send({});
      const patchResponse = await request(app)
        .patch('/api/v1/feeling-bot')
        .send({});

      expect(postResponse.status).toBe(404);
      expect(putResponse.status).toBe(404);
      expect(patchResponse.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/feeling-bot/:day', () => {
    it('deve chamar o controller deleteByDay', async () => {
      const response = await request(app).delete(
        '/api/v1/feeling-bot/2025-10-21'
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('deleteByDay called');
    });

    it('deve aceitar diferentes formatos de day no parâmetro', async () => {
      const days = ['2025-01-01', '2025-12-31', '2024-02-29', '2023-06-15'];

      for (const day of days) {
        const response = await request(app).delete(
          `/api/v1/feeling-bot/${day}`
        );
        expect(response.status).toBe(200);
      }
    });

    it('deve capturar parâmetro day corretamente', async () => {
      const testDays = ['2025-01-15', '2025-06-30', '2025-11-11', '2024-12-25'];

      for (const day of testDays) {
        const response = await request(app).delete(
          `/api/v1/feeling-bot/${day}`
        );
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('deleteByDay called');
      }
    });

    it('deve rejeitar outros métodos HTTP para rota com parâmetro', async () => {
      const day = '2025-10-21';

      const getResponse = await request(app).get(`/api/v1/feeling-bot/${day}`);
      const postResponse = await request(app)
        .post(`/api/v1/feeling-bot/${day}`)
        .send({});
      const putResponse = await request(app)
        .put(`/api/v1/feeling-bot/${day}`)
        .send({});
      const patchResponse = await request(app)
        .patch(`/api/v1/feeling-bot/${day}`)
        .send({});

      expect(getResponse.status).toBe(404);
      expect(postResponse.status).toBe(404);
      expect(putResponse.status).toBe(404);
      expect(patchResponse.status).toBe(404);
    });

    it('deve processar caracteres especiais no parâmetro day', async () => {
      const specialDays = [
        '2025-10-21%20extra',
        '2025-10-21;test',
        '2025-10-21&param=1',
      ];

      for (const day of specialDays) {
        const response = await request(app).delete(
          `/api/v1/feeling-bot/${encodeURIComponent(day)}`
        );

        // Deve processar ou retornar erro adequado, mas não quebrar
        expect([200, 400, 404]).toContain(response.status);
      }
    });
  });

  describe('DELETE /api/v1/feeling-bot', () => {
    it('deve chamar o controller deleteAll', async () => {
      const response = await request(app).delete('/api/v1/feeling-bot');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('deleteAll called');
    });

    it('deve funcionar sem parâmetros ou body', async () => {
      const response = await request(app).delete('/api/v1/feeling-bot');

      expect(response.status).toBe(200);
    });

    it('deve ignorar body se fornecido', async () => {
      const response = await request(app)
        .delete('/api/v1/feeling-bot')
        .send({ ignored: 'data' });

      expect(response.status).toBe(200);
    });

    it('deve ser diferente da rota DELETE /:day', async () => {
      const deleteAllResponse = await request(app).delete(
        '/api/v1/feeling-bot'
      );
      const deleteByDayResponse = await request(app).delete(
        '/api/v1/feeling-bot/test'
      );

      expect(deleteAllResponse.body.message).toBe('deleteAll called');
      expect(deleteByDayResponse.body.message).toBe('deleteByDay called');
    });
  });

  describe('Middleware de Autenticação', () => {
    it('deve aplicar authGuard a todas as rotas', async () => {
      const mockAuthGuard = authGuard as jest.MockedFunction<typeof authGuard>;

      // Testar todas as rotas para garantir que o middleware é aplicado
      await request(app).get('/api/v1/feeling-bot');
      await request(app).delete('/api/v1/feeling-bot/2025-10-21');
      await request(app).delete('/api/v1/feeling-bot');

      // O middleware deve ter sido chamado para cada rota
      expect(mockAuthGuard).toHaveBeenCalledTimes(3);
    });

    it('deve ter req.user disponível após authGuard', async () => {
      // O mock já define req.user, então testamos se a rota funciona
      const response = await request(app).get('/api/v1/feeling-bot');

      expect(response.status).toBe(200);
    });
  });

  describe('Precedência de Rotas', () => {
    it('deve priorizar rota DELETE / sobre DELETE /:day quando apropriado', async () => {
      // DELETE /api/v1/feeling-bot deve mapear para deleteAll
      const response = await request(app).delete('/api/v1/feeling-bot');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('deleteAll called');
    });

    it('deve usar DELETE /:day quando parâmetro for fornecido', async () => {
      // DELETE /api/v1/feeling-bot/2025-10-21 deve mapear para deleteByDay
      const response = await request(app).delete(
        '/api/v1/feeling-bot/2025-10-21'
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('deleteByDay called');
    });

    it('deve distinguir entre diferentes tipos de parâmetros', async () => {
      const testParams = [
        '2025-10-21',
        'string-parameter',
        '123456',
        'special-chars-!@#',
      ];

      for (const param of testParams) {
        const response = await request(app).delete(
          `/api/v1/feeling-bot/${param}`
        );

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('deleteByDay called');
      }
    });
  });

  describe('Tratamento de Erros de Rota', () => {
    it('deve retornar 404 para métodos não suportados', async () => {
      const unsupportedMethods = [
        { method: 'post', path: '/api/v1/feeling-bot' },
        { method: 'put', path: '/api/v1/feeling-bot' },
        { method: 'patch', path: '/api/v1/feeling-bot' },
        { method: 'post', path: '/api/v1/feeling-bot/2025-10-21' },
        { method: 'put', path: '/api/v1/feeling-bot/2025-10-21' },
        { method: 'patch', path: '/api/v1/feeling-bot/2025-10-21' },
        { method: 'get', path: '/api/v1/feeling-bot/2025-10-21' },
      ];

      for (const { method, path } of unsupportedMethods) {
        let response;
        switch (method) {
          case 'post':
            response = await request(app).post(path).send({});
            break;
          case 'put':
            response = await request(app).put(path).send({});
            break;
          case 'patch':
            response = await request(app).patch(path).send({});
            break;
          case 'get':
            response = await request(app).get(path);
            break;
          default:
            continue;
        }
        expect(response.status).toBe(404);
      }
    });

    it('deve lidar com paths malformados', async () => {
      const malformedPaths = [
        '/api/v1/feeling-bot/',
        '/api/v1/feeling-bot//',
        '/api/v1/feeling-bot//test',
        '/api/v1/feeling-bot/test/',
        '/api/v1/feeling-bot/test/extra',
      ];

      for (const path of malformedPaths) {
        const response = await request(app).delete(path);

        // Pode ser 200, 404 ou redirecionamento, mas não deve quebrar
        expect([200, 301, 302, 404]).toContain(response.status);
      }
    });

    it('deve lidar com URLs muito longas', async () => {
      const longParam = 'a'.repeat(1000);

      const response = await request(app).delete(
        `/api/v1/feeling-bot/${longParam}`
      );

      // Deve processar ou retornar erro apropriado
      expect([200, 400, 404, 414]).toContain(response.status);
    });
  });

  describe('Headers e Content-Type', () => {
    it('deve funcionar com headers customizados', async () => {
      const response = await request(app)
        .get('/api/v1/feeling-bot')
        .set('X-Custom-Header', 'test-value')
        .set('User-Agent', 'test-agent')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
    });

    it('deve retornar JSON como resposta', async () => {
      const response = await request(app).get('/api/v1/feeling-bot');

      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toBeDefined();
    });

    it('deve aceitar diferentes content-types para DELETE', async () => {
      const response1 = await request(app)
        .delete('/api/v1/feeling-bot')
        .set('Content-Type', 'application/json');

      const response2 = await request(app)
        .delete('/api/v1/feeling-bot/2025-10-21')
        .set('Content-Type', 'text/plain');

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
    });
  });

  describe('Casos Edge de Parâmetros', () => {
    it('deve lidar com parâmetros com caracteres especiais', async () => {
      const specialParams = [
        '2025-10-21%20test',
        '2025-10-21;script',
        '2025-10-21&query=1',
        '2025-10-21#fragment',
        'test@example.com',
        'param with spaces',
      ];

      for (const param of specialParams) {
        const response = await request(app).delete(
          `/api/v1/feeling-bot/${encodeURIComponent(param)}`
        );

        // Deve processar ou retornar erro adequado, mas não quebrar
        expect([200, 400, 404]).toContain(response.status);
      }
    });

    it('deve lidar com caracteres Unicode em parâmetros', async () => {
      const unicodeParams = [
        '2025-10-21-测试',
        '2025-10-21-тест',
        '2025-10-21-🙂',
        'تجربة-2025',
      ];

      for (const param of unicodeParams) {
        const response = await request(app).delete(
          `/api/v1/feeling-bot/${encodeURIComponent(param)}`
        );

        expect([200, 400, 404]).toContain(response.status);
      }
    });

    it('deve lidar com parâmetros numéricos', async () => {
      const numericParams = ['123', '0', '-1', '999999', '1.5'];

      for (const param of numericParams) {
        const response = await request(app).delete(
          `/api/v1/feeling-bot/${param}`
        );
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('deleteByDay called');
      }
    });

    it('deve lidar com parâmetros vazios ou undefined', async () => {
      // Parâmetro vazio deve mapear para deleteAll (rota /)
      const response = await request(app).delete('/api/v1/feeling-bot/');

      // Pode ser interpretado como rota base ou erro de rota
      expect([200, 301, 302, 404]).toContain(response.status);
    });
  });

  describe('Comportamento de Middleware Order', () => {
    it('deve executar authGuard antes dos controllers', async () => {
      const mockAuthGuard = authGuard as jest.MockedFunction<typeof authGuard>;
      mockAuthGuard.mockClear();

      await request(app).get('/api/v1/feeling-bot');

      // Verificar se authGuard foi chamado pelo menos uma vez
      expect(mockAuthGuard).toHaveBeenCalled();
    });

    it('deve aplicar express.json() se necessário', async () => {
      const response = await request(app)
        .delete('/api/v1/feeling-bot')
        .set('Content-Type', 'application/json')
        .send('{"test": "data"}');

      expect(response.status).toBe(200);
    });
  });

  describe('Route Matching Específico', () => {
    it('deve distinguir corretamente entre / e /:day', async () => {
      // Array para rastrear qual controller foi chamado
      const calls: string[] = [];

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const FeelingBotController = require('../../controllers/feeling_bot.controller');

      FeelingBotController.list.mockImplementation((req: any, res: any) => {
        calls.push('list');
        res.status(200).json({ called: 'list' });
      });

      FeelingBotController.deleteAll.mockImplementation(
        (req: any, res: any) => {
          calls.push('deleteAll');
          res.status(200).json({ called: 'deleteAll' });
        }
      );

      FeelingBotController.deleteByDay.mockImplementation(
        (req: any, res: any) => {
          calls.push('deleteByDay');
          res.status(200).json({ called: 'deleteByDay' });
        }
      );

      // Testar cada rota
      await request(app).get('/api/v1/feeling-bot');
      await request(app).delete('/api/v1/feeling-bot');
      await request(app).delete('/api/v1/feeling-bot/2025-10-21');

      expect(calls).toContain('list');
      expect(calls).toContain('deleteAll');
      expect(calls).toContain('deleteByDay');
    });
  });
});

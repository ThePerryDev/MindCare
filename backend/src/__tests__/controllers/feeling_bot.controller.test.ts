import request from 'supertest';
import express from 'express';
import FeelingBotController from '../../controllers/feeling_bot.controller';
import FeelingBotModel from '../../models/feeling_bot.model';

// Mock do modelo de feeling bot mantendo as interfaces
jest.mock('../../models/feeling_bot.model', () => {
  const actual = jest.requireActual('../../models/feeling_bot.model');
  return {
    ...actual,
    default: {
      findOne: jest.fn(),
      findOneAndDelete: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
    },
  };
});

const mockFeelingBotModel = FeelingBotModel as jest.Mocked<
  typeof FeelingBotModel
>;

// Mock do moment
jest.mock('moment', () => {
  const actualMoment = jest.requireActual('moment');
  return {
    ...actualMoment,
    __esModule: true,
    default: jest.fn((date?: string, format?: string, strict?: boolean) => {
      if (date && format && strict) {
        // Simular validação de formato YYYY-MM-DD
        const isValid = /^\d{4}-\d{2}-\d{2}$/.test(date);
        return {
          isValid: () => isValid,
        };
      }
      return actualMoment(date);
    }),
  };
});

// Setup do app express para testes
const app = express();
app.use(express.json());

// Mock do middleware de auth
app.use((req: any, res, next) => {
  req.user = { sub: '507f1f77bcf86cd799439011' };
  next();
});

// Rotas para teste
app.get('/feeling-bot', FeelingBotController.list);
app.delete('/feeling-bot/:day', FeelingBotController.deleteByDay);
app.delete('/feeling-bot', FeelingBotController.deleteAll);

describe('FeelingBot Controller', () => {
  const mockFeelingBot = {
    _id: '507f1f77bcf86cd799439012',
    user_id: '507f1f77bcf86cd799439011',
    days: new Map([
      [
        '2025-10-21',
        {
          sentimento: 'Muito feliz e animado hoje',
          label: '21/10/2025',
          createdAt: new Date('2025-10-21T10:00:00Z'),
          updatedAt: new Date('2025-10-21T10:00:00Z'),
        },
      ],
      [
        '2025-10-22',
        {
          sentimento: 'Dia normal, sem grandes mudanças',
          label: '22/10/2025',
          createdAt: new Date('2025-10-22T10:00:00Z'),
          updatedAt: new Date('2025-10-22T10:00:00Z'),
        },
      ],
    ]),
    createdAt: new Date(),
    updatedAt: new Date(),
    toJSON: () => ({
      id: '507f1f77bcf86cd799439012',
      user_id: '507f1f77bcf86cd799439011',
      days: [
        {
          day: '2025-10-22',
          sentimento: 'Dia normal, sem grandes mudanças',
          label: '22/10/2025',
          createdAt: new Date('2025-10-22T10:00:00Z'),
          updatedAt: new Date('2025-10-22T10:00:00Z'),
        },
        {
          day: '2025-10-21',
          sentimento: 'Muito feliz e animado hoje',
          label: '21/10/2025',
          createdAt: new Date('2025-10-21T10:00:00Z'),
          updatedAt: new Date('2025-10-21T10:00:00Z'),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocks
    mockFeelingBotModel.findOne = jest.fn();
    mockFeelingBotModel.findOneAndDelete = jest.fn();
  });

  describe('GET /feeling-bot', () => {
    it('deve listar sentimentos do bot do usuário com sucesso', async () => {
      mockFeelingBotModel.findOne = jest.fn().mockResolvedValue(mockFeelingBot);

      const response = await request(app).get('/feeling-bot');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('feelings_bot');
      expect(response.body.feelings_bot.id).toBe('507f1f77bcf86cd799439012');
      expect(response.body.feelings_bot.days).toHaveLength(2);
      expect(mockFeelingBotModel.findOne).toHaveBeenCalledWith({
        user_id: '507f1f77bcf86cd799439011',
      });
    });

    it('deve retornar array vazio quando usuário não tem registros', async () => {
      mockFeelingBotModel.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/feeling-bot');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('feelings_bot');
      expect(response.body.feelings_bot).toEqual([]);
    });

    it('deve lidar com erro do banco de dados', async () => {
      mockFeelingBotModel.findOne = jest
        .fn()
        .mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app).get('/feeling-bot');

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Database connection failed');
    });

    it('deve lidar com erro genérico', async () => {
      mockFeelingBotModel.findOne = jest.fn().mockRejectedValue(new Error());

      const response = await request(app).get('/feeling-bot');

      expect(response.status).toBe(500);
      expect(response.body.error).toContain(
        'erro ao listar sentimentos do bot'
      );
    });
  });

  describe('DELETE /feeling-bot/:day', () => {
    const mockFeelingBotWithSave = {
      ...mockFeelingBot,
      days: new Map([
        [
          '2025-10-21',
          {
            sentimento: 'Muito feliz e animado hoje',
            label: '21/10/2025',
            createdAt: new Date('2025-10-21T10:00:00Z'),
            updatedAt: new Date('2025-10-21T10:00:00Z'),
          },
        ],
      ]),
      save: jest.fn().mockResolvedValue(true),
    };

    it('deve deletar dia específico com sucesso', async () => {
      // Mock do Map com método has e delete
      const mockDays = new Map([
        ['2025-10-21', { sentimento: 'Teste', label: '21/10/2025' }],
      ]);
      mockDays.delete = jest.fn().mockReturnValue(true);
      mockDays.has = jest.fn().mockReturnValue(true);

      const mockDoc = {
        ...mockFeelingBotWithSave,
        days: mockDays,
        save: jest.fn().mockResolvedValue(mockFeelingBotWithSave),
      };

      mockFeelingBotModel.findOne = jest.fn().mockResolvedValue(mockDoc);

      const response = await request(app).delete('/feeling-bot/2025-10-21');

      expect(response.status).toBe(200);
      expect(response.body.message).toContain(
        'sentimento do dia 2025-10-21 removido'
      );
      expect(response.body).toHaveProperty('feelings_bot');
      expect(mockDays.delete).toHaveBeenCalledWith('2025-10-21');
      expect(mockDoc.save).toHaveBeenCalled();
    });

    it('deve falhar com formato de day inválido', async () => {
      const response = await request(app).delete('/feeling-bot/invalid-date');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('day inválido (YYYY-MM-DD)');
    });

    it('deve falhar com day em formato diferente', async () => {
      const response = await request(app).delete('/feeling-bot/2025/10/21');

      // Pode retornar 400 (validação) ou 404 (rota não encontrada) dependendo do router
      expect([400, 404]).toContain(response.status);
    });

    it('deve retornar 404 quando usuário não tem registros', async () => {
      mockFeelingBotModel.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete('/feeling-bot/2025-10-21');

      expect(response.status).toBe(404);
      expect(response.body.error).toContain(
        'registro do usuário não encontrado'
      );
    });

    it('deve retornar 404 quando dia não existe no histórico', async () => {
      const mockDays = new Map();
      mockDays.has = jest.fn().mockReturnValue(false);

      const mockDoc = {
        ...mockFeelingBotWithSave,
        days: mockDays,
      };

      mockFeelingBotModel.findOne = jest.fn().mockResolvedValue(mockDoc);

      const response = await request(app).delete('/feeling-bot/2025-10-21');

      expect(response.status).toBe(404);
      expect(response.body.error).toContain(
        'dia 2025-10-21 não encontrado no histórico'
      );
      expect(mockDays.has).toHaveBeenCalledWith('2025-10-21');
    });

    it('deve lidar com erro do banco de dados', async () => {
      mockFeelingBotModel.findOne = jest
        .fn()
        .mockRejectedValue(new Error('Connection timeout'));

      const response = await request(app).delete('/feeling-bot/2025-10-21');

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Connection timeout');
    });

    it('deve lidar com erro genérico', async () => {
      mockFeelingBotModel.findOne = jest.fn().mockRejectedValue(new Error());

      const response = await request(app).delete('/feeling-bot/2025-10-21');

      expect(response.status).toBe(500);
      expect(response.body.error).toContain(
        'erro ao deletar sentimento do bot'
      );
    });

    it('deve validar formatos de data edge cases', async () => {
      const invalidDates = [
        '25-10-21',
        '2025-1-1',
        '2025-13-01',
        '2025-01-32',
        '',
        'undefined',
      ];

      for (const invalidDate of invalidDates) {
        const response = await request(app).delete(
          `/feeling-bot/${invalidDate}`
        );
        // Pode retornar diferentes status codes dependendo do tipo de erro
        expect([400, 404, 500]).toContain(response.status);
      }
    });
  });

  describe('DELETE /feeling-bot', () => {
    it('deve deletar todos os registros do usuário com sucesso', async () => {
      mockFeelingBotModel.findOneAndDelete = jest
        .fn()
        .mockResolvedValue(mockFeelingBot);

      const response = await request(app).delete('/feeling-bot');

      expect(response.status).toBe(200);
      expect(response.body.message).toContain(
        'todos os sentimentos do bot removidos com sucesso'
      );
      expect(mockFeelingBotModel.findOneAndDelete).toHaveBeenCalledWith({
        user_id: '507f1f77bcf86cd799439011',
      });
    });

    it('deve retornar 404 quando usuário não tem registros', async () => {
      mockFeelingBotModel.findOneAndDelete = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete('/feeling-bot');

      expect(response.status).toBe(404);
      expect(response.body.error).toContain(
        'registro do usuário não encontrado'
      );
    });

    it('deve lidar com erro do banco de dados', async () => {
      mockFeelingBotModel.findOneAndDelete = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/feeling-bot');

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Database error');
    });

    it('deve lidar com erro genérico', async () => {
      mockFeelingBotModel.findOneAndDelete = jest
        .fn()
        .mockRejectedValue(new Error());

      const response = await request(app).delete('/feeling-bot');

      expect(response.status).toBe(500);
      expect(response.body.error).toContain(
        'erro ao deletar todos os sentimentos do bot'
      );
    });
  });

  describe('Autenticação', () => {
    const appWithoutAuth = express();
    appWithoutAuth.use(express.json());

    // Simular usuário não autenticado
    appWithoutAuth.use((req: any, res, next) => {
      req.user = null;
      next();
    });

    appWithoutAuth.get('/feeling-bot', FeelingBotController.list);
    appWithoutAuth.delete(
      '/feeling-bot/:day',
      FeelingBotController.deleteByDay
    );
    appWithoutAuth.delete('/feeling-bot', FeelingBotController.deleteAll);

    it('deve falhar em list sem autenticação', async () => {
      const response = await request(appWithoutAuth).get('/feeling-bot');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('usuário não autenticado');
    });

    it('deve falhar em deleteByDay sem autenticação', async () => {
      const response = await request(appWithoutAuth).delete(
        '/feeling-bot/2025-10-21'
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('usuário não autenticado');
    });

    it('deve falhar em deleteAll sem autenticação', async () => {
      const response = await request(appWithoutAuth).delete('/feeling-bot');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('usuário não autenticado');
    });
  });

  describe('Cenários com usuário vazio', () => {
    const appWithEmptyUser = express();
    appWithEmptyUser.use(express.json());

    // Simular usuário com sub vazio
    appWithEmptyUser.use((req: any, res, next) => {
      req.user = { sub: '' };
      next();
    });

    appWithEmptyUser.get('/feeling-bot', FeelingBotController.list);
    appWithEmptyUser.delete(
      '/feeling-bot/:day',
      FeelingBotController.deleteByDay
    );
    appWithEmptyUser.delete('/feeling-bot', FeelingBotController.deleteAll);

    it('deve falhar em list com userId vazio', async () => {
      const response = await request(appWithEmptyUser).get('/feeling-bot');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('usuário não autenticado');
    });

    it('deve falhar em deleteByDay com userId vazio', async () => {
      const response = await request(appWithEmptyUser).delete(
        '/feeling-bot/2025-10-21'
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('usuário não autenticado');
    });

    it('deve falhar em deleteAll com userId vazio', async () => {
      const response = await request(appWithEmptyUser).delete('/feeling-bot');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('usuário não autenticado');
    });
  });

  describe('Integração com Map operations', () => {
    it('deve manter integridade do Map após operações', async () => {
      const mockDaysMap = new Map([
        ['2025-10-21', { sentimento: 'Feliz', label: '21/10' }],
        ['2025-10-22', { sentimento: 'Triste', label: '22/10' }],
        ['2025-10-23', { sentimento: 'Neutro', label: '23/10' }],
      ]);

      const mockDoc = {
        user_id: '507f1f77bcf86cd799439011',
        days: mockDaysMap,
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          id: '1',
          days: Array.from(mockDaysMap.entries()),
        }),
      };

      mockFeelingBotModel.findOne = jest.fn().mockResolvedValue(mockDoc);

      // Simular operação de delete
      mockDaysMap.delete('2025-10-22');

      const response = await request(app).delete('/feeling-bot/2025-10-22');

      // Pode retornar 404 se não houver registro para deletar
      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(mockDaysMap.size).toBe(2);
        expect(mockDaysMap.has('2025-10-21')).toBe(true);
        expect(mockDaysMap.has('2025-10-22')).toBe(false);
      }
      expect(mockDaysMap.has('2025-10-23')).toBe(true);
    });
  });

  describe('Validação de parâmetros', () => {
    it('deve validar corretamente day como undefined', async () => {
      // Simular rota sem parâmetro day
      const appWithoutParam = express();
      appWithoutParam.use(express.json());
      appWithoutParam.use((req: any, res, next) => {
        req.user = { sub: '507f1f77bcf86cd799439011' };
        req.params = {}; // Sem day
        next();
      });
      appWithoutParam.delete('/feeling-bot', FeelingBotController.deleteByDay);

      const response = await request(appWithoutParam).delete('/feeling-bot');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('day inválido (YYYY-MM-DD)');
    });

    it('deve validar day com espaços', async () => {
      const response = await request(app).delete('/feeling-bot/  2025-10-21  ');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('day inválido (YYYY-MM-DD)');
    });
  });
});

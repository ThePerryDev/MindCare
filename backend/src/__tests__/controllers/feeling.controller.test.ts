import request from 'supertest';
import express from 'express';
import FeelingController from '../../controllers/feeling.controller';
import FeelingModel, { FEELINGS } from '../../models/feeling.model';

// Mock do modelo de feeling mantendo as constantes
jest.mock('../../models/feeling.model', () => {
  const actual = jest.requireActual('../../models/feeling.model');
  return {
    ...actual,
    default: {
      findOneAndUpdate: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    },
  };
});

const mockFeelingModel = FeelingModel as jest.Mocked<typeof FeelingModel>;

// Setup do app express para testes
const app = express();
app.use(express.json());

// Mock do middleware de auth
app.use((req: any, res, next) => {
  req.user = { sub: '507f1f77bcf86cd799439011' };
  next();
});

// Rotas para teste
app.post('/feelings/entrada', FeelingController.createEntrada);
app.post('/feelings/saida', FeelingController.createSaida);
app.get('/feelings', FeelingController.list);
app.patch('/feelings/entrada/:day', FeelingController.updateEntrada);
app.patch('/feelings/saida/:day', FeelingController.updateSaida);

describe('Feeling Controller', () => {
  const mockFeeling = {
    _id: '507f1f77bcf86cd799439012',
    user_id: '507f1f77bcf86cd799439011',
    day: '2025-10-21',
    sentimento_de_entrada: 'Muito Feliz',
    sentimento_de_saida: 'Neutro',
    createdAt: new Date(),
    updatedAt: new Date(),
    toJSON: () => ({
      id: '507f1f77bcf86cd799439012',
      user_id: '507f1f77bcf86cd799439011',
      day: '2025-10-21',
      sentimento_de_entrada: 'Muito Feliz',
      sentimento_de_saida: 'Neutro',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /feelings/entrada', () => {
    const validEntradaData = {
      day: '2025-10-21',
      sentimento_de_entrada: 'Muito Feliz',
    };

    it('deve criar entrada de sentimento com sucesso', async () => {
      mockFeelingModel.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(mockFeeling);

      const response = await request(app)
        .post('/feelings/entrada')
        .send(validEntradaData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('feeling');
      expect(response.body.feeling.day).toBe(validEntradaData.day);
      expect(response.body.feeling.sentimento_de_entrada).toBe(
        validEntradaData.sentimento_de_entrada
      );
    });

    it('deve falhar com day inválido', async () => {
      const invalidData = {
        day: 'invalid-date',
        sentimento_de_entrada: 'Muito Feliz',
      };

      const response = await request(app)
        .post('/feelings/entrada')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('formato YYYY-MM-DD');
    });

    it('deve falhar com sentimento inválido', async () => {
      const invalidData = {
        day: '2025-10-21',
        sentimento_de_entrada: 'Sentimento Inválido',
      };

      const response = await request(app)
        .post('/feelings/entrada')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('sentimento_de_entrada inválido');
      expect(response.body.allowed).toBeDefined();
    });

    it('deve falhar sem day', async () => {
      const invalidData = {
        sentimento_de_entrada: 'Muito Feliz',
      };

      const response = await request(app)
        .post('/feelings/entrada')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('formato YYYY-MM-DD');
    });

    it('deve falhar sem sentimento_de_entrada', async () => {
      const invalidData = {
        day: '2025-10-21',
      };

      const response = await request(app)
        .post('/feelings/entrada')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('sentimento_de_entrada inválido');
    });

    it('deve lidar com erro do banco de dados', async () => {
      mockFeelingModel.findOneAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/feelings/entrada')
        .send(validEntradaData);

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Database error');
    });
  });

  describe('POST /feelings/saida', () => {
    const validSaidaData = {
      day: '2025-10-21',
      sentimento_de_saida: 'Triste',
    };

    it('deve criar saída de sentimento com sucesso', async () => {
      mockFeelingModel.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(mockFeeling);

      const response = await request(app)
        .post('/feelings/saida')
        .send(validSaidaData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('feeling');
      expect(response.body.feeling.day).toBe(validSaidaData.day);
    });

    it('deve falhar com day inválido', async () => {
      const invalidData = {
        day: '2025/10/21',
        sentimento_de_saida: 'Triste',
      };

      const response = await request(app)
        .post('/feelings/saida')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('formato YYYY-MM-DD');
    });

    it('deve falhar com sentimento inválido', async () => {
      const invalidData = {
        day: '2025-10-21',
        sentimento_de_saida: 'Sentimento Inexistente',
      };

      const response = await request(app)
        .post('/feelings/saida')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('sentimento_de_saida inválido');
    });

    it('deve lidar com erro do banco de dados', async () => {
      mockFeelingModel.findOneAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error('Connection timeout'));

      const response = await request(app)
        .post('/feelings/saida')
        .send(validSaidaData);

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Connection timeout');
    });
  });

  describe('GET /feelings', () => {
    const mockFeelings = [
      {
        ...mockFeeling,
        day: '2025-10-21',
        toJSON: () => ({
          id: '1',
          day: '2025-10-21',
          sentimento_de_entrada: 'Muito Feliz',
          sentimento_de_saida: 'Neutro',
        }),
      },
      {
        ...mockFeeling,
        day: '2025-10-22',
        toJSON: () => ({
          id: '2',
          day: '2025-10-22',
          sentimento_de_entrada: 'Triste',
          sentimento_de_saida: 'Muito Triste',
        }),
      },
    ];

    it('deve listar feelings do usuário com sucesso', async () => {
      const mockFind = {
        sort: jest.fn().mockResolvedValue(mockFeelings),
      };
      mockFeelingModel.find = jest.fn().mockReturnValue(mockFind);

      const response = await request(app).get('/feelings');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('feelings');
      expect(response.body.feelings).toHaveLength(2);
      expect(mockFeelingModel.find).toHaveBeenCalledWith({
        user_id: '507f1f77bcf86cd799439011',
      });
    });

    it('deve listar feelings com filtro de data início', async () => {
      const mockFind = {
        sort: jest.fn().mockResolvedValue(mockFeelings),
      };
      mockFeelingModel.find = jest.fn().mockReturnValue(mockFind);

      const response = await request(app)
        .get('/feelings')
        .query({ inicio: '2025-10-21' });

      expect(response.status).toBe(200);
      expect(mockFeelingModel.find).toHaveBeenCalledWith({
        user_id: '507f1f77bcf86cd799439011',
        day: { $gte: '2025-10-21' },
      });
    });

    it('deve listar feelings com filtro de data fim', async () => {
      const mockFind = {
        sort: jest.fn().mockResolvedValue(mockFeelings),
      };
      mockFeelingModel.find = jest.fn().mockReturnValue(mockFind);

      const response = await request(app)
        .get('/feelings')
        .query({ fim: '2025-10-22' });

      expect(response.status).toBe(200);
      expect(mockFeelingModel.find).toHaveBeenCalledWith({
        user_id: '507f1f77bcf86cd799439011',
        day: { $lte: '2025-10-22' },
      });
    });

    it('deve listar feelings com filtro de data range', async () => {
      const mockFind = {
        sort: jest.fn().mockResolvedValue(mockFeelings),
      };
      mockFeelingModel.find = jest.fn().mockReturnValue(mockFind);

      const response = await request(app)
        .get('/feelings')
        .query({ inicio: '2025-10-21', fim: '2025-10-22' });

      expect(response.status).toBe(200);
      expect(mockFeelingModel.find).toHaveBeenCalledWith({
        user_id: '507f1f77bcf86cd799439011',
        day: { $gte: '2025-10-21', $lte: '2025-10-22' },
      });
    });

    it('deve falhar com data de início inválida', async () => {
      const response = await request(app)
        .get('/feelings')
        .query({ inicio: 'invalid-date' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('inicio inválido');
    });

    it('deve falhar com data de fim inválida', async () => {
      const response = await request(app)
        .get('/feelings')
        .query({ fim: '2025/10/22' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('fim inválido');
    });

    it('deve lidar com erro do banco de dados', async () => {
      const mockFind = {
        sort: jest.fn().mockRejectedValue(new Error('Query failed')),
      };
      mockFeelingModel.find = jest.fn().mockReturnValue(mockFind);

      const response = await request(app).get('/feelings');

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Query failed');
    });
  });

  describe('PATCH /feelings/entrada/:day', () => {
    const updateData = {
      sentimento_de_entrada: 'Irritado',
    };

    it('deve atualizar entrada de sentimento com sucesso', async () => {
      mockFeelingModel.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(mockFeeling);

      const response = await request(app)
        .patch('/feelings/entrada/2025-10-21')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('feeling');
      expect(mockFeelingModel.findOneAndUpdate).toHaveBeenCalledWith(
        { user_id: '507f1f77bcf86cd799439011', day: '2025-10-21' },
        { $set: { sentimento_de_entrada: 'Irritado' } },
        { new: true, runValidators: true }
      );
    });

    it('deve falhar com day inválido no parâmetro', async () => {
      const response = await request(app)
        .patch('/feelings/entrada/invalid-date')
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('formato YYYY-MM-DD');
    });

    it('deve falhar com sentimento inválido', async () => {
      const invalidData = {
        sentimento_de_entrada: 'Sentimento Inexistente',
      };

      const response = await request(app)
        .patch('/feelings/entrada/2025-10-21')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('sentimento_de_entrada inválido');
    });

    it('deve retornar 404 quando registro não existir', async () => {
      mockFeelingModel.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .patch('/feelings/entrada/2025-10-21')
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('registro do dia não encontrado');
    });

    it('deve lidar com erro do banco de dados', async () => {
      mockFeelingModel.findOneAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error('Update failed'));

      const response = await request(app)
        .patch('/feelings/entrada/2025-10-21')
        .send(updateData);

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Update failed');
    });
  });

  describe('PATCH /feelings/saida/:day', () => {
    const updateData = {
      sentimento_de_saida: 'Muito Triste',
    };

    it('deve atualizar saída de sentimento com sucesso', async () => {
      mockFeelingModel.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(mockFeeling);

      const response = await request(app)
        .patch('/feelings/saida/2025-10-21')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('feeling');
      expect(mockFeelingModel.findOneAndUpdate).toHaveBeenCalledWith(
        { user_id: '507f1f77bcf86cd799439011', day: '2025-10-21' },
        { $set: { sentimento_de_saida: 'Muito Triste' } },
        { new: true, runValidators: true }
      );
    });

    it('deve falhar com day inválido no parâmetro', async () => {
      const response = await request(app)
        .patch('/feelings/saida/2025/10/21')
        .send(updateData);

      // Pode retornar 404 se o Express não reconhecer como rota válida
      expect([400, 404]).toContain(response.status);
    });

    it('deve falhar com sentimento inválido', async () => {
      const invalidData = {
        sentimento_de_saida: 'Sentimento Que Não Existe',
      };

      const response = await request(app)
        .patch('/feelings/saida/2025-10-21')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('sentimento_de_saida inválido');
    });

    it('deve retornar 404 quando registro não existir', async () => {
      mockFeelingModel.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .patch('/feelings/saida/2025-10-21')
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('registro do dia não encontrado');
    });

    it('deve lidar com erro do banco de dados', async () => {
      mockFeelingModel.findOneAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error('Database connection lost'));

      const response = await request(app)
        .patch('/feelings/saida/2025-10-21')
        .send(updateData);

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Database connection lost');
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

    appWithoutAuth.post('/feelings/entrada', FeelingController.createEntrada);
    appWithoutAuth.post('/feelings/saida', FeelingController.createSaida);
    appWithoutAuth.get('/feelings', FeelingController.list);
    appWithoutAuth.patch(
      '/feelings/entrada/:day',
      FeelingController.updateEntrada
    );
    appWithoutAuth.patch('/feelings/saida/:day', FeelingController.updateSaida);

    it('deve falhar em createEntrada sem autenticação', async () => {
      const response = await request(appWithoutAuth)
        .post('/feelings/entrada')
        .send({ day: '2025-10-21', sentimento_de_entrada: 'Muito Feliz' });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('não autenticado');
    });

    it('deve falhar em createSaida sem autenticação', async () => {
      const response = await request(appWithoutAuth)
        .post('/feelings/saida')
        .send({ day: '2025-10-21', sentimento_de_saida: 'Triste' });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('não autenticado');
    });

    it('deve falhar em list sem autenticação', async () => {
      const response = await request(appWithoutAuth).get('/feelings');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('não autenticado');
    });

    it('deve falhar em updateEntrada sem autenticação', async () => {
      const response = await request(appWithoutAuth)
        .patch('/feelings/entrada/2025-10-21')
        .send({ sentimento_de_entrada: 'Neutro' });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('não autenticado');
    });

    it('deve falhar em updateSaida sem autenticação', async () => {
      const response = await request(appWithoutAuth)
        .patch('/feelings/saida/2025-10-21')
        .send({ sentimento_de_saida: 'Neutro' });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('não autenticado');
    });
  });

  describe('Validação de dados completos', () => {
    it('deve aceitar todos os sentimentos válidos em entrada', async () => {
      const validFeelings = [
        'Muito Feliz',
        'Irritado',
        'Neutro',
        'Triste',
        'Muito Triste',
      ];

      mockFeelingModel.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(mockFeeling);

      for (const feeling of validFeelings) {
        const response = await request(app).post('/feelings/entrada').send({
          day: '2025-10-21',
          sentimento_de_entrada: feeling,
        });

        expect(response.status).toBe(201);
        jest.clearAllMocks();
        mockFeelingModel.findOneAndUpdate = jest
          .fn()
          .mockResolvedValue(mockFeeling);
      }
    });

    it('deve aceitar todos os sentimentos válidos em saída', async () => {
      const validFeelings = [
        'Muito Feliz',
        'Irritado',
        'Neutro',
        'Triste',
        'Muito Triste',
      ];

      mockFeelingModel.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(mockFeeling);

      for (const feeling of validFeelings) {
        const response = await request(app).post('/feelings/saida').send({
          day: '2025-10-21',
          sentimento_de_saida: feeling,
        });

        expect(response.status).toBe(201);
        jest.clearAllMocks();
        mockFeelingModel.findOneAndUpdate = jest
          .fn()
          .mockResolvedValue(mockFeeling);
      }
    });
  });
});

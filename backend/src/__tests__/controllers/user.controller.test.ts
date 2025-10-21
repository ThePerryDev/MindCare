import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import UsersController from '../../controllers/user.controller';
import UserModel from '../../models/user.model';

// Mock do modelo de usuário
jest.mock('../../models/user.model');
const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;

// Setup do app express para testes
const app = express();
app.use(express.json());

// Rotas para teste
app.post('/users', UsersController.create);
app.get('/users/:id', UsersController.getUserDataById);
app.get('/users', UsersController.list);
app.delete('/users/:id', UsersController.delete);
app.put('/users/:id', UsersController.update);
app.patch('/users/:id/metrics', UsersController.updateMetrics);

describe('Users Controller', () => {
  const mockUser = {
    id: '507f1f77bcf86cd799439011',
    _id: '507f1f77bcf86cd799439011',
    fullName: 'Maria Silva',
    email: 'maria@teste.com',
    phone: '(11)98888-8888',
    birthdate: new Date('1992-05-15'),
    height: 165,
    weight: 60,
    password: 'hashedPassword123',
    save: jest.fn(),
    toJSON: () => ({
      id: '507f1f77bcf86cd799439011',
      fullName: 'Maria Silva',
      email: 'maria@teste.com',
      phone: '(11)98888-8888',
      birthdate: new Date('1992-05-15'),
      height: 165,
      weight: 60,
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /users', () => {
    const validUserData = {
      fullName: 'Maria Silva',
      email: 'maria@teste.com',
      phone: '(11)98888-8888',
      birthdate: '1992-05-15',
      height: 165,
      weight: 60,
      password: 'MinhaSenh@123',
      confirmPassword: 'MinhaSenh@123',
    };

    it('deve criar um novo usuário com sucesso', async () => {
      const savedUser = { ...mockUser };
      savedUser.save.mockResolvedValue(savedUser);

      // Mock do construtor do UserModel
      (UserModel as any).mockImplementation(() => savedUser);

      const response = await request(app).post('/users').send(validUserData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('maria@teste.com');
    });

    it('deve retornar erro quando as senhas não coincidem', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          ...validUserData,
          confirmPassword: 'SenhaDiferente123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('As senhas não coincidem.');
    });

    it('deve retornar erro quando email já está em uso', async () => {
      const savedUser = { ...mockUser };
      const duplicateError = new Error('Duplicate key error');
      (duplicateError as any).code = 11000;
      savedUser.save.mockRejectedValue(duplicateError);

      (UserModel as any).mockImplementation(() => savedUser);

      const response = await request(app).post('/users').send(validUserData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('E-mail já está em uso.');
    });

    it('deve retornar erro de validação do Mongoose', async () => {
      const savedUser = { ...mockUser };
      const validationError = {
        errors: {
          email: { message: 'E-mail inválido' },
          fullName: { message: 'Nome obrigatório' },
        },
      };
      savedUser.save.mockRejectedValue(validationError);

      (UserModel as any).mockImplementation(() => savedUser);

      const response = await request(app)
        .post('/users')
        .send({
          ...validUserData,
          email: 'email-inválido',
          fullName: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual([
        'E-mail inválido',
        'Nome obrigatório',
      ]);
    });

    it('deve retornar erro 500 para outros tipos de erro', async () => {
      const savedUser = { ...mockUser };
      savedUser.save.mockRejectedValue(new Error('Erro interno'));

      (UserModel as any).mockImplementation(() => savedUser);

      const response = await request(app).post('/users').send(validUserData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro interno');
    });

    it('deve usar mensagem padrão quando erro não tem message no create', async () => {
      // Test branch coverage for line 43 - fallback message when e.message is undefined
      const savedUser = { ...mockUser };
      savedUser.save.mockRejectedValue({ code: 'UNKNOWN_ERROR' }); // Error without message

      (UserModel as any).mockImplementation(() => savedUser);

      const response = await request(app).post('/users').send(validUserData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro interno do servidor');
    });
  });

  describe('GET /users/:id', () => {
    it('deve retornar dados do usuário por ID', async () => {
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const response = await request(app).get(
        '/users/507f1f77bcf86cd799439011'
      );

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('507f1f77bcf86cd799439011');
      expect(response.body.email).toBe('maria@teste.com');
    });

    it('deve retornar campos específicos quando especificados na query', async () => {
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          fullName: 'Maria Silva',
          email: 'maria@teste.com',
        }),
      } as any);

      const response = await request(app).get(
        '/users/507f1f77bcf86cd799439011?fields=fullName,email'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('fullName');
      expect(response.body).toHaveProperty('email');
    });

    it('deve retornar dados do usuário com ID inválido', async () => {
      // Testando com ID que causa erro no mongoose
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Cast error')),
      } as any);

      const response = await request(app).get('/users/invalid-id');

      expect(response.status).toBe(500);
    });

    it('deve retornar erro quando usuário não é encontrado', async () => {
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      } as any);

      const response = await request(app).get(
        '/users/507f1f77bcf86cd799439011'
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Usuário não encontrado.');
    });

    it('deve retornar erro 500 quando ocorre erro no servidor', async () => {
      mockUserModel.findById.mockReturnValue({
        select: jest
          .fn()
          .mockRejectedValue(new Error('Erro no banco de dados')),
      } as any);

      const response = await request(app).get(
        '/users/507f1f77bcf86cd799439011'
      );

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro ao buscar dados do usuário.');
    });

    it('deve retornar erro 400 quando ID está vazio', async () => {
      // Testando com parâmetro ID vazio (não undefined, mas string vazia)
      // Como não conseguimos testar ID vazio via URL, vamos testar diretamente

      // Como o Express não consegue routear um ID vazio diretamente,
      // vamos testar com undefined via mock direto
      const req = { params: { id: undefined }, query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const result = await UsersController.getUserDataById(
        req as any,
        res as any
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'O ID do usuário é necessário.',
      });
    });
  });

  describe('GET /users', () => {
    it('deve listar todos os usuários', async () => {
      mockUserModel.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([mockUser]),
      } as any);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].email).toBe('maria@teste.com');
    });

    it('deve retornar array vazio quando não há usuários', async () => {
      mockUserModel.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([]),
      } as any);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('DELETE /users/:id', () => {
    it('deve deletar usuário com sucesso', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue(mockUser as any);

      const response = await request(app).delete(
        '/users/507f1f77bcf86cd799439011'
      );

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('507f1f77bcf86cd799439011');
    });

    it('deve retornar erro quando usuário não é encontrado', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app).delete(
        '/users/507f1f77bcf86cd799439011'
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Registro inexistente');
    });
  });

  describe('PUT /users/:id', () => {
    const updateData = {
      fullName: 'Maria Santos',
      email: 'maria.santos@teste.com',
      phone: '(11)97777-7777',
      birthdate: '1992-05-15',
      height: 168,
      weight: 62,
    };

    it('deve atualizar usuário com sucesso', async () => {
      const updatedUser = {
        id: '507f1f77bcf86cd799439011',
        fullName: 'Maria Santos',
        email: 'maria.santos@teste.com',
        phone: '(11)97777-7777',
        birthdate: new Date('1992-05-15'),
        height: 168,
        weight: 62,
        toJSON: () => ({
          id: '507f1f77bcf86cd799439011',
          fullName: 'Maria Santos',
          email: 'maria.santos@teste.com',
          phone: '(11)97777-7777',
          birthdate: new Date('1992-05-15'),
          height: 168,
          weight: 62,
        }),
      };

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(updatedUser),
      } as any);

      const response = await request(app)
        .put('/users/507f1f77bcf86cd799439011')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.fullName).toBe('Maria Santos');
      expect(response.body.email).toBe('maria.santos@teste.com');
    });

    it('deve atualizar senha quando fornecida', async () => {
      const updateDataWithPassword = {
        ...updateData,
        password: 'NovaSenha@123',
        confirmPassword: 'NovaSenha@123',
      };

      const updatedUser = { ...mockUser, ...updateData };
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(updatedUser),
      } as any);

      const response = await request(app)
        .put('/users/507f1f77bcf86cd799439011')
        .send(updateDataWithPassword);

      expect(response.status).toBe(200);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        expect.objectContaining({
          password: expect.any(String), // Senha deve estar hasheada
        }),
        expect.any(Object)
      );
    });

    it('deve retornar erro quando senhas não coincidem', async () => {
      const response = await request(app)
        .put('/users/507f1f77bcf86cd799439011')
        .send({
          ...updateData,
          password: 'NovaSenha@123',
          confirmPassword: 'SenhaDiferente@123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('As senhas não coincidem.');
    });

    it('deve retornar erro quando usuário não é encontrado', async () => {
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      } as any);

      const response = await request(app)
        .put('/users/507f1f77bcf86cd799439011')
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Registro inexistente');
    });

    it('deve retornar erro quando email já está em uso', async () => {
      const duplicateError = new Error('Duplicate key error');
      (duplicateError as any).code = 11000;
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockRejectedValue(duplicateError),
      } as any);

      const response = await request(app)
        .put('/users/507f1f77bcf86cd799439011')
        .send({ ...updateData, email: 'outro@teste.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'O e-mail outro@teste.com já está em uso.'
      );
    });

    it('deve retornar erro de validação mongoose', async () => {
      const validationError = {
        errors: {
          email: { message: 'Email é obrigatório' },
          fullName: { message: 'Nome completo é obrigatório' },
        },
      };

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockRejectedValue(validationError),
      } as any);

      const response = await request(app)
        .put('/users/507f1f77bcf86cd799439011')
        .send({ email: '' });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual([
        'Email é obrigatório',
        'Nome completo é obrigatório',
      ]);
    });

    it('deve retornar erro genérico 500 para erros não tratados', async () => {
      const genericError = new Error('Erro de conexão com o banco');

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockRejectedValue(genericError),
      } as any);

      const response = await request(app)
        .put('/users/507f1f77bcf86cd799439011')
        .send({ fullName: 'Nome Teste' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro de conexão com o banco');
    });

    it('deve usar mensagem padrão quando erro não tem message no update', async () => {
      // Test branch coverage for line 127 - fallback message when e.message is undefined
      const errorWithoutMessage = { code: 'UNKNOWN_ERROR' };

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockRejectedValue(errorWithoutMessage),
      } as any);

      const response = await request(app)
        .put('/users/507f1f77bcf86cd799439011')
        .send({ fullName: 'Nome Teste' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro ao atualizar usuário.');
    });
  });

  describe('PATCH /users/:id/metrics', () => {
    const metricsData = {
      height: 170,
      weight: 65,
      birthdate: '1992-06-01',
      fullName: 'Maria Silva Santos',
      phone: '(11)96666-6666',
    };

    it('deve atualizar métricas do usuário com sucesso', async () => {
      const userInstance = { ...mockUser };
      userInstance.save.mockResolvedValue(userInstance);
      mockUserModel.findById.mockResolvedValue(userInstance as any);

      const response = await request(app)
        .patch('/users/507f1f77bcf86cd799439011/metrics')
        .send(metricsData);

      expect(response.status).toBe(200);
      expect(userInstance.height).toBe(170);
      expect(userInstance.weight).toBe(65);
      expect(userInstance.save).toHaveBeenCalled();
    });

    it('deve atualizar apenas campos válidos fornecidos', async () => {
      const userInstance = { ...mockUser };
      userInstance.save.mockResolvedValue(userInstance);
      mockUserModel.findById.mockResolvedValue(userInstance as any);

      const response = await request(app)
        .patch('/users/507f1f77bcf86cd799439011/metrics')
        .send({ height: 175 }); // Apenas altura

      expect(response.status).toBe(200);
      expect(userInstance.height).toBe(175);
      expect(userInstance.weight).toBe(60); // Valor original mantido
    });

    it('deve retornar erro quando usuário não é encontrado', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      const response = await request(app)
        .patch('/users/507f1f77bcf86cd799439011/metrics')
        .send(metricsData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Usuário não encontrado');
    });

    it('deve retornar erro 500 quando ocorre erro no servidor', async () => {
      mockUserModel.findById.mockRejectedValue(
        new Error('Erro no banco de dados')
      );

      const response = await request(app)
        .patch('/users/507f1f77bcf86cd799439011/metrics')
        .send(metricsData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro ao atualizar os dados.');
    });

    it('deve ignorar campos que não são do tipo correto', async () => {
      const userInstance = { ...mockUser };
      userInstance.save.mockResolvedValue(userInstance);
      mockUserModel.findById.mockResolvedValue(userInstance as any);

      const response = await request(app)
        .patch('/users/507f1f77bcf86cd799439011/metrics')
        .send({
          height: 'not-a-number', // Tipo inválido
          weight: 65, // Tipo válido
        });

      expect(response.status).toBe(200);
      expect(userInstance.height).toBe(165); // Valor original mantido
      expect(userInstance.weight).toBe(65); // Valor atualizado
    });
  });
});

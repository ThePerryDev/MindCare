import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser'; // ✅ import correto
import {
  register,
  login,
  refresh,
  logout,
} from '../../controllers/auth.controller';
import UserModel from '../../models/user.model';

// Mock do modelo de usuário
jest.mock('../../models/user.model');
const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;

// Setup do app express para testes
const app = express();
app.use(express.json());
app.use(cookieParser()); // ✅ sem require()

// Rotas para teste
app.post('/register', register);
app.post('/login', login);
app.post('/refresh', refresh);
app.post('/logout', logout);

describe('Auth Controller', () => {
  const mockUser = {
    id: '507f1f77bcf86cd799439011',
    fullName: 'João Silva',
    email: 'joao@teste.com',
    phone: '(11)99999-9999',
    birthdate: new Date('1990-01-01'),
    height: 175,
    weight: 70,
    password: 'hashedPassword123',
    toJSON: () => ({
      id: '507f1f77bcf86cd799439011',
      fullName: 'João Silva',
      email: 'joao@teste.com',
      phone: '(11)99999-9999',
      birthdate: new Date('1990-01-01'),
      height: 175,
      weight: 70,
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    const validRegistrationData = {
      fullName: 'João Silva',
      email: 'joao@teste.com',
      phone: '(11)99999-9999',
      birthdate: '1990-01-01',
      height: 175,
      weight: 70,
      password: 'MinhaSenh@123',
      confirmPassword: 'MinhaSenh@123',
    };

    it('deve registrar um novo usuário com sucesso', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockUser as any);

      const response = await request(app)
        .post('/register')
        .send(validRegistrationData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user.email).toBe('joao@teste.com');
    });

    it('deve retornar erro quando campos obrigatórios estão ausentes', async () => {
      const response = await request(app).post('/register').send({
        email: 'joao@teste.com',
        password: 'MinhaSenh@123',
        // fullName ausente
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        'fullName, email e password são obrigatórios'
      );
    });

    it('deve retornar erro quando as senhas não coincidem', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          ...validRegistrationData,
          confirmPassword: 'SenhaDiferente123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('As senhas não coincidem');
    });

    it('deve retornar erro quando o email já existe', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser as any);

      const response = await request(app)
        .post('/register')
        .send(validRegistrationData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('E-mail já cadastrado');
    });

    it('deve retornar erro 500 quando ocorre erro no servidor', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockRejectedValue(
        new Error('Erro no banco de dados')
      );

      const response = await request(app)
        .post('/register')
        .send(validRegistrationData);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    it('deve usar mensagem de erro padrão quando err.message é undefined no register', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      // Simulate error without message property to test branch coverage line 68
      const errorWithoutMessage = { code: 'UNKNOWN_ERROR' };
      mockUserModel.create.mockRejectedValue(errorWithoutMessage);

      const response = await request(app)
        .post('/register')
        .send(validRegistrationData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro interno do servidor');
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /login', () => {
    const validLoginData = {
      email: 'joao@teste.com',
      password: 'MinhaSenh@123',
    };

    it('deve fazer login com sucesso', async () => {
      const userWithPassword = { ...mockUser, password: 'hashedPassword123' };
      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(userWithPassword),
      } as any);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const response = await request(app).post('/login').send(validLoginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('deve retornar erro quando campos obrigatórios estão ausentes', async () => {
      const response = await request(app).post('/login').send({
        email: 'joao@teste.com',
        // password ausente
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('email e password são obrigatórios');
    });

    it('deve retornar erro quando usuário não é encontrado', async () => {
      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      } as any);

      const response = await request(app).post('/login').send(validLoginData);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('usuário não encontrado');
    });

    it('deve retornar erro quando a senha está incorreta', async () => {
      const userWithPassword = { ...mockUser, password: 'hashedPassword123' };
      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(userWithPassword),
      } as any);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const response = await request(app).post('/login').send(validLoginData);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('credenciais inválidas');
    });

    it('deve retornar erro 500 quando ocorre erro no servidor', async () => {
      mockUserModel.findOne.mockReturnValue({
        select: jest
          .fn()
          .mockRejectedValue(new Error('Erro no banco de dados')),
      } as any);

      const response = await request(app).post('/login').send(validLoginData);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    it('deve usar mensagem de erro padrão quando err.message é undefined no login', async () => {
      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockRejectedValue({ code: 'UNKNOWN_ERROR' }), // Error without message
      } as any);

      const response = await request(app).post('/login').send(validLoginData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('erro ao fazer login');
    });
  });

  describe('POST /refresh', () => {
    it('deve renovar o token com sucesso', async () => {
      const validToken = jwt.sign(
        { sub: mockUser.id },
        process.env.JWT_REFRESH_SECRET!
      );
      mockUserModel.findById.mockResolvedValue(mockUser as any);

      const response = await request(app)
        .post('/refresh')
        .set('Cookie', [`refreshToken=${validToken}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });

    it('deve usar TTL padrão quando variáveis de ambiente não estão definidas', async () => {
      // Test branch coverage for default TTL values
      const originalAccessTTL = process.env.ACCESS_TOKEN_TTL;
      const originalRefreshTTL = process.env.REFRESH_TOKEN_TTL;

      delete process.env.ACCESS_TOKEN_TTL;
      delete process.env.REFRESH_TOKEN_TTL;

      const validToken = jwt.sign(
        { sub: mockUser.id },
        process.env.JWT_REFRESH_SECRET!
      );
      mockUserModel.findById.mockResolvedValue(mockUser as any);

      const response = await request(app)
        .post('/refresh')
        .set('Cookie', [`refreshToken=${validToken}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');

      // Restore environment
      process.env.ACCESS_TOKEN_TTL = originalAccessTTL;
      process.env.REFRESH_TOKEN_TTL = originalRefreshTTL;
    });

    it('deve configurar cookie com domínio quando variável de ambiente está definida', async () => {
      // Test branch coverage for domain cookie configuration
      const originalDomain = process.env.REFRESH_COOKIE_DOMAIN;
      process.env.REFRESH_COOKIE_DOMAIN = 'example.com';

      const validToken = jwt.sign(
        { sub: mockUser.id },
        process.env.JWT_REFRESH_SECRET!
      );
      mockUserModel.findById.mockResolvedValue(mockUser as any);

      const response = await request(app)
        .post('/refresh')
        .set('Cookie', [`refreshToken=${validToken}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.headers['set-cookie']).toBeTruthy();

      // Restore environment
      process.env.REFRESH_COOKIE_DOMAIN = originalDomain;
    });

    it('deve retornar erro quando refresh token está ausente', async () => {
      const response = await request(app).post('/refresh');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('refresh token ausente');
    });

    it('deve retornar erro quando usuário não é encontrado', async () => {
      const validToken = jwt.sign(
        { sub: 'invalidUserId' },
        process.env.JWT_REFRESH_SECRET!
      );
      mockUserModel.findById.mockResolvedValue(null);

      const response = await request(app)
        .post('/refresh')
        .set('Cookie', [`refreshToken=${validToken}`]);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('usuário não encontrado');
    });

    it('deve retornar erro quando refresh token é inválido', async () => {
      const response = await request(app)
        .post('/refresh')
        .set('Cookie', ['refreshToken=invalidToken']);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('refresh token inválido ou expirado');
    });
  });

  describe('POST /logout', () => {
    it('deve fazer logout com sucesso', async () => {
      const response = await request(app).post('/logout');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('logout efetuado');
    });
  });
});

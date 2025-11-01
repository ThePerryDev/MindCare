import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Utilitários para testes
 */

// Dados de usuário válidos para usar nos testes
export const validUserData = {
  fullName: 'Usuário Teste',
  email: 'usuario@teste.com',
  phone: '(11)99999-9999',
  birthdate: '1990-01-01',
  height: 175,
  weight: 70,
  password: 'MinhaSenh@123',
  confirmPassword: 'MinhaSenh@123',
};

// Dados de usuário inválidos para testes de validação
export const invalidUserData = {
  emailInvalido: {
    ...validUserData,
    email: 'email-invalido',
  },
  nomeVazio: {
    ...validUserData,
    fullName: '',
  },
  phoneInvalido: {
    ...validUserData,
    phone: '123',
  },
  senhaFraca: {
    ...validUserData,
    password: '123',
    confirmPassword: '123',
  },
  senhasNaoCoincidem: {
    ...validUserData,
    password: 'MinhaSenh@123',
    confirmPassword: 'OutraSenh@456',
  },
  alturaInvalida: {
    ...validUserData,
    height: -10,
  },
  pesoInvalido: {
    ...validUserData,
    weight: 0,
  },
};

// Mock de usuário para usar nos testes
export const createMockUser = (overrides = {}) => ({
  id: '507f1f77bcf86cd799439011',
  _id: '507f1f77bcf86cd799439011',
  fullName: 'Usuário Teste',
  email: 'usuario@teste.com',
  phone: '(11)99999-9999',
  birthdate: new Date('1990-01-01'),
  height: 175,
  weight: 70,
  password: 'hashedPassword123',
  createdAt: new Date(),
  updatedAt: new Date(),
  save: jest.fn(),
  toJSON: function () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, _id, ...user } = this;
    return { ...user, id: this._id };
  },
  ...overrides,
});

// Função para criar tokens JWT válidos para testes
export const createValidTokens = (
  userId = '507f1f77bcf86cd799439011',
  email = 'usuario@teste.com'
) => {
  const accessToken = jwt.sign(
    { sub: userId, email },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { sub: userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Função para criar senha hasheada para testes
export const createHashedPassword = async (password = 'MinhaSenh@123') => {
  return await bcrypt.hash(password, 10);
};

// Headers de autenticação para testes
export const createAuthHeaders = (token?: string) => {
  if (!token) {
    const { accessToken } = createValidTokens();
    token = accessToken;
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Função para limpar campos de data de um objeto (útil para comparações)
export const sanitizeDates = (obj: any) => {
  if (obj.birthdate) {
    obj.birthdate = new Date(obj.birthdate).toISOString();
  }
  if (obj.createdAt) {
    obj.createdAt = new Date(obj.createdAt).toISOString();
  }
  if (obj.updatedAt) {
    obj.updatedAt = new Date(obj.updatedAt).toISOString();
  }
  return obj;
};

// IDs de teste válidos do MongoDB
export const testIds = {
  valid: '507f1f77bcf86cd799439011',
  invalid: 'invalid-id',
  nonExistent: '507f1f77bcf86cd799439012',
};

// Códigos de erro comuns para testes
export const errorCodes = {
  DUPLICATE_KEY: 11000,
  VALIDATION_ERROR: 'ValidationError',
  CAST_ERROR: 'CastError',
};

// Mensagens de erro comuns
export const errorMessages = {
  EMAIL_REQUIRED: 'O e-mail é obrigatório',
  PASSWORD_REQUIRED: 'A senha é obrigatória',
  NAME_REQUIRED: 'O nome completo é obrigatório',
  PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
  EMAIL_ALREADY_EXISTS: 'E-mail já cadastrado',
  USER_NOT_FOUND: 'usuário não encontrado',
  INVALID_CREDENTIALS: 'credenciais inválidas',
  INVALID_TOKEN: 'Token inválido',
  MISSING_TOKEN: 'Token ausente',
};

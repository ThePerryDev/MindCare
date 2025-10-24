"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessages = exports.errorCodes = exports.testIds = exports.sanitizeDates = exports.createAuthHeaders = exports.createHashedPassword = exports.createValidTokens = exports.createMockUser = exports.invalidUserData = exports.validUserData = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Utilitários para testes
 */
// Dados de usuário válidos para usar nos testes
exports.validUserData = {
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
exports.invalidUserData = {
    emailInvalido: {
        ...exports.validUserData,
        email: 'email-invalido',
    },
    nomeVazio: {
        ...exports.validUserData,
        fullName: '',
    },
    phoneInvalido: {
        ...exports.validUserData,
        phone: '123',
    },
    senhaFraca: {
        ...exports.validUserData,
        password: '123',
        confirmPassword: '123',
    },
    senhasNaoCoincidem: {
        ...exports.validUserData,
        password: 'MinhaSenh@123',
        confirmPassword: 'OutraSenh@456',
    },
    alturaInvalida: {
        ...exports.validUserData,
        height: -10,
    },
    pesoInvalido: {
        ...exports.validUserData,
        weight: 0,
    },
};
// Mock de usuário para usar nos testes
const createMockUser = (overrides = {}) => ({
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
        const { password, _id, ...user } = this;
        return { ...user, id: this._id };
    },
    ...overrides,
});
exports.createMockUser = createMockUser;
// Função para criar tokens JWT válidos para testes
const createValidTokens = (userId = '507f1f77bcf86cd799439011', email = 'usuario@teste.com') => {
    const accessToken = jsonwebtoken_1.default.sign({ sub: userId, email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};
exports.createValidTokens = createValidTokens;
// Função para criar senha hasheada para testes
const createHashedPassword = async (password = 'MinhaSenh@123') => {
    return await bcrypt_1.default.hash(password, 10);
};
exports.createHashedPassword = createHashedPassword;
// Headers de autenticação para testes
const createAuthHeaders = (token) => {
    if (!token) {
        const { accessToken } = (0, exports.createValidTokens)();
        token = accessToken;
    }
    return {
        Authorization: `Bearer ${token}`,
    };
};
exports.createAuthHeaders = createAuthHeaders;
// Função para limpar campos de data de um objeto (útil para comparações)
const sanitizeDates = (obj) => {
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
exports.sanitizeDates = sanitizeDates;
// IDs de teste válidos do MongoDB
exports.testIds = {
    valid: '507f1f77bcf86cd799439011',
    invalid: 'invalid-id',
    nonExistent: '507f1f77bcf86cd799439012',
};
// Códigos de erro comuns para testes
exports.errorCodes = {
    DUPLICATE_KEY: 11000,
    VALIDATION_ERROR: 'ValidationError',
    CAST_ERROR: 'CastError',
};
// Mensagens de erro comuns
exports.errorMessages = {
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

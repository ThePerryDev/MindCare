"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_middleware_1 = require("../../security/auth.middleware");
// Mock do jwt
jest.mock('jsonwebtoken');
const mockJwt = jsonwebtoken_1.default;
describe('Auth Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    beforeEach(() => {
        mockReq = {
            headers: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });
    describe('authGuard', () => {
        it('deve aceitar token válido', () => {
            // Arrange
            const payload = {
                sub: '507f1f77bcf86cd799439011',
                email: 'user@test.com',
            };
            mockReq.headers = { authorization: 'Bearer valid-token' };
            mockJwt.verify.mockReturnValue(payload);
            // Act
            (0, auth_middleware_1.authGuard)(mockReq, mockRes, mockNext);
            // Assert
            expect(mockReq.user).toEqual({
                sub: payload.sub,
                email: payload.email,
            });
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });
        it('deve rejeitar quando token está ausente', () => {
            // Arrange
            mockReq.headers = {}; // Sem authorization header
            // Act
            (0, auth_middleware_1.authGuard)(mockReq, mockRes, mockNext);
            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'token ausente' });
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('deve rejeitar quando authorization header está vazio', () => {
            // Arrange
            mockReq.headers = { authorization: '' };
            // Act
            (0, auth_middleware_1.authGuard)(mockReq, mockRes, mockNext);
            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'token ausente' });
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('deve rejeitar quando authorization header não tem Bearer', () => {
            // Arrange
            mockReq.headers = { authorization: 'InvalidFormat' }; // Sem espaço nem token
            // Act
            (0, auth_middleware_1.authGuard)(mockReq, mockRes, mockNext);
            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'token ausente' });
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('deve rejeitar token inválido', () => {
            // Arrange
            mockReq.headers = { authorization: 'Bearer invalid-token' };
            mockJwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });
            // Act
            (0, auth_middleware_1.authGuard)(mockReq, mockRes, mockNext);
            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'token inválido ou expirado',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('deve rejeitar token expirado', () => {
            // Arrange
            mockReq.headers = { authorization: 'Bearer expired-token' };
            mockJwt.verify.mockImplementation(() => {
                throw new Error('TokenExpiredError');
            });
            // Act
            (0, auth_middleware_1.authGuard)(mockReq, mockRes, mockNext);
            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'token inválido ou expirado',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('deve funcionar com token válido sem email', () => {
            // Arrange
            const payload = { sub: '507f1f77bcf86cd799439011' }; // Sem email
            mockReq.headers = { authorization: 'Bearer valid-token-no-email' };
            mockJwt.verify.mockReturnValue(payload);
            // Act
            (0, auth_middleware_1.authGuard)(mockReq, mockRes, mockNext);
            // Assert
            expect(mockReq.user).toEqual({
                sub: payload.sub,
                email: undefined,
            });
            expect(mockNext).toHaveBeenCalled();
        });
    });
});

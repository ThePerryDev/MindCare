// src/routes/auth.routes.ts

import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  requestPasswordResetCode,
  verifyPasswordResetCode,
  resetPassword,
} from '../controllers/auth.controller';

const router = Router();
router.post('/register', register); // Registro com criação de usuário e emissão de tokens (POST /auth/register)
router.post('/login', login); // Login com verificação de credenciais e emissão de tokens (POST /auth/login)
router.post('/refresh', refresh); // Renovação do access token usando refresh token em cookie HttpOnly (POST /auth/refresh)
router.post('/logout', logout); // Logout e limpando o cookie de refresh (POST /auth/logout)
router.post('/forgot-password/request-code', requestPasswordResetCode); // Solicita o código de verificação para resetar senha (POST /auth/forgot-password/request-code)
router.post('/forgot-password/verify-code', verifyPasswordResetCode); // Verifica o código de verificação para resetar senha (POST /auth/forgot-password/verify-code)
router.post('/forgot-password/reset', resetPassword); // Reseta a senha (POST /auth/forgot-password/reset)
export default router;

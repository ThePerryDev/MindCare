// src/security/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: { sub: string; email?: string };
}

export function authGuard(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' '); // Bearer <token>

  console.log('[AUTH GUARD] Header Authorization recebido:', header);

  // ✅ BYPASS EM AMBIENTE DE DESENVOLVIMENTO
  if (process.env.NODE_ENV !== 'production') {
    if (token === 'dev-token') {
      console.log(
        '🟢 [AUTH GUARD] dev-token detectado, usando usuário fake DEV_USER_ID'
      );
      req.user = {
        sub: 'DEV_USER_ID',
        email: 'dev@example.com',
      };
      return next();
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'token ausente' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;

    console.log('🟢 [AUTH GUARD] Payload JWT decodificado:', payload);

    req.user = { sub: payload.sub, email: payload.email };
    return next();
  } catch (err) {
    console.error('[AUTH GUARD] Erro ao verificar token:', err);
    return res.status(401).json({ error: 'token inválido ou expirado' });
  }
}

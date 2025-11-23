import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: { sub: string; email?: string };
}

export function authGuard(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' '); // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'token ausente' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = { sub: payload.sub, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ error: 'token inválido ou expirado' });
  }
}
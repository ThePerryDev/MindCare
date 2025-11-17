import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: { sub: string; email?: string };
}

export function authGuard(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' '); // Bearer <token>
<<<<<<< HEAD

  if (!token) {
    return res.status(401).json({ error: 'token ausente' });
  }

=======
  if (!token) return res.status(401).json({ error: 'token ausente' });
>>>>>>> 89fbd3b9cb5788ac8e705b6e09d6cffbe03595a8
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = { sub: payload.sub, email: payload.email };
    return next();
<<<<<<< HEAD
  } catch {
=======
  } catch (_e) {
>>>>>>> 89fbd3b9cb5788ac8e705b6e09d6cffbe03595a8
    return res.status(401).json({ error: 'token inválido ou expirado' });
  }
}

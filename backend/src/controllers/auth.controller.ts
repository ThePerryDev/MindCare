import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';

const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TTL = process.env.REFRESH_TOKEN_TTL || '7d';
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string | undefined;
const isProd = process.env.NODE_ENV === 'production';

function setRefreshCookie(res: Response, token: string) {
  const domain = process.env.REFRESH_COOKIE_DOMAIN || undefined;
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/api/v1/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    ...(domain ? { domain } : {}),
  });
}

function signAccess(payload: object) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TTL } as any);
}

function signRefresh(payload: object) {
  if (!JWT_REFRESH_SECRET) {
    // em vez de quebrar, só avisa
    console.warn(
      '[AUTH] JWT_REFRESH_SECRET não configurado, não vou gerar refresh token'
    );
    return null;
  }
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TTL,
  } as any);
}

export const register = async (req: Request, res: Response) => {
  console.log('[AUTH] POST /api/v1/auth/register body:', req.body);
  try {
    const {
      fullName,
      email,
      phone,
      birthdate,
      height,
      weight,
      password,
      confirmPassword,
    } = req.body;

    if (!email || !password || !fullName) {
      return res
        .status(400)
        .json({ error: 'fullName, email e password são obrigatórios' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'As senhas não coincidem' });
    }

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      fullName,
      email,
      phone,
      birthdate,
      height,
      weight,
      password: hash,
    });

    const accessToken = signAccess({ sub: user.id, email: user.email });
    const refreshToken = signRefresh({ sub: user.id });

    if (refreshToken) {
      setRefreshCookie(res, refreshToken);
    }

    const safeUser = user.toJSON();
    console.log('[AUTH] register -> usuário criado com sucesso:', safeUser.id);

    return res.status(201).json({ user: safeUser, accessToken });
  } catch (err: any) {
    console.error('[AUTH] erro no register:', err);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: err?.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log('[AUTH] POST /api/v1/auth/login body:', req.body);
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'email e password são obrigatórios' });
    }

    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      console.log('[AUTH] login -> usuário não encontrado:', email);
      return res.status(404).json({ error: 'usuário não encontrado' });
    }

    const ok = await bcrypt.compare(
      password,
      user.password as unknown as string
    );
    if (!ok) {
      console.log('[AUTH] login -> senha inválida para:', email);
      return res.status(401).json({ error: 'credenciais inválidas' });
    }

    console.log('[AUTH] login -> login bem-sucedido para:', email);

    const accessToken = signAccess({ sub: user.id, email: user.email });
    const refreshToken = signRefresh({ sub: user.id });

    if (refreshToken) {
      setRefreshCookie(res, refreshToken);
    }

    const safe = user.toJSON();
    return res.status(200).json({ user: safe, accessToken });
  } catch (err: any) {
    console.error('[AUTH] erro no login:', err);
    return res
      .status(500)
      .json({ error: err.message || 'erro ao fazer login' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  console.log(
    '[AUTH] POST /api/v1/auth/refresh cookies:'
    , req.cookies);
  try {
    if (!JWT_REFRESH_SECRET) {
      console.warn('[AUTH] refresh -> sem JWT_REFRESH_SECRET, não dá pra renovar');
      return res.status(400).json({ error: 'refresh indisponível' });
    }

    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) return res.status(401).json({ error: 'refresh token ausente' });

    const payload = jwt.verify(token, JWT_REFRESH_SECRET) as { sub: string };
    const user = await UserModel.findById(payload.sub);
    if (!user) return res.status(404).json({ error: 'usuário não encontrado' });

    const accessToken = signAccess({ sub: user.id, email: user.email });
    const newRefresh = signRefresh({ sub: user.id });
    if (newRefresh) {
      setRefreshCookie(res, newRefresh);
    }

    return res.status(200).json({ accessToken });
  } catch (err: any) {
    console.error('[AUTH] erro no refresh:', err);
    return res
      .status(401)
      .json({ error: 'refresh token inválido ou expirado' });
  }
};

export const logout = async (_req: Request, res: Response) => {
  console.log('[AUTH] POST /api/v1/auth/logout');
  res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
  return res.status(200).json({ message: 'logout efetuado' });
};

//heclair

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';

const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TTL = process.env.REFRESH_TOKEN_TTL || '7d';
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
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
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TTL } as any);
}
function signRefresh(payload: object) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TTL,
  } as any);
}

export const register = async (req: Request, res: Response) => {
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
    if (!email || !password || !fullName)
      return res
        .status(400)
        .json({ error: 'fullName, email e password são obrigatórios' });
    if (password !== confirmPassword)
      return res.status(400).json({ error: 'As senhas não coincidem' });
    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(400).json({ error: 'E-mail já cadastrado' });
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
    setRefreshCookie(res, refreshToken);
    const safeUser = user.toJSON();
    return res.status(201).json({ user: safeUser, accessToken });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password)
      return res
        .status(400)
        .json({ error: 'email e password são obrigatórios' });
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ error: 'usuário não encontrado' });
    const ok = await bcrypt.compare(
      password,
      user.password as unknown as string
    );
    if (!ok) return res.status(401).json({ error: 'credenciais inválidas' });
    const accessToken = signAccess({ sub: user.id, email: user.email });
    const refreshToken = signRefresh({ sub: user.id });
    setRefreshCookie(res, refreshToken);
    const safe = user.toJSON();
    return res.status(200).json({ user: safe, accessToken });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || 'erro ao fazer login' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) return res.status(401).json({ error: 'refresh token ausente' });
    const payload = jwt.verify(token, JWT_REFRESH_SECRET) as { sub: string };
    const user = await UserModel.findById(payload.sub);
    if (!user) return res.status(404).json({ error: 'usuário não encontrado' });
    const accessToken = signAccess({ sub: user.id, email: user.email });
    const newRefresh = signRefresh({ sub: user.id });
    setRefreshCookie(res, newRefresh);
    return res.status(200).json({ accessToken });
  } catch (_e) {
    return res
      .status(401)
      .json({ error: 'refresh token inválido ou expirado' });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
  return res.status(200).json({ message: 'logout efetuado' });
};

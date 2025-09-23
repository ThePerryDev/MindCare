// controllers/authController.ts
import { Request, Response } from 'express';
import { User } from '../models/User';

type RegisterBody = {
  authId: string;
  email?: string;
  phone?: string;
  name?: string;
  timezone?: string;
  consentVersion?: string;
};

/**
 * POST /auth/register
 * body: { authId, email?, phone?, name?, timezone?, consentVersion }
 */
export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  try {
    const { authId, email, phone, name, timezone, consentVersion } = req.body;

    if (!authId) return res.status(400).json({ error: 'authId é obrigatório' });

    let user = await User.findOne({ authId });
    if (user) {
      // idempotente: já existe, retorna perfil
      return res.status(200).json({ user });
    }

    user = await User.create({
      authId,
      email,
      phone,
      name,
      timezone: timezone || 'America/Sao_Paulo',
      consentVersion: consentVersion || null,
      notificationPrefs: { dailyTime: '19:00', muted: false },
    });

    return res.status(201).json({ user });
  } catch (err) {
    console.error('register error', err);
    return res.status(500).json({ error: 'erro ao registrar' });
  }
};

type LoginBody = { authId: string };

/**
 * POST /auth/login
 * body: { authId }
 * Retorna o perfil do usuário para sessão do app.
 */
export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { authId } = req.body;
    if (!authId) return res.status(400).json({ error: 'authId é obrigatório' });

    const user = await User.findOne({ authId });
    if (!user) return res.status(404).json({ error: 'usuário não encontrado' });

    return res.status(200).json({ user });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ error: 'erro ao fazer login' });
  }
};

type AcceptConsentBody = { authId: string; consentVersion: string };

/**
 * POST /auth/accept-consent
 * body: { authId, consentVersion }
 */
export const acceptConsent = async (
  req: Request<{}, {}, AcceptConsentBody>,
  res: Response
) => {
  try {
    const { authId, consentVersion } = req.body;
    if (!authId || !consentVersion) {
      return res
        .status(400)
        .json({ error: 'authId e consentVersion são obrigatórios' });
    }
    const user = await User.findOneAndUpdate(
      { authId },
      { $set: { consentVersion } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'usuário não encontrado' });
    return res.status(200).json({ user });
  } catch (err) {
    console.error('acceptConsent error', err);
    return res.status(500).json({ error: 'erro ao registrar consentimento' });
  }
};

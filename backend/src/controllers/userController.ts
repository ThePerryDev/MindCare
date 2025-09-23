// controllers/userController.ts
import { Request, Response } from 'express';
import { User } from '../models/User';

/**
 * GET /user/me?authId=...
 */
export const getMe = async (req: Request, res: Response) => {
  try {
    const authId = String(req.query.authId || '');
    if (!authId) return res.status(400).json({ error: 'authId é obrigatório' });
    const user = await User.findOne({ authId });
    if (!user) return res.status(404).json({ error: 'usuário não encontrado' });
    return res.status(200).json({ user });
  } catch (err) {
    console.error('getMe error', err);
    return res.status(500).json({ error: 'erro ao obter perfil' });
  }
};

/**
 * PATCH /user/profile
 * body: { authId, name?, timezone? }
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { authId, name, timezone } = req.body as {
      authId?: string;
      name?: string;
      timezone?: string;
    };
    if (!authId) return res.status(400).json({ error: 'authId é obrigatório' });

    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (timezone !== undefined) update.timezone = timezone;

    const user = await User.findOneAndUpdate(
      { authId },
      { $set: update },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'usuário não encontrado' });
    return res.status(200).json({ user });
  } catch (err) {
    console.error('updateProfile error', err);
    return res.status(500).json({ error: 'erro ao atualizar perfil' });
  }
};

/**
 * PATCH /user/notifications
 * body: { authId, dailyTime?, muted?, muteUntil? }
 */
export const updateNotifications = async (req: Request, res: Response) => {
  try {
    const { authId, dailyTime, muted, muteUntil } = req.body as {
      authId?: string;
      dailyTime?: string;
      muted?: boolean;
      muteUntil?: Date;
    };
    if (!authId) return res.status(400).json({ error: 'authId é obrigatório' });

    const set: Record<string, unknown> = {};
    if (dailyTime !== undefined) set['notificationPrefs.dailyTime'] = dailyTime;
    if (muted !== undefined) set['notificationPrefs.muted'] = muted;
    if (muteUntil !== undefined) set['notificationPrefs.muteUntil'] = muteUntil;

    const user = await User.findOneAndUpdate(
      { authId },
      { $set: set },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'usuário não encontrado' });
    return res.status(200).json({ user });
  } catch (err) {
    console.error('updateNotifications error', err);
    return res.status(500).json({ error: 'erro ao atualizar notificações' });
  }
};

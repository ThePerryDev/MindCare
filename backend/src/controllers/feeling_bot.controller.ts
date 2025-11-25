// src/controllers/feeling_bot.controller.ts

import { Response } from 'express';
import FeelingBotModel from '../models/feeling_bot.model';
import { AuthRequest } from '../security/auth.middleware';
import moment from 'moment';

/**
 * POST /api/v1/feeling-bot
 * Body opcional:
 *  - day?: 'YYYY-MM-DD' (se não vier, usa hoje)
 *  - sentimento: string (emoção vinda da API do bot)
 *  - label?: string (ex.: '23/11/2025' ou 'Hoje', opcional)
 *
 * Faz upsert no mapa days[day] para o usuário logado.
 */
async function upsertDay(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId)
      return res.status(401).json({ error: 'usuário não autenticado' });

    const { day, sentimento, label } = req.body || {};

    if (!sentimento || typeof sentimento !== 'string') {
      return res
        .status(400)
        .json({ error: 'campo "sentimento" é obrigatório e deve ser string' });
    }

    // Normaliza dia -> YYYY-MM-DD (ou hoje se vier inválido / vazio)
    const dayStr =
      day && moment(day, 'YYYY-MM-DD', true).isValid()
        ? day
        : moment().format('YYYY-MM-DD');

    const path = `days.${dayStr}`;

    const doc = await FeelingBotModel.findOneAndUpdate(
      { user_id: userId },
      {
        $setOnInsert: { user_id: userId },
        $set: {
          [path]: {
            sentimento,
            label,
          },
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(201).json({ feelings_bot: doc.toJSON() });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || 'erro ao registrar sentimento do bot',
    });
  }
}

/**
 * GET /api/v1/feeling-bot
 * Lista todos os registros (days) do usuário logado
 */
async function list(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId)
      return res.status(401).json({ error: 'usuário não autenticado' });

    const doc = await FeelingBotModel.findOne({ user_id: userId });
    if (!doc) {
      return res.status(200).json({ feelings_bot: [] });
    }

    return res.status(200).json({ feelings_bot: doc.toJSON() });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || 'erro ao listar sentimentos do bot',
    });
  }
}

/**
 * DELETE /api/v1/feeling-bot/:day
 * Remove um dia específico do registro do usuário logado
 */
async function deleteByDay(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId)
      return res.status(401).json({ error: 'usuário não autenticado' });

    const { day } = req.params as { day: string };
    if (!day || !moment(day, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ error: 'day inválido (YYYY-MM-DD)' });
    }

    const doc = await FeelingBotModel.findOne({ user_id: userId });
    if (!doc) {
      return res
        .status(404)
        .json({ error: 'registro do usuário não encontrado' });
    }

    if (!doc.days.has(day)) {
      return res
        .status(404)
        .json({ error: `dia ${day} não encontrado no histórico` });
    }

    doc.days.delete(day);
    await doc.save();

    return res.status(200).json({
      message: `sentimento do dia ${day} removido com sucesso`,
      feelings_bot: doc.toJSON(),
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || 'erro ao deletar sentimento do bot',
    });
  }
}

/**
 * DELETE /api/v1/feeling-bot
 * Remove todos os registros do usuário (opcional, uso administrativo)
 */
async function deleteAll(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId)
      return res.status(401).json({ error: 'usuário não autenticado' });

    const doc = await FeelingBotModel.findOneAndDelete({ user_id: userId });
    if (!doc) {
      return res
        .status(404)
        .json({ error: 'registro do usuário não encontrado' });
    }

    return res.status(200).json({
      message: 'todos os sentimentos do bot removidos com sucesso',
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || 'erro ao deletar todos os sentimentos do bot',
    });
  }
}

export default { upsertDay, list, deleteByDay, deleteAll };

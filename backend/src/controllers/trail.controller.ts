// src/controllers/trail.controller.ts

import { Response } from 'express';
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import TrailModel from '../models/trail.model';
import TrailLogModel from '../models/trail_log.model';
import { AuthRequest } from '../security/auth.middleware';
import { FEELINGS } from '../models/feeling.model';

// TZ padrão do projeto
const TZ = 'America/Sao_Paulo';

function todayString() {
  return moment().tz(TZ).format('YYYY-MM-DD');
}

// GET /api/v1/trails -> lista todas (ordenadas por trailId)
export async function listTrails(_req: AuthRequest, res: Response) {
  try {
    const trails = await TrailModel.find().sort({ trailId: 1 });
    return res.status(200).json({ trails: trails.map(t => t.toJSON()) });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || 'erro ao listar trilhas' });
  }
}

// GET /api/v1/trails/id/:trailId  (busca por ID curto)
export async function getTrailById(req: AuthRequest, res: Response) {
  try {
    const trailId = Number(req.params.trailId);
    if (isNaN(trailId)) {
      return res.status(400).json({ error: 'trailId deve ser um número' });
    }

    const trail = await TrailModel.findOne({ trailId });
    if (!trail) {
      return res.status(404).json({ error: 'trilha não encontrada' });
    }

    return res.status(200).json({ trail: trail.toJSON() });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || 'erro ao buscar trilha' });
  }
}

// GET /api/v1/trails/obj/:id  (busca pelo ObjectId)
export async function getTrailByObjectId(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'id inválido' });
    }

    const trail = await TrailModel.findById(id);
    if (!trail) {
      return res.status(404).json({ error: 'trilha não encontrada' });
    }

    return res.status(200).json({ trail: trail.toJSON() });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || 'erro ao buscar trilha' });
  }
}

/**
 * POST /api/v1/trails/registro
 * Registra um exercício concluído
 */
export async function registrarExercicio(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: 'não autenticado' });

    const {
      day,
      trailId,
      trail_id,
      diaDaTrilha,
      sentimentoDisparador,
      origemSentimento,
    } = req.body || {};

    const dayStr =
      day && moment(day, 'YYYY-MM-DD', true).isValid() ? day : todayString();

    if (!trailId && !trail_id)
      return res.status(400).json({ error: 'informe trailId ou trail_id' });

    if (!diaDaTrilha || diaDaTrilha < 1 || diaDaTrilha > 7)
      return res.status(400).json({ error: 'diaDaTrilha deve ser 1..7' });

    let trailObjectId: mongoose.Types.ObjectId | null = null;

    if (typeof trailId === 'number') {
      const t = await TrailModel.findOne({ trailId }).select('_id');
      if (!t)
        return res
          .status(404)
          .json({ error: `trilha trailId=${trailId} não encontrada` });
      trailObjectId = t._id as mongoose.Types.ObjectId;
    } else if (typeof trail_id === 'string') {
      if (!mongoose.isValidObjectId(trail_id))
        return res.status(400).json({ error: 'trail_id inválido' });

      const t = await TrailModel.findById(trail_id).select('_id');
      if (!t)
        return res
          .status(404)
          .json({ error: `trilha id=${trail_id} não encontrada` });
      trailObjectId = t._id as mongoose.Types.ObjectId;
    }

    let sentimentoVal = sentimentoDisparador;
    if (sentimentoDisparador && FEELINGS.includes(sentimentoDisparador)) {
      sentimentoVal = sentimentoDisparador;
    }

    const exec = {
      trail_id: trailObjectId!,
      diaDaTrilha,
      sentimentoDisparador: sentimentoVal,
      origemSentimento: origemSentimento || 'bot',
      concluidoEm: new Date(),
    };

    const doc = await TrailLogModel.findOneAndUpdate(
      { user_id: userId, day: dayStr },
      {
        $setOnInsert: { user_id: userId, day: dayStr },
        $push: { exercicios: exec },
      },
      { upsert: true, new: true }
    );

    return res.status(201).json({ registro: doc.toJSON() });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || 'erro ao registrar exercício' });
  }
}

// GET /api/v1/trails/stats
export async function stats(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: 'não autenticado' });

    const period = (req.query.period as string) || 'all';
    const today = moment().tz(TZ);

    let inicio: moment.Moment | null = null;
    let fim: moment.Moment | null = today.clone().endOf('day');

    switch (period) {
      case 'day':
        inicio = today.clone().startOf('day');
        break;
      case 'week':
        inicio = today.clone().startOf('week');
        break;
      case 'month':
        inicio = today.clone().startOf('month');
        break;
      case 'year':
        inicio = today.clone().startOf('year');
        break;
      case 'all':
      default:
        inicio = null;
        fim = null;
    }

    const match: any = { user_id: new mongoose.Types.ObjectId(userId) };
    if (inicio && fim) {
      match.day = {
        $gte: inicio.format('YYYY-MM-DD'),
        $lte: fim.format('YYYY-MM-DD'),
      };
    }

    const pipeline = [
      { $match: match },
      { $unwind: '$exercicios' },
      {
        $facet: {
          geral: [
            {
              $group: {
                _id: null,
                totalExercicios: { $sum: 1 },
                trilhasDistintas: { $addToSet: '$exercicios.trail_id' },
              },
            },
          ],
          porTrilha: [
            {
              $group: {
                _id: '$exercicios.trail_id',
                totalExercicios: { $sum: 1 },
              },
            },
          ],
          porSentimento: [
            {
              $group: {
                _id: '$exercicios.sentimentoDisparador',
                totalExercicios: { $sum: 1 },
              },
            },
          ],
        },
      },
    ];

    const result = await TrailLogModel.aggregate(pipeline);

    const geral = result[0]?.geral?.[0] || {};
    const totalExercicios = geral.totalExercicios || 0;
    const totalTrilhas = geral.trilhasDistintas
      ? geral.trilhasDistintas.length
      : 0;

    return res.status(200).json({
      period,
      inicio: inicio?.format('YYYY-MM-DD') || null,
      fim: fim?.format('YYYY-MM-DD') || null,
      totalExercicios,
      totalTrilhas,
      porTrilha: result[0]?.porTrilha || [],
      porSentimento: result[0]?.porSentimento || [],
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || 'erro ao calcular estatísticas' });
  }
}

import { Response } from 'express';
import moment from 'moment-timezone';
import TrailModel from '../models/trail.model';
import TrailLogModel from '../models/trail_log.model';
import { AuthRequest } from '../security/auth.middleware';
import { FEELINGS } from '../models/feeling.model';

// TZ padrão do projeto
const TZ = 'America/Sao_Paulo';

function todayString() {
  return moment().tz(TZ).format('YYYY-MM-DD');
}

// GET /api/v1/trails
export async function listTrails(_req: AuthRequest, res: Response) {
  try {
    const trails = await TrailModel.find().sort({ nome: 1 });
    return res.status(200).json({ trails: trails.map(t => t.toJSON()) });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || 'erro ao listar trilhas' });
  }
}

/**
 * POST /api/v1/trails/registro
 * Body:
 * {
 *   day?: 'YYYY-MM-DD'        // opcional, default = hoje
 *   trail_id: string,
 *   diaDaTrilha: number,      // 1..7
 *   sentimentoDisparador?: string (de preferência em FEELINGS)
 *   origemSentimento?: 'entrada' | 'saida' | 'bot' | 'manual'
 * }
 */
export async function registrarExercicio(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'não autenticado' });
    }

    const {
      day,
      trail_id,
      diaDaTrilha,
      sentimentoDisparador,
      origemSentimento,
    } = req.body || {};

    const dayStr =
      day && moment(day, 'YYYY-MM-DD', true).isValid() ? day : todayString();

    if (!trail_id) {
      return res.status(400).json({ error: 'trail_id é obrigatório' });
    }
    if (!diaDaTrilha || diaDaTrilha < 1 || diaDaTrilha > 7) {
      return res
        .status(400)
        .json({ error: 'diaDaTrilha deve ser um número entre 1 e 7' });
    }

    // valida sentimento, se vier um dos fixos
    let sentimentoVal: string | undefined = sentimentoDisparador;
    if (sentimentoDisparador && FEELINGS.includes(sentimentoDisparador)) {
      sentimentoVal = sentimentoDisparador;
    }

    const exec = {
      trail_id,
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

/**
 * GET /api/v1/trails/stats?period=day|week|month|year|all
 * Retorna:
 * {
 *   period: 'day' | ...,
 *   inicio: 'YYYY-MM-DD' | null,
 *   fim: 'YYYY-MM-DD' | null,
 *   totalExercicios: number,
 *   totalTrilhas: number, // trilhas distintas
 *   porTrilha: [{ trail_id, totalExercicios }],
 *   porSentimento: [{ sentimentoDisparador, totalExercicios }]
 * }
 */
export async function stats(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'não autenticado' });
    }

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
        break;
    }

    const match: any = { user_id: userId };
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
                trilhasDistintas: {
                  $addToSet: '$exercicios.trail_id',
                },
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

    const geral = result[0]?.geral?.[0];
    const totalExercicios = geral?.totalExercicios || 0;
    const totalTrilhas = geral?.trilhasDistintas
      ? geral.trilhasDistintas.length
      : 0;

    const porTrilha = result[0]?.porTrilha || [];
    const porSentimento = result[0]?.porSentimento || [];

    return res.status(200).json({
      period,
      inicio: inicio ? inicio.format('YYYY-MM-DD') : null,
      fim: fim ? fim.format('YYYY-MM-DD') : null,
      totalExercicios,
      totalTrilhas,
      porTrilha,
      porSentimento,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || 'erro ao calcular estatísticas' });
  }
}

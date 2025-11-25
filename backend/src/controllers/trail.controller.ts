// src/controllers/trail.controller.ts

import { Response } from 'express';
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import TrailModel from '../models/trail.model';
import TrailLogModel from '../models/trail_log.model';
import { AuthRequest } from '../security/auth.middleware';
import FeelingModel, { FEELINGS } from '../models/feeling.model';

// TZ padrão do projeto
const TZ = 'America/Sao_Paulo';

function todayString() {
  return moment().tz(TZ).format('YYYY-MM-DD');
}

// Mapeia emoções para um score numérico para cálculo de humor médio
// Já preparado para a nova tabela: Felicidade, Tristeza, Ansiedade, Estresse
const MOOD_SCORE: Record<string, number> = {
  Felicidade: 5,
  Tristeza: 1,
  Ansiedade: 3,
  Estresse: 2,
};

function scoreFromFeeling(feeling: string | undefined | null): number | null {
  if (!feeling) return null;
  if (Object.prototype.hasOwnProperty.call(MOOD_SCORE, feeling)) {
    return MOOD_SCORE[feeling];
  }
  // fallback neutro (caso venha algo desconhecido ou anterior)
  return 3;
}

// GET /api/v1/trails -> lista todas (ordenadas por trailId)
export async function listTrails(_req: AuthRequest, res: Response) {
  try {
    const trails = await TrailModel.find().sort({ trailId: 1 });
    return res.status(200).json({ trails: trails.map(t => t.toJSON()) });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'erro ao listar trilhas';
    return res.status(500).json({ error: message });
  }
}

// GET /api/v1/trails/id/:trailId  (busca por ID curto)
export async function getTrailById(req: AuthRequest, res: Response) {
  try {
    const trailId = Number(req.params.trailId);
    if (Number.isNaN(trailId)) {
      return res.status(400).json({ error: 'trailId deve ser um número' });
    }

    const trail = await TrailModel.findOne({ trailId });
    if (!trail) {
      return res.status(404).json({ error: 'trilha não encontrada' });
    }

    return res.status(200).json({ trail: trail.toJSON() });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'erro ao buscar trilha';
    return res.status(500).json({ error: message });
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
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'erro ao buscar trilha';
    return res.status(500).json({ error: message });
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

    if (!trailId && !trail_id) {
      return res.status(400).json({ error: 'informe trailId ou trail_id' });
    }

    if (!diaDaTrilha || diaDaTrilha < 1 || diaDaTrilha > 7) {
      return res.status(400).json({ error: 'diaDaTrilha deve ser 1..7' });
    }

    let trailObjectId: mongoose.Types.ObjectId | null = null;

    if (typeof trailId === 'number') {
      const t = await TrailModel.findOne({ trailId }).select('_id');
      if (!t) {
        return res.status(404).json({
          error: `trilha trailId=${trailId} não encontrada`,
        });
      }
      trailObjectId = t._id as mongoose.Types.ObjectId;
    } else if (typeof trail_id === 'string') {
      if (!mongoose.isValidObjectId(trail_id)) {
        return res.status(400).json({ error: 'trail_id inválido' });
      }

      const t = await TrailModel.findById(trail_id).select('_id');
      if (!t) {
        return res.status(404).json({
          error: `trilha id=${trail_id} não encontrada`,
        });
      }
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
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'erro ao registrar exercício';
    return res.status(500).json({ error: message });
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

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const match: Record<string, unknown> = { user_id: userObjectId };
    if (inicio && fim) {
      match.day = {
        $gte: inicio.format('YYYY-MM-DD'),
        $lte: fim.format('YYYY-MM-DD'),
      };
    }

    // Aggregation de exercícios
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
          porTrilhaDetalhada: [
            {
              $group: {
                _id: '$exercicios.trail_id',
                totalExercicios: { $sum: 1 },
              },
            },
            {
              $lookup: {
                from: 'trails',
                localField: '_id',
                foreignField: '_id',
                as: 'trail',
              },
            },
            {
              $unwind: {
                path: '$trail',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                totalExercicios: 1,
                trailId: '$trail.trailId',
                code: '$trail.code',
                nome: '$trail.nome',
              },
            },
          ],
        },
      },
    ];

    const result = await TrailLogModel.aggregate(pipeline);

    const geral = result[0]?.geral?.[0] ?? {};
    const totalExercicios =
      (geral as { totalExercicios?: number }).totalExercicios || 0;
    const totalTrilhas = Array.isArray(
      (geral as { trilhasDistintas?: unknown[] }).trilhasDistintas
    )
      ? (geral as { trilhasDistintas: unknown[] }).trilhasDistintas.length
      : 0;

    const porTrilha = result[0]?.porTrilha ?? [];
    const porSentimento = result[0]?.porSentimento ?? [];
    const porTrilhaDetalhada = result[0]?.porTrilhaDetalhada ?? [];

    // Dias ativos = quantos dias têm pelo menos 1 exercício (TrailLogDay)
    const diasAtivos = await TrailLogModel.distinct('day', match).then(
      days => days.length
    );

    // ---- FEELINGS PARA HUMOR MÉDIO + EVOLUÇÃO (no período) ----
    const feelingsFilter: Record<string, unknown> = {
      user_id: userObjectId,
    };
    if (inicio && fim) {
      feelingsFilter.day = {
        $gte: inicio.format('YYYY-MM-DD'),
        $lte: fim.format('YYYY-MM-DD'),
      };
    }

    const feelingsInPeriod = await FeelingModel.find(feelingsFilter)
      .select('day sentimento_de_entrada sentimento_de_saida')
      .lean();

    // totalCheckins = número de registros de feeling no período
    const totalCheckins = feelingsInPeriod.length;

    // humorMedio (usa sentimento_de_saida quando existir, senão entrada)
    let sum = 0;
    let count = 0;

    const evolucaoEntradaMap: Record<string, Record<string, number>> = {};
    const evolucaoSaidaMap: Record<string, Record<string, number>> = {};

    for (const f of feelingsInPeriod) {
      const dayStr = (f as unknown as { day: string }).day;

      const entrada = (f as { sentimento_de_entrada?: string })
        .sentimento_de_entrada;
      const saida = (f as { sentimento_de_saida?: string }).sentimento_de_saida;

      // evolução entrada
      if (entrada) {
        if (!evolucaoEntradaMap[dayStr]) {
          evolucaoEntradaMap[dayStr] = {};
        }
        evolucaoEntradaMap[dayStr][entrada] =
          (evolucaoEntradaMap[dayStr][entrada] ?? 0) + 1;
      }

      // evolução saída
      if (saida) {
        if (!evolucaoSaidaMap[dayStr]) {
          evolucaoSaidaMap[dayStr] = {};
        }
        evolucaoSaidaMap[dayStr][saida] =
          (evolucaoSaidaMap[dayStr][saida] ?? 0) + 1;
      }

      // humor médio
      const escolha = saida || entrada;
      const s = scoreFromFeeling(escolha);
      if (s != null) {
        sum += s;
        count += 1;
      }
    }

    const humorMedio = count > 0 ? sum / count : null;
    const humorSamples = count;

    // Converte mapas em arrays ordenadas por dia
    const humorEvolucaoEntrada = Object.entries(evolucaoEntradaMap)
      .sort(([d1], [d2]) => (d1 < d2 ? -1 : d1 > d2 ? 1 : 0))
      .map(([dayStr, counts]) => ({
        day: dayStr,
        counts,
      }));

    const humorEvolucaoSaida = Object.entries(evolucaoSaidaMap)
      .sort(([d1], [d2]) => (d1 < d2 ? -1 : d1 > d2 ? 1 : 0))
      .map(([dayStr, counts]) => ({
        day: dayStr,
        counts,
      }));

    // ---- longestStreakDays (maior sequência de dias consecutivos com check-in, vida toda) ----
    const feelingsAllTime = await FeelingModel.find({ user_id: userObjectId })
      .select('day')
      .lean();

    const uniqueDaysAll = Array.from(
      new Set(
        feelingsAllTime
          .map(f => (f as { day?: string }).day)
          .filter((d): d is string => typeof d === 'string')
      )
    ).sort();

    let longestStreakDays = 0;
    let currentStreak = 0;
    let lastDayMoment: moment.Moment | null = null;

    for (const d of uniqueDaysAll) {
      const m = moment(d, 'YYYY-MM-DD');
      if (!lastDayMoment) {
        currentStreak = 1;
      } else {
        const diff = m.diff(lastDayMoment, 'days');
        if (diff === 1) {
          currentStreak += 1;
        } else if (diff > 1) {
          currentStreak = 1;
        }
      }
      lastDayMoment = m;
      if (currentStreak > longestStreakDays) {
        longestStreakDays = currentStreak;
      }
    }

    return res.status(200).json({
      period,
      inicio: inicio?.format('YYYY-MM-DD') || null,
      fim: fim?.format('YYYY-MM-DD') || null,
      totalExercicios,
      totalTrilhas,
      diasAtivos,
      totalCheckins,
      longestStreakDays,
      humorMedio,
      humorSamples,
      porTrilha,
      porTrilhaDetalhada,
      porSentimento,
      humorEvolucaoEntrada,
      humorEvolucaoSaida,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'erro ao calcular estatísticas';
    return res.status(500).json({ error: message });
  }
}

// NOVO: sugerir próximo exercício da última trilha executada
export async function getNextExercise(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: 'não autenticado' });

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1) Busca o ÚLTIMO exercício concluído pelo usuário (em qualquer dia / trilha)
    const lastExecAgg = await TrailLogModel.aggregate([
      { $match: { user_id: userObjectId } },
      { $unwind: '$exercicios' },
      { $sort: { 'exercicios.concluidoEm': -1 } },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          trail_id: '$exercicios.trail_id',
          diaDaTrilha: '$exercicios.diaDaTrilha',
          sentimentoDisparador: '$exercicios.sentimentoDisparador',
          origemSentimento: '$exercicios.origemSentimento',
          concluidoEm: '$exercicios.concluidoEm',
          day: '$day',
        },
      },
    ]);

    if (!lastExecAgg || lastExecAgg.length === 0) {
      return res.status(404).json({
        error: 'nenhum exercício encontrado para este usuário',
      });
    }

    const lastExec = lastExecAgg[0];

    // 2) Carrega a trilha correspondente
    const trail = await TrailModel.findById(lastExec.trail_id);
    if (!trail) {
      return res.status(404).json({
        error: 'trilha associada ao último exercício não encontrada',
      });
    }

    // 3) Calcula o próximo dia da trilha
    const currentDia = lastExec.diaDaTrilha as number;
    const totalDias = trail.dias.length || 0;
    const nextDia = currentDia + 1;

    // Caso já tenha concluído o último dia da trilha
    if (nextDia > totalDias) {
      return res.status(200).json({
        finished: true,
        message: 'trilha concluída, não há próximo exercício',
        trail: {
          id: trail.id,
          trailId: trail.trailId,
          code: trail.code,
          nome: trail.nome,
        },
        lastExecution: {
          diaDaTrilha: currentDia,
          day: lastExec.day,
          concluidoEm: lastExec.concluidoEm,
          sentimentoDisparador: lastExec.sentimentoDisparador,
          origemSentimento: lastExec.origemSentimento,
        },
        nextExercise: null,
      });
    }

    // 4) Busca o passo correspondente ao próximo dia
    const nextStep = trail.dias.find(
      (d: { ordem: number }) => d.ordem === nextDia
    );

    if (!nextStep) {
      return res.status(500).json({
        error: `não foi possível localizar o passo ordem=${nextDia} da trilha`,
      });
    }

    // 5) Retorna o próximo exercício + contexto
    return res.status(200).json({
      finished: false,
      trail: {
        id: trail.id,
        trailId: trail.trailId,
        code: trail.code,
        nome: trail.nome,
      },
      lastExecution: {
        diaDaTrilha: currentDia,
        day: lastExec.day,
        concluidoEm: lastExec.concluidoEm,
        sentimentoDisparador: lastExec.sentimentoDisparador,
        origemSentimento: lastExec.origemSentimento,
      },
      nextExercise: {
        diaDaTrilha: nextDia,
        step: nextStep,
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'erro ao buscar próximo exercício';
    console.error('[getNextExercise] erro', message);
    return res.status(500).json({
      error: message,
    });
  }
}

// GET /api/v1/trails/recommendations?feeling=Ansiedade
export async function recommendTrails(req: AuthRequest, res: Response) {
  try {
    const feelingRaw = (req.query.feeling as string | undefined)?.trim();

    if (!feelingRaw) {
      return res.status(400).json({
        error: 'parâmetro "feeling" é obrigatório',
        allowed: FEELINGS,
      });
    }

    // Normaliza para um dos FEELINGS do backend
    const feelingNormalized =
      FEELINGS.find(f => f.toLowerCase() === feelingRaw.toLowerCase()) ?? null;

    if (!feelingNormalized) {
      return res.status(400).json({
        error: 'feeling inválido',
        received: feelingRaw,
        allowed: FEELINGS,
      });
    }

    const trails = await TrailModel.find({
      sentimentosRecomendados: feelingNormalized,
    }).sort({ trailId: 1 });

    return res.status(200).json({
      feeling: feelingNormalized,
      recommended: trails.map(t => t.toJSON()),
    });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'erro ao recomendar trilhas por sentimento';
    console.error('[recommendTrails] erro', message);
    return res.status(500).json({ error: message });
  }
}

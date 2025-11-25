// src/controllers/feeling.controller.ts

import { Response } from 'express';
import FeelingModel, { FEELINGS } from '../models/feeling.model';
import { AuthRequest } from '../security/auth.middleware';

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

function validateDay(day?: string) {
  return !!day && DAY_RE.test(day);
}

function badFeeling(value: unknown) {
  return typeof value !== 'string' || !FEELINGS.includes(value as any);
}

/**
 * POST /feelings/entrada
 * Body: { day: 'YYYY-MM-DD', sentimento_de_entrada: FeelingValue }
 * Se o doc (user_id, day) não existe, cria com entrada=valor e saida=mesmo valor
 * Se existe, apenas atualiza o campo de entrada
 */
async function createEntrada(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: 'não autenticado' });

    const { day, sentimento_de_entrada } = req.body || {};

    if (!validateDay(day)) {
      return res
        .status(400)
        .json({ error: 'day deve estar no formato YYYY-MM-DD' });
    }
    if (badFeeling(sentimento_de_entrada)) {
      return res.status(400).json({
        error: 'sentimento_de_entrada inválido',
        allowed: FEELINGS,
      });
    }

    // 1) Verifica se já existe registro para (user, day)
    const existing = await FeelingModel.findOne({ user_id: userId, day });

    let doc;

    if (!existing) {
      // 2A) Não existe ainda -> cria com entrada = saída = novo valor
      doc = await FeelingModel.create({
        user_id: userId,
        day,
        sentimento_de_entrada,
        sentimento_de_saida: sentimento_de_entrada,
      });
    } else {
      // 2B) Já existe -> atualiza entrada
      // Se ainda não houve "saída real", saída == entrada antiga.
      // Nesse caso, sincronizamos saída com o novo valor também.
      const update: Partial<{
        sentimento_de_entrada: string;
        sentimento_de_saida: string;
      }> = {
        sentimento_de_entrada,
      };

      if (existing.sentimento_de_saida === existing.sentimento_de_entrada) {
        // ainda não houve uma saída diferente da entrada -> reseta saída também
        update.sentimento_de_saida = sentimento_de_entrada;
      }

      doc = await FeelingModel.findOneAndUpdate(
        { user_id: userId, day },
        { $set: update },
        { new: true, runValidators: true }
      );
    }

    return res.status(201).json({ feeling: doc!.toJSON() });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || 'erro ao criar entrada' });
  }
}

/**
 * POST /feelings/saida
 * Body: { day: 'YYYY-MM-DD', sentimento_de_saida: FeelingValue }
 * Se o doc (user_id, day) não existe, cria com saida=valor e entrada=mesmo valor
 * Se existe, apenas atualiza o campo de saída
 */
async function createSaida(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: 'não autenticado' });

    const { day, sentimento_de_saida } = req.body || {};

    if (!validateDay(day)) {
      return res
        .status(400)
        .json({ error: 'day deve estar no formato YYYY-MM-DD' });
    }
    if (badFeeling(sentimento_de_saida)) {
      return res.status(400).json({
        error: 'sentimento_de_saida inválido',
        allowed: FEELINGS,
      });
    }

    const doc = await FeelingModel.findOneAndUpdate(
      { user_id: userId, day },
      {
        $setOnInsert: {
          user_id: userId,
          day,
          // Schema exige ambos: inicializa entrada com o mesmo valor no "primeiro create"
          sentimento_de_entrada: sentimento_de_saida,
        },
        $set: { sentimento_de_saida },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(201).json({ feeling: doc.toJSON() });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || 'erro ao criar saída' });
  }
}

/**
 * GET /feelings
 * Query opcional: ?inicio=YYYY-MM-DD&fim=YYYY-MM-DD
 * Lista os registros do usuário logado, ordenados por day desc
 */
async function list(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: 'não autenticado' });

    const { inicio, fim } = req.query as { inicio?: string; fim?: string };

    const filter: any = { user_id: userId };
    if (inicio || fim) {
      if (inicio && !validateDay(inicio)) {
        return res.status(400).json({ error: 'inicio inválido (YYYY-MM-DD)' });
      }
      if (fim && !validateDay(fim)) {
        return res.status(400).json({ error: 'fim inválido (YYYY-MM-DD)' });
      }
      filter.day = {};
      if (inicio) filter.day.$gte = inicio;
      if (fim) filter.day.$lte = fim;
    }

    const docs = await FeelingModel.find(filter).sort({ day: -1 });
    return res.status(200).json({ feelings: docs.map(d => d.toJSON()) });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || 'erro ao listar feelings' });
  }
}

/**
 * PATCH /feelings/entrada/:day
 * Params: day='YYYY-MM-DD'
 * Body: { sentimento_de_entrada: FeelingValue }
 * Atualiza apenas o campo de entrada do dia
 */
async function updateEntrada(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: 'não autenticado' });

    const { day } = req.params as { day: string };
    const { sentimento_de_entrada } = req.body || {};

    if (!validateDay(day)) {
      return res
        .status(400)
        .json({ error: 'day deve estar no formato YYYY-MM-DD' });
    }
    if (badFeeling(sentimento_de_entrada)) {
      return res.status(400).json({
        error: 'sentimento_de_entrada inválido',
        allowed: FEELINGS,
      });
    }

    const updated = await FeelingModel.findOneAndUpdate(
      { user_id: userId, day },
      { $set: { sentimento_de_entrada } },
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ error: 'registro do dia não encontrado' });

    return res.status(200).json({ feeling: updated.toJSON() });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || 'erro ao atualizar entrada' });
  }
}

/**
 * PATCH /feelings/saida/:day
 * Params: day='YYYY-MM-DD'
 * Body: { sentimento_de_saida: FeelingValue }
 * Atualiza apenas o campo de saída do dia
 * Teste
 */
async function updateSaida(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: 'não autenticado' });

    const { day } = req.params as { day: string };
    const { sentimento_de_saida } = req.body || {};

    if (!validateDay(day)) {
      return res
        .status(400)
        .json({ error: 'day deve estar no formato YYYY-MM-DD' });
    }
    if (badFeeling(sentimento_de_saida)) {
      return res.status(400).json({
        error: 'sentimento_de_saida inválido',
        allowed: FEELINGS,
      });
    }

    const updated = await FeelingModel.findOneAndUpdate(
      { user_id: userId, day },
      { $set: { sentimento_de_saida } },
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ error: 'registro do dia não encontrado' });

    return res.status(200).json({ feeling: updated.toJSON() });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || 'erro ao atualizar saída' });
  }
}

export default {
  createEntrada,
  createSaida,
  list,
  updateEntrada,
  updateSaida,
};

// frontend/services/trail.ts

import { api } from '@/services/api';
import {
  ITrailStats,
  INextExerciseResponse,
  IRecommendedTrailsResponse,
} from '@/interfaces/trail.interface';
import { MoodLabel } from '@/interfaces/feeling.interface';

export type TrailStatsPeriod = 'day' | 'week' | 'month' | 'year' | 'all';

/**
 * Estatísticas de trilhas (já existia)
 */
export async function fetchTrailStats(
  period: TrailStatsPeriod = 'week'
): Promise<ITrailStats> {
  const { data } = await api.get<ITrailStats>('/trails/stats', {
    params: { period },
  });
  return data;
}

/**
 * Próximo exercício sugerido (já existia)
 */
export async function fetchNextExercise(): Promise<INextExerciseResponse> {
  const { data } = await api.get<INextExerciseResponse>('/trails/next');
  return data;
}

/**
 * Trilhas recomendadas por sentimento (já existia)
 */
export async function fetchRecommendedTrailsByFeeling(
  feeling: MoodLabel
): Promise<IRecommendedTrailsResponse> {
  const { data } = await api.get<IRecommendedTrailsResponse>(
    '/trails/recommendations',
    {
      params: { feeling },
    }
  );

  console.log(
    '🟢 [TrailService] Trilhas recomendadas para',
    feeling,
    ':',
    data
  );

  return data;
}

/* ------------------------------------------------------------------
 * NOVO: registrar exercício concluído no backend
 * POST /trails/registro
 * Body:
 *   - opcional: day?: 'YYYY-MM-DD' (se não mandar, backend usa hoje)
 *   - OU trailId (número curto) OU trail_id (ObjectId string)
 *   - diaDaTrilha: número do dia (1..7)
 *   - sentimentoDisparador?: string
 *   - origemSentimento?: string  (ex.: 'bot', 'trilhas', etc.)
 * -----------------------------------------------------------------*/

export interface RegisterExercisePayload {
  day?: string; // 'YYYY-MM-DD' (opcional)
  trailId?: number; // ID curto numérico da trilha
  trail_id?: string; // ObjectId da trilha no Mongo
  diaDaTrilha: number;
  sentimentoDisparador?: string;
  origemSentimento?: string;
}

export async function registerExercise(
  payload: RegisterExercisePayload
): Promise<void> {
  await api.post('/trails/registro', payload);
}

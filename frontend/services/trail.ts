// frontend/services/trail.ts

import { api } from '@/services/api';
import {
  ITrailStats,
  INextExerciseResponse,
  IRecommendedTrailsResponse,
} from '@/interfaces/trail.interface';
import { MoodLabel } from '@/interfaces/feeling.interface';

export type TrailStatsPeriod = 'day' | 'week' | 'month' | 'year' | 'all';

export async function fetchTrailStats(
  period: TrailStatsPeriod = 'week'
): Promise<ITrailStats> {
  const { data } = await api.get<ITrailStats>('/trails/stats', {
    params: { period },
  });
  return data;
}

export async function fetchNextExercise(): Promise<INextExerciseResponse> {
  const { data } = await api.get<INextExerciseResponse>('/trails/next');
  return data;
}

// 👇 NOVO: busca trilhas recomendadas para um sentimento
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

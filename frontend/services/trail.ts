// frontend/services/trail.ts

import { api } from '@/services/api';
import {
  ITrailStats,
  INextExerciseResponse,
} from '@/interfaces/trail.interface';

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

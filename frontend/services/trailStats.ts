// frontend/services/trailsStats.ts

import { api } from './api';
import {
  INextExerciseResponse,
  ITrailStats,
} from '@/interfaces/trail.interface';

export type TrailStatsPeriod = 'day' | 'week' | 'month' | 'year' | 'all';

export interface PorTrilha {
  _id: string; // ObjectId da trilha
  totalExercicios: number;
}

export interface PorSentimento {
  _id: string | null; // pode ser null se não houver sentimentoDisparador
  totalExercicios: number;
}

export interface PorTrilhaDetalhada {
  _id: string; // ObjectId da trilha
  totalExercicios: number;
  trailId?: number;
  code?: string;
  nome?: string;
}

export interface HumorEvolucaoItem {
  day: string; // 'YYYY-MM-DD'
  counts: Record<string, number>; // { 'Felicidade': 2, 'Tristeza': 1, ... }
}

export interface TrailStatsResponse {
  period: TrailStatsPeriod;
  inicio: string | null;
  fim: string | null;
  totalExercicios: number;
  totalTrilhas: number;
  diasAtivos: number;
  totalCheckins: number;
  longestStreakDays: number;
  humorMedio: number | null;
  humorSamples: number;
  porTrilha: PorTrilha[];
  porTrilhaDetalhada: PorTrilhaDetalhada[];
  porSentimento: PorSentimento[];
  humorEvolucaoEntrada: HumorEvolucaoItem[];
  humorEvolucaoSaida: HumorEvolucaoItem[];
  porMesTrilha?: {
    month: string; // '01'..'12'
    trailId: number | null;
    totalExercicios: number;
  }[];
}

// 🔹 Função “base” que você já tinha
export async function getTrailStats(
  period: TrailStatsPeriod = 'week'
): Promise<TrailStatsResponse> {
  const { data } = await api.get<TrailStatsResponse>('/trails/stats', {
    params: { period },
  });

  return data;
}

// 🔹 Wrapper com o nome que o HomeDashboardContext espera
export async function fetchTrailStats(
  period: TrailStatsPeriod = 'week'
): Promise<ITrailStats> {
  const data = await getTrailStats(period);
  // se ITrailStats for compatível com TrailStatsResponse, isso funciona liso
  return data as unknown as ITrailStats;
}

// 🔹 Próximo exercício (ajuste a rota se a sua for diferente)
export async function fetchNextExercise(): Promise<INextExerciseResponse> {
  const { data } = await api.get<INextExerciseResponse>('/trails/next');
  return data;
}

// frontend/interfaces/trail.interface.ts

import { MoodLabel } from './feeling.interface';

export interface ITrailStep {
  ordem: number; // 1..7
  titulo: string;
  descricao?: string;
  duracaoMinutos?: number;
  objetivo?: string;
}

export interface ITrail {
  id: string;
  trailId: number;
  code: string;
  nome: string;
  descricao?: string;
  dias: ITrailStep[];
  sentimentosRecomendados: string[];
}

export interface ITrailStatsByTrilha {
  _id: string;
  totalExercicios: number;
}

export interface ITrailStatsByTrilhaDetalhada {
  _id: string;
  totalExercicios: number;
  trailId?: number;
  code?: string;
  nome?: string;
}

export interface IHumorEvolucaoPoint {
  day: string; // 'YYYY-MM-DD'
  counts: Record<string, number>; // { Felicidade: 2, Tristeza: 1, ... }
}

export interface ITrailStatsByMesTrilha {
  month: string; // '01'..'12'
  trailId: number | null; // pode ser null se algo estiver sem trilha
  totalExercicios: number;
}

export interface ITrailStats {
  period: 'day' | 'week' | 'month' | 'year' | 'all';
  inicio: string | null;
  fim: string | null;
  totalExercicios: number;
  totalTrilhas: number;
  diasAtivos: number;
  totalCheckins: number;
  longestStreakDays: number;
  humorMedio: number | null;
  humorSamples: number;
  porTrilha: ITrailStatsByTrilha[];
  porTrilhaDetalhada: ITrailStatsByTrilhaDetalhada[];
  porSentimento: { _id: string | null; totalExercicios: number }[];
  humorEvolucaoEntrada: IHumorEvolucaoPoint[];
  humorEvolucaoSaida: IHumorEvolucaoPoint[];
  porMesTrilha?: ITrailStatsByMesTrilha[];
}

export interface INextExerciseResponse {
  finished: boolean;
  trail: {
    id: string;
    trailId: number;
    code: string;
    nome: string;
  };
  lastExecution: {
    diaDaTrilha: number;
    day: string;
    concluidoEm: string;
    sentimentoDisparador?: string;
    origemSentimento?: string;
  };
  nextExercise: null | {
    diaDaTrilha: number;
    step: ITrailStep;
  };
  message?: string;
}

export interface IRecommendedTrailsResponse {
  feeling: MoodLabel | string;
  recommended: ITrail[];
}

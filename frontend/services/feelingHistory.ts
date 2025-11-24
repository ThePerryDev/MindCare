// frontend/services/feelingHistory.ts

import { api } from './api';
import { FeelingLabel } from '@/constants/feelingsScale';

// Estrutura vinda do Mongo (ajuste se o schema estiver diferente)
export interface FeelingDTO {
  _id: string;
  user_id: string;
  day: string; // 'YYYY-MM-DD'
  sentimento_de_entrada: FeelingLabel;
  sentimento_de_saida: FeelingLabel;
  createdAt?: string;
  updatedAt?: string;
}

// Wrapper do GET /feelings
export async function listarFeelings(params?: {
  inicio?: string;
  fim?: string;
}): Promise<FeelingDTO[]> {
  const { data } = await api.get<{ feelings: FeelingDTO[] }>('/feelings', {
    params,
  });

  return data.feelings;
}

import { api } from '@/services/api';

export interface IFeelingBotUpsertPayload {
  day?: string; // 'YYYY-MM-DD' (opcional)
  sentimento: string; // texto vindo da API de emoções
  label?: string; // ex.: '23/11/2025' ou 'Hoje'
}

export interface IFeelingBotUpsertResponse {
  feelings_bot: unknown; // se quiser, depois tipamos melhor
}

export async function registrarSentimentoBot(
  payload: IFeelingBotUpsertPayload
): Promise<IFeelingBotUpsertResponse> {
  const { data } = await api.post<IFeelingBotUpsertResponse>(
    '/feeling-bot',
    payload
  );

  console.log('🟢 [FeelingBotService] Sentimento do BOT registrado:', data);

  return data;
}

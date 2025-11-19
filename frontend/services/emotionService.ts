// frontend/services/emotionService.ts
import { nlpApi } from './nlpApi';

export interface EmotionRequest {
  text: string;
}

export interface EmotionResponse {
  emocao: string;
  confianca_emocao: number;
  risco_crise: boolean;
  confianca_crise: number;
  mensagem_para_usuario: string;
}

export async function classifyEmotion(text: string): Promise<EmotionResponse> {
  const payload: EmotionRequest = { text };

  const { data } = await nlpApi.post<EmotionResponse>(
    '/emotions/classify',
    payload
  );

  return data;
}

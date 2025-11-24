// frontend/services/feeling.ts

import { api } from '@/services/api';
import {
  IFeelingEntradaPayload,
  IFeelingEntradaResponse,
  IFeelingSaidaPayload,
  IFeelingSaidaResponse,
} from '@/interfaces/feeling.interface';

/* ---------------------- REGISTRAR SENTIMENTO DE ENTRADA ---------------------- */

export async function registrarSentimentoEntrada(
  payload: IFeelingEntradaPayload
): Promise<IFeelingEntradaResponse> {
  const { data } = await api.post<IFeelingEntradaResponse>(
    '/feelings/entrada',
    payload
  );

  console.log('🟢 [FeelingService] Sentimento de ENTRADA registrado:', data);

  return data;
}

/* ---------------------- REGISTRAR SENTIMENTO DE SAÍDA ---------------------- */

export async function registrarSentimentoSaida(
  payload: IFeelingSaidaPayload
): Promise<IFeelingSaidaResponse> {
  const { data } = await api.post<IFeelingSaidaResponse>(
    '/feelings/saida',
    payload
  );

  console.log('🟢 [FeelingService] Sentimento de SAÍDA registrado:', data);

  return data;
}

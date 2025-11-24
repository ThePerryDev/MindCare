// frontend/interfaces/feeling.interface.ts

export type MoodLabel = 'Ansiedade' | 'Estresse' | 'Felicidade' | 'Tristeza';

/* ------------------------ SENTIMENTO DE ENTRADA ------------------------ */

export interface IFeelingEntradaPayload {
  day: string; // 'YYYY-MM-DD'
  sentimento_de_entrada: MoodLabel;
}

export interface IFeelingEntradaResponse {
  feeling: {
    id?: string; // mongoose pode retornar _id ou id
    _id?: string;
    user_id: string;
    day: string;
    sentimento_de_entrada: MoodLabel;
    sentimento_de_saida: MoodLabel; // sempre existirá (regras do backend)
    createdAt: string;
    updatedAt: string;
  };
}

/* ------------------------- SENTIMENTO DE SAÍDA ------------------------- */

export interface IFeelingSaidaPayload {
  day: string; // 'YYYY-MM-DD'
  sentimento_de_saida: MoodLabel;
}

export interface IFeelingSaidaResponse {
  feeling: {
    id?: string;
    _id?: string;
    user_id: string;
    day: string;
    sentimento_de_entrada: MoodLabel;
    sentimento_de_saida: MoodLabel;
    createdAt: string;
    updatedAt: string;
  };
}

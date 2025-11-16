// components/model/trilha/types.ts

export type TrilhaDay = {
  /** Dia da trilha (1 a 7) */
  day: number;
  /** Nome do micro-hábito do dia */
  microHabit: string;
  /** Duração em minutos (se não tiver tempo definido, pode ser null) */
  durationMinutes: number | null;
  /** Label bonitinha pra exibir na UI, ex: "5 min" ou "—" */
  durationLabel: string;
  /** Objetivo daquele micro-hábito */
  goal: string;
  benefits: [string, string, string];
  howTo: string[];
};

export type TrilhaModel = {
  /** ID numérico interno da trilha (pra você se organizar) */
  id: number;
  /** Chave única, usada em rotas / ids / map */
  key: string;
  /** Nome exibido da trilha */
  name: string;
  /** Subtítulo / foco principal da trilha */
  focus: string;
  /** Nível de dificuldade da trilha */
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Livre';
  /** Faixa de tempo aproximada por dia (pra card/resumo) */
  minMinutes: number | null;
  maxMinutes: number | null;
  /** Lista dos 7 dias com micro-hábitos */
  days: TrilhaDay[];
};

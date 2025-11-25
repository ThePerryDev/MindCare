// frontend/components/Trilhas/types.ts

export type TrilhaDayMode = 'timer' | 'checklist';

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
  /** Benefícios principais (livre) */
  benefits?: string[];
  /** Passo a passo da atividade */
  howTo?: string[];
  /**
   * Modo da atividade:
   * - 'timer' -> foco em tempo (respiração, meditação, etc.)
   * - 'checklist' -> foco em marcar passos (escrever, caminhar, etc.)
   * Se não informado, assume 'timer' por padrão na UI.
   */
  mode?: TrilhaDayMode;
};

export type TrilhaModel = {
  /** ID numérico interno da trilha (pra você se organizar) */
  id: number;
  /** Chave única, usada em rotas / ids / map / AsyncStorage */
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

import { TrilhaModel } from "../types";

/**
 * Trilha 10 – Mindfulness Básico (Iniciante – 5 a 10 min)
 */
export const trilhaMindfulnessBasico: TrilhaModel = {
  id: 10,
  key: 'trilha-mindfulness-basico',
  name: 'Trilha 10 – Mindfulness Básico',
  focus:
    'Desenvolver atenção plena e consciência do momento presente.',
  level: 'Iniciante',
  minMinutes: 5,
  maxMinutes: 10,
  days: [
    {
      day: 1,
      microHabit: 'Respiração consciente 4-4-4-4 (caixa)',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Desenvolver foco no presente',
    },
    {
      day: 2,
      microHabit:
        'Meditação guiada curta (atenção na respiração)',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Treinar concentração',
    },
    {
      day: 3,
      microHabit:
        'Caminhada mindful observando sons e cores',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Aumentar percepção',
    },
    {
      day: 4,
      microHabit:
        'Comer uma fruta lentamente, prestando atenção nos sentidos',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Praticar atenção plena',
    },
    {
      day: 5,
      microHabit:
        'Escaneamento corporal (da cabeça aos pés)',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Relaxar e observar sensações',
    },
    {
      day: 6,
      microHabit:
        'Anotar 3 momentos de presença vividos no dia',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Registrar experiências de mindfulness',
    },
    {
      day: 7,
      microHabit:
        'Revisão da semana: identificar mudança na atenção',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Autoavaliação',
    },
  ],
};
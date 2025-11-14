// components/model/trilha/trilha-ansiedade-leve/index.ts
import { TrilhaModel } from '../types';

export const trilhaAnsiedadeLeve: TrilhaModel = {
  id: 1,
  key: 'trilha-ansiedade-leve',
  name: 'Trilha 1 – Ansiedade Leve',
  focus: 'Foco no presente e redução de sintomas leves de ansiedade.',
  level: 'Iniciante',
  minMinutes: 5,
  maxMinutes: 8,
  days: [
    {
      day: 1,
      microHabit: 'Respiração 4-7-8 guiada',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Acalmar corpo e mente',
    },
    {
      day: 2,
      microHabit: 'Lista de preocupações → reclassificar o que pode ser feito agora',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Criar clareza',
    },
    {
      day: 3,
      microHabit: 'Alongamento leve de pescoço e ombros',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Reduzir tensão física',
    },
    {
      day: 4,
      microHabit: 'Mini-meditação guiada de 5 min',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Recentrar atenção',
    },
    {
      day: 5,
      microHabit: 'Diário de emoções: 3 linhas sobre o que sente',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Processar sentimentos',
    },
    {
      day: 6,
      microHabit: 'Música relaxante + respiração profunda',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Relaxamento profundo',
    },
    {
      day: 7,
      microHabit:
        'Revisão da semana (humor antes/depois) + Parabéns',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Reforço positivo',
    },
  ],
};

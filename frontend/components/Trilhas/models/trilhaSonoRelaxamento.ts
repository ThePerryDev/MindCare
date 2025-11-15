import { TrilhaModel } from '../types';

/**
 * Trilha 3 – Sono e Relaxamento
 */
export const trilhaSonoRelaxamento: TrilhaModel = {
  id: 3,
  key: 'trilha-sono-relaxamento',
  name: 'Trilha 3 – Sono e Relaxamento',
  focus: 'Melhorar qualidade do sono e relaxar corpo e mente.',
  level: 'Iniciante',
  minMinutes: 5,
  maxMinutes: 8,
  days: [
    {
      day: 1,
      microHabit: 'Respiração 4-7-8 na cama',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Induzir relaxamento',
    },
    {
      day: 2,
      microHabit: 'Desconexão digital 30 min antes de dormir',
      durationMinutes: null,
      durationLabel: '—',
      goal: 'Higiene do sono',
    },
    {
      day: 3,
      microHabit: 'Relaxamento muscular progressivo',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Reduzir tensão física',
    },
    {
      day: 4,
      microHabit: "Escrever 'lista de preocupações' antes de dormir",
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Esvaziar mente',
    },
    {
      day: 5,
      microHabit: 'Áudio de paisagem sonora',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Preparar ambiente',
    },
    {
      day: 6,
      microHabit: 'Alongamento para lombar e quadril',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Aliviar corpo',
    },
    {
      day: 7,
      microHabit: 'Reflexão do sono da semana + ajuste de rotina',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Melhorar consistência',
    },
  ],
};
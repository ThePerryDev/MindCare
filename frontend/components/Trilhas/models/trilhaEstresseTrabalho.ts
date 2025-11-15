import { TrilhaModel } from '../types';

/**
 * Trilha 2 – Estresse no Trabalho / Estudo
 */

export const trilhaEstresseTrabalho: TrilhaModel = {
  id: 2,
  key: 'trilha-estresse-trabalho-estudo',
  name: 'Trilha 2 – Estresse no Trabalho / Estudo',
  focus: 'Organizar mente e corpo em contextos de trabalho e estudo.',
  level: 'Intermediário',
  minMinutes: 5,
  maxMinutes: 8,
  days: [
    {
      day: 1,
      microHabit: 'Check-in + respiração caixa (4-4-4-4)',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Criar estabilidade',
    },
    {
      day: 2,
      microHabit: 'Escrever prioridades de hoje e descartar ruído',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Reduzir sobrecarga mental',
    },
    {
      day: 3,
      microHabit: 'Alongamento de punhos e costas',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Prevenir tensão',
    },
    {
      day: 4,
      microHabit: 'Técnica de visualização positiva',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Recuperar confiança',
    },
    {
      day: 5,
      microHabit: '10 afirmações positivas rápidas',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Reprogramar autodiálogo',
    },
    {
      day: 6,
      microHabit: 'Mini-pausa de gratidão: 3 coisas boas do dia',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Equilibrar percepção',
    },
    {
      day: 7,
      microHabit: 'Autoavaliação semanal + sugestão da próxima trilha',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Fechar ciclo',
    },
  ],
};
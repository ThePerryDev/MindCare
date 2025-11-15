import { TrilhaModel } from "../types";

/**
 * Trilha 13 – Controle da Ansiedade (Intermediário – 15 a 20 min)
 */
export const trilhaControleAnsiedade: TrilhaModel = {
  id: 13,
  key: 'trilha-controle-ansiedade',
  name: 'Trilha 13 – Controle da Ansiedade',
  focus:
    'Reduzir sintomas ansiosos e melhorar foco no presente.',
  level: 'Intermediário',
  minMinutes: 15,
  maxMinutes: 20,
  days: [
    {
      day: 1,
      microHabit: 'Respiração 4-7-8 guiada',
      durationMinutes: 15,
      durationLabel: '15 min',
      goal: 'Acalmar corpo e mente',
    },
    {
      day: 2,
      microHabit:
        'Meditação com atenção nos sons ao redor',
      durationMinutes: 18,
      durationLabel: '18 min',
      goal: 'Aumentar foco sensorial',
    },
    {
      day: 3,
      microHabit:
        'Escrita de preocupações + plano de ação realista',
      durationMinutes: 20,
      durationLabel: '20 min',
      goal: 'Organizar pensamentos',
    },
    {
      day: 4,
      microHabit:
        'Exercício físico leve (yoga ou alongamento)',
      durationMinutes: 15,
      durationLabel: '15 min',
      goal: 'Reduzir tensão corporal',
    },
    {
      day: 5,
      microHabit:
        'Técnica 5-4-3-2-1 (identificar sentidos)',
      durationMinutes: 18,
      durationLabel: '18 min',
      goal: 'Trazer atenção para o presente',
    },
    {
      day: 6,
      microHabit:
        'Caminhada consciente + foco na respiração',
      durationMinutes: 15,
      durationLabel: '15 min',
      goal: 'Diminuir agitação',
    },
    {
      day: 7,
      microHabit:
        'Revisão da semana: anotar gatilhos e avanços',
      durationMinutes: 15,
      durationLabel: '15 min',
      goal: 'Refletir sobre evolução',
    },
  ],
};
import { TrilhaModel } from "../types";

/**
 * Trilha 6 – Neutro
 */

export const trilhaNeutro: TrilhaModel = {
  id: 6,
  key: 'trilha-neutro',
  name: 'Trilha 6 – Neutro',
  focus: 'Aumentar consciência emocional e trazer leve energia.',
  level: 'Livre',
  minMinutes: null,
  maxMinutes: null,
  days: [
    {
      day: 1,
      microHabit: 'Meditação guiada 5 min',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Aumentar consciência emocional',
      benefits: [
        'Melhora a atenção ao momento presente',
        'Ajuda a perceber emoções sutis',
        'Reduz leve agitação mental',
      ],
    },
    {
      day: 2,
      microHabit: 'Escrever como foi o dia e pontos bons',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Identificar aspectos positivos',
      benefits: [
        'Fortalece a percepção do que deu certo',
        'Reduz foco excessivo no negativo',
        'Estimula autoconhecimento',
      ],
    },
    {
      day: 3,
      microHabit: 'Ouvir música calma',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Relaxar suavemente',
      benefits: [
        'Reduz tensão leve',
        'Acalma o ritmo dos pensamentos',
        'Cria sensação de acolhimento interno',
      ],
    },
    {
      day: 4,
      microHabit: 'Tomar chá/café com atenção plena',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Praticar presença através dos sentidos',
      benefits: [
        'Aumenta percepção sensorial',
        'Ajuda a desacelerar',
        'Cria um momento de pausa consciente no dia',
      ],
    },
    {
      day: 5,
      microHabit:
        'Respiração quadrada (4s inspirar, 4s segurar, 4s expirar, 4s segurar)',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Equilibrar corpo e mente',
      benefits: [
        'Estabiliza o ritmo respiratório',
        'Reduz leve ansiedade',
        'Melhora foco e clareza mental',
      ],
    },
    {
      day: 6,
      microHabit: 'Caminhar devagar prestando atenção ao ambiente',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Trazer leve energia',
      benefits: [
        'Estimula circulação e disposição',
        'Aumenta contato com o ambiente externo',
        'Ajuda a sair do “modo automático”',
      ],
    },
    {
      day: 7,
      microHabit: 'Listar uma pequena meta para a semana',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Direcionar energia',
      benefits: [
        'Aumenta senso de propósito',
        'Facilita organização da rotina',
        'Gera motivação leve e sustentável',
      ],
    },
  ],
};
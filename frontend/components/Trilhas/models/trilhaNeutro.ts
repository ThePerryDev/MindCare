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
      microHabit: 'Meditar guiado por 5 min.',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Trazer presença e calma',
    },
    {
      day: 2,
      microHabit: 'Escrever como foi o dia e identificar pontos bons.',
      durationMinutes: null,
      durationLabel: '—',
      goal: 'Perceber aspectos positivos',
    },
    {
      day: 3,
      microHabit: 'Tocar ou ouvir uma música calma.',
      durationMinutes: null,
      durationLabel: '—',
      goal: 'Relaxar e acalmar mente',
    },
    {
      day: 4,
      microHabit:
        'Tomar um chá/café observando os aromas e sabores.',
      durationMinutes: null,
      durationLabel: '—',
      goal: 'Praticar atenção plena nos sentidos',
    },
    {
      day: 5,
      microHabit:
        'Fazer respiração quadrada (4s inspirar, 4s segurar, 4s expirar, 4s segurar).',
      durationMinutes: null,
      durationLabel: '—',
      goal: 'Estabilizar respiração e mente',
    },
    {
      day: 6,
      microHabit:
        'Caminhar devagar prestando atenção ao ambiente.',
      durationMinutes: null,
      durationLabel: '—',
      goal: 'Engajar corpo e atenção',
    },
    {
      day: 7,
      microHabit: 'Listar uma meta pequena para a semana.',
      durationMinutes: null,
      durationLabel: '—',
      goal: 'Trazer direção e leve motivação',
    },
  ],
};
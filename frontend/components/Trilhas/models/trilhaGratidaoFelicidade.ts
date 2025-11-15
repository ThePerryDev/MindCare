import { TrilhaModel } from "../types";

/**
 * Trilha 12 – Gratidão e Felicidade (Iniciante – 5 a 10 min)
 */
export const trilhaGratidaoFelicidade: TrilhaModel = {
  id: 12,
  key: 'trilha-gratidao-felicidade',
  name: 'Trilha 12 – Gratidão e Felicidade',
  focus: 'Aumentar bem-estar e cultivar emoções positivas.',
  level: 'Iniciante',
  minMinutes: 5,
  maxMinutes: 10,
  days: [
    {
      day: 1,
      microHabit:
        'Escrever 3 coisas pelas quais é grato hoje',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Cultivar gratidão',
    },
    {
      day: 2,
      microHabit:
        'Compartilhar uma mensagem positiva com alguém',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Gerar conexão social',
    },
    {
      day: 3,
      microHabit:
        'Playlist curta de músicas felizes + movimento corporal',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Ativar energia positiva',
    },
    {
      day: 4,
      microHabit:
        'Registrar uma vitória recente (mesmo pequena)',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Reforçar autoconfiança',
    },
    {
      day: 5,
      microHabit:
        'Pequeno ato de gentileza com alguém',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Aumentar bem-estar social',
    },
    {
      day: 6,
      microHabit:
        'Visualização de um momento feliz do passado',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Reforçar memórias positivas',
    },
    {
      day: 7,
      microHabit:
        'Revisão da semana: escrever o maior motivo de gratidão',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Fechar ciclo com reflexão positiva',
    },
  ],
};
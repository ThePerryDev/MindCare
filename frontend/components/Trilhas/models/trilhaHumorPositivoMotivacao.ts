import { TrilhaModel } from "../types";

/**
 * Trilha 4 – Humor Positivo e Motivação
 */
export const trilhaHumorPositivoMotivacao: TrilhaModel = {
  id: 4,
  key: 'trilha-humor-positivo-motivacao',
  name: 'Trilha 4 – Humor Positivo e Motivação',
  focus: 'Aumentar energia, motivação e emoções positivas.',
  level: 'Iniciante',
  minMinutes: 3,
  maxMinutes: 7,
  days: [
    {
      day: 1,
      microHabit: 'Playlist motivacional + movimento',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Ativar energia',
    },
    {
      day: 2,
      microHabit: 'Escrever uma vitória recente',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Reforçar autoconfiança',
    },
    {
      day: 3,
      microHabit: 'Praticar sorriso consciente',
      durationMinutes: 3,
      durationLabel: '3 min',
      goal: 'Melhorar humor instantâneo',
    },
    {
      day: 4,
      microHabit: 'Vídeo curto inspirador',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Estimular esperança',
    },
    {
      day: 5,
      microHabit: 'Pequeno ato de gentileza (registrar no app)',
      durationMinutes: null,
      durationLabel: '—',
      goal: 'Criar conexão social',
    },
    {
      day: 6,
      microHabit: "Visualização do 'eu ideal'",
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Inspirar ação futura',
    },
    {
      day: 7,
      microHabit: 'Check-out + escolha da próxima trilha',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Continuidade',
    },
  ],
};

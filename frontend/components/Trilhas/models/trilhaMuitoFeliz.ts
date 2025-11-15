import { TrilhaModel } from "../types";

/**
 * Trilha 5 – Muito Feliz
 * (Objetivo da trilha aplicado como foco; como não há duração, usei null/“—”)
 */
export const trilhaMuitoFeliz: TrilhaModel = {
  id: 5,
  key: 'trilha-muito-feliz',
  name: 'Trilha 5 – Muito Feliz',
  focus: 'Manter o bem-estar e reforçar emoções positivas.',
  level: 'Livre',
  minMinutes: null,
  maxMinutes: null,
  days: [
    {
      day: 1,
      microHabit: 'Escrever 3 coisas pelas quais é grato.',
      durationMinutes: null,
      durationLabel: '—',
      goal: 'Cultivar gratidão e bem-estar',
    },
    {
      day: 2,
      microHabit: 'Compartilhar uma mensagem positiva com alguém.',
      durationMinutes: null,
      durationLabel: '—',
      goal: 'Gerar conexão positiva',
    },
    {
      day: 3,
      microHabit: 'Fazer respiração profunda consciente por 5 min.',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Aprofundar relaxamento',
    },
    {
      day: 4,
      microHabit: 'Caminhar ao ar livre ouvindo uma música animada.',
      durationMinutes: null,
      durationLabel: '—',
      goal: 'Ativar energia e prazer',
    },
    {
      day: 5,
      microHabit: 'Registrar em diário um momento marcante do dia.',
      durationMinutes: null,
      durationLabel: '—',
      goal: 'Reforçar memórias positivas',
    },
    {
      day: 6,
      microHabit: 'Fazer alongamento leve.',
      durationMinutes: null,
      durationLabel: '—',
      goal: 'Cuidar do corpo',
    },
    {
      day: 7,
      microHabit: 'Ouvir uma música favorita e cantar junto.',
      durationMinutes: null,
      durationLabel: '—',
      goal: 'Aumentar alegria',
    },
  ],
};
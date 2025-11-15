import { TrilhaModel } from "../types";

/**
 * Trilha 11 – Alívio do Estresse (Intermediário – 10 a 15 min)
 */
export const trilhaAlivioEstresse: TrilhaModel = {
  id: 11,
  key: 'trilha-alivio-estresse',
  name: 'Trilha 11 – Alívio do Estresse',
  focus: 'Reduzir tensão física e mental.',
  level: 'Intermediário',
  minMinutes: 10,
  maxMinutes: 15,
  days: [
    {
      day: 1,
      microHabit:
        'Respiração profunda com música relaxante',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Diminuir ritmo e relaxar',
    },
    {
      day: 2,
      microHabit:
        'Alongamento de pescoço, ombros e costas',
      durationMinutes: 12,
      durationLabel: '12 min',
      goal: 'Reduzir tensão física',
    },
    {
      day: 3,
      microHabit:
        'Escrever preocupações e classificá-las (resolver/agendar/soltar)',
      durationMinutes: 15,
      durationLabel: '15 min',
      goal: 'Criar clareza mental',
    },
    {
      day: 4,
      microHabit: 'Relaxamento muscular progressivo',
      durationMinutes: 12,
      durationLabel: '12 min',
      goal: 'Soltar tensões acumuladas',
    },
    {
      day: 5,
      microHabit: "Visualização de um 'lugar seguro'",
      durationMinutes: 15,
      durationLabel: '15 min',
      goal: 'Gerar sensação de calma',
    },
    {
      day: 6,
      microHabit:
        'Caminhada leve focada no ritmo da respiração',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Integrar corpo e mente',
    },
    {
      day: 7,
      microHabit:
        'Autoavaliação: identificar situações de estresse da semana e estratégias úteis',
      durationMinutes: 12,
      durationLabel: '12 min',
      goal: 'Refletir sobre avanços',
    },
  ],
};

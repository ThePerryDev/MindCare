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
      microHabit: 'Respiração profunda com música relaxante',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Diminuir ritmo e relaxar',
      benefits: [
        'Reduz ativação do sistema de alerta',
        'Ajuda a desacelerar os pensamentos',
        'Promove sensação de descanso mental',
      ],
    },
    {
      day: 2,
      microHabit: 'Alongamento de pescoço, ombros e costas',
      durationMinutes: 12,
      durationLabel: '12 min',
      goal: 'Reduzir tensão física',
      benefits: [
        'Alivia dores causadas por má postura e estresse',
        'Melhora mobilidade da coluna',
        'Reduz sensação de peso nas costas',
      ],
    },
    {
      day: 3,
      microHabit:
        'Escrever preocupações e classificá-las (resolver / agendar / soltar)',
      durationMinutes: 15,
      durationLabel: '15 min',
      goal: 'Criar clareza mental',
      benefits: [
        'Separar o que é realmente ação de preocupação inútil',
        'Diminui sobrecarga mental',
        'Ajuda a definir próximos passos de forma mais calma',
      ],
    },
    {
      day: 4,
      microHabit: 'Relaxamento muscular progressivo',
      durationMinutes: 12,
      durationLabel: '12 min',
      goal: 'Soltar tensões acumuladas',
      benefits: [
        'Alterna tensão e relaxamento de grupos musculares',
        'Ajuda o corpo a reconhecer estados de relaxamento',
        'Reduz sintomas físicos do estresse',
      ],
    },
    {
      day: 5,
      microHabit: "Visualização de um 'lugar seguro'",
      durationMinutes: 15,
      durationLabel: '15 min',
      goal: 'Gerar sensação de calma interna',
      benefits: [
        'Cria um refúgio mental em momentos difíceis',
        'Reduz sensação de ameaça constante',
        'Aumenta sensação de proteção emocional',
      ],
    },
    {
      day: 6,
      microHabit: 'Caminhada leve focando na respiração',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Integrar corpo e mente',
      benefits: [
        'Une movimento corporal e atenção plena',
        'Reduz estresse acumulado no fim do dia',
        'Melhora disposição física e mental',
      ],
    },
    {
      day: 7,
      microHabit:
        'Autoavaliação: situações de estresse e estratégias úteis na semana',
      durationMinutes: 12,
      durationLabel: '12 min',
      goal: 'Refletir sobre avanços',
      benefits: [
        'Ajuda a perceber gatilhos e respostas mais saudáveis',
        'Fortalece repertório de enfrentamento do estresse',
        'Cria plano de melhoria contínua',
      ],
    },
  ],
};

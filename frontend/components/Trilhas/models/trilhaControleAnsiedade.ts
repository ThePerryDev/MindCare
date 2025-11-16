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
      benefits: [
        'Reduz sintomas físicos de ansiedade (taquicardia, falta de ar)',
        'Ajuda a regular o sistema nervoso autônomo',
        'Cria base de segurança interna',
      ],
    },
    {
      day: 2,
      microHabit: 'Meditação focada nos sons ao redor',
      durationMinutes: 18,
      durationLabel: '18 min',
      goal: 'Aumentar foco sensorial',
      benefits: [
        'Desvia a atenção de pensamentos ansiosos para os sentidos',
        'Ajuda a ancorar no presente',
        'Reduz rumininação mental',
      ],
    },
    {
      day: 3,
      microHabit: 'Escrever preocupações + plano de ação realista',
      durationMinutes: 20,
      durationLabel: '20 min',
      goal: 'Organizar pensamentos',
      benefits: [
        'Transforma preocupação em ações concretas ou aceitação',
        'Reduz sensação de descontrole',
        'Melhora clareza sobre o que é possível fazer hoje',
      ],
    },
    {
      day: 4,
      microHabit: 'Exercício físico leve (yoga ou alongamento)',
      durationMinutes: 15,
      durationLabel: '15 min',
      goal: 'Reduzir tensão corporal',
      benefits: [
        'Libera hormônios de bem-estar',
        'Diminui sensação de inquietação',
        'Ajuda o corpo a “gastar” energia da ansiedade',
      ],
    },
    {
      day: 5,
      microHabit: 'Técnica 5-4-3-2-1 (sentidos)',
      durationMinutes: 18,
      durationLabel: '18 min',
      goal: 'Trazer atenção para o presente',
      benefits: [
        'Ajuda em momentos de crise de ansiedade',
        'Desconecta de pensamentos catastróficos',
        'Fortalece senso de “estou aqui e agora, em segurança”',
      ],
    },
    {
      day: 6,
      microHabit: 'Caminhada consciente focando na respiração',
      durationMinutes: 15,
      durationLabel: '15 min',
      goal: 'Diminuir agitação',
      benefits: [
        'Une movimento físico com foco respiratório',
        'Reduz inquietação psicomotora',
        'Aumenta sensação de equilíbrio físico e mental',
      ],
    },
    {
      day: 7,
      microHabit: 'Revisão da semana: gatilhos e avanços',
      durationMinutes: 15,
      durationLabel: '15 min',
      goal: 'Refletir sobre evolução',
      benefits: [
        'Ajuda a identificar padrões de ansiedade',
        'Fortalece estratégias que funcionaram melhor',
        'Cria senso de progresso no controle da ansiedade',
      ],
    },
  ],
};
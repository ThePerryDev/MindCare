import { TrilhaModel } from '../types';

/**
 * Trilha 1 – Ansiedade Leve / Foco no Presente
 */
export const trilhaAnsiedadeLeve: TrilhaModel = {
  id: 1,
  key: 'trilha-ansiedade-leve',
  name: 'Trilha 1 – Ansiedade Leve',
  focus: 'Foco no presente e redução de sintomas leves de ansiedade.',
  level: 'Iniciante',
  minMinutes: 5,
  maxMinutes: 8,
   days: [
    {
      day: 1,
      microHabit: 'Respiração 4-7-8 guiada',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Acalmar corpo e mente',
      benefits: [
        'Reduz rapidamente ansiedade fisiológica',
        'Diminui frequência cardíaca e tensão muscular',
        'Ajuda a controlar pensamentos acelerados',
      ],
    },
    {
      day: 2,
      microHabit: 'Lista de preocupações + reclassificação',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Criar clareza mental',
      benefits: [
        'Ajuda a diferenciar o que é real do que é antecipação',
        'Reduz sensação de sobrecarga mental',
        'Organiza ações e evita rumininação',
      ],
    },
    {
      day: 3,
      microHabit: 'Alongamento leve de pescoço e ombros',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Reduzir tensão física',
      benefits: [
        'Libera tensão acumulada típica da ansiedade',
        'Melhora a postura e respiração',
        'Promove relaxamento muscular imediato',
      ],
    },
    {
      day: 4,
      microHabit: 'Mini-meditação guiada',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Recentrar atenção',
      benefits: [
        'Reduz distração e pensamentos invasivos',
        'Aumenta foco no presente',
        'Induz sensação de calma profunda',
      ],
    },
    {
      day: 5,
      microHabit: 'Diário de emoções',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Processar sentimentos',
      benefits: [
        'Ajuda a expressar emoções acumuladas',
        'Aumenta clareza emocional',
        'Reduz sensação de “bola na garganta”',
      ],
    },
    {
      day: 6,
      microHabit: 'Música relaxante + respiração profunda',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Relaxamento profundo',
      benefits: [
        'Diminui tensão corporal e mental',
        'Melhora humor e sensação de segurança',
        'Estabiliza o sistema nervoso autônomo',
      ],
    },
    {
      day: 7,
      microHabit: 'Revisão da semana + Parabéns',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Reforço positivo',
      benefits: [
        'Aumenta percepção de evolução',
        'Fortalece motivação para continuar hábitos saudáveis',
        'Melhora autoestima e autocuidado',
      ],
    },
  ],
};
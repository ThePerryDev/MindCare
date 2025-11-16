import { TrilhaModel } from '../types';

/**
 * Trilha 3 – Sono e Relaxamento
 */
export const trilhaSonoRelaxamento: TrilhaModel = {
  id: 3,
  key: 'trilha-sono-relaxamento',
  name: 'Trilha 3 – Sono e Relaxamento',
  focus: 'Melhorar qualidade do sono e relaxar corpo e mente.',
  level: 'Iniciante',
  minMinutes: 5,
  maxMinutes: 8,
  days: [
    {
      day: 1,
      microHabit: 'Respiração 4-7-8 na cama',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Induzir relaxamento',
      benefits: [
        'Aumenta sonolência natural',
        'Diminui ritmo cardíaco',
        'Ajuda a pegar no sono mais rápido',
      ],
    },
    {
      day: 2,
      microHabit: 'Desconexão digital 30 min antes',
      durationMinutes: 0,
      durationLabel: '—',
      goal: 'Higiene do sono',
      benefits: [
        'Reduz estímulo cerebral',
        'Melhora qualidade do sono',
        'Evita efeitos da luz azul no cérebro',
      ],
    },
    {
      day: 3,
      microHabit: 'Relaxamento muscular progressivo',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Reduzir tensão física',
      benefits: [
        'Libera contrações involuntárias',
        'Acalma o sistema nervoso',
        'Ajuda a adormecer mais rápido',
      ],
    },
    {
      day: 4,
      microHabit: 'Lista de preocupações antes de dormir',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Esvaziar mente',
      benefits: [
        'Reduz ansiedade antecipatória',
        'Evita rumininação na cama',
        'Melhora sensação de segurança emocional',
      ],
    },
    {
      day: 5,
      microHabit: 'Áudio de paisagem sonora',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Preparar ambiente',
      benefits: [
        'Cria ambiente sonoro relaxante',
        'Reduz ruídos externos incômodos',
        'Induz estado meditativo leve',
      ],
    },
    {
      day: 6,
      microHabit: 'Alongamento para lombar e quadril',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Aliviar corpo',
      benefits: [
        'Reduz tensão acumulada ao longo do dia',
        'Melhora conforto ao deitar',
        'Aumenta relaxamento muscular',
      ],
    },
    {
      day: 7,
      microHabit: 'Reflexão semanal do sono',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Melhorar consistência',
      benefits: [
        'Identifica padrões de sono',
        'Melhora rotina noturna',
        'Aumenta autoconsciência sobre descanso',
      ],
    },
  ],
};
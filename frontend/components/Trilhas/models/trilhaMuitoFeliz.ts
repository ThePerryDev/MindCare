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
      microHabit: 'Playlist motivacional + movimento',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Ativar energia',
      benefits: [
        'Aumenta dopamina',
        'Melhora disposição imediata',
        'Desbloqueia sensação de estagnação',
      ],
    },
    {
      day: 2,
      microHabit: 'Escrever uma vitória recente',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Reforçar autoconfiança',
      benefits: [
        'Melhora autoestima',
        'Reduz autocrítica',
        'Fortalece percepção de capacidade própria',
      ],
    },
    {
      day: 3,
      microHabit: 'Sorriso consciente',
      durationMinutes: 3,
      durationLabel: '3 min',
      goal: 'Melhorar humor imediato',
      benefits: [
        'Ativa músculos ligados ao bem-estar',
        'Engana o cérebro a liberar serotonina',
        'Melhora disposição instantaneamente',
      ],
    },
    {
      day: 4,
      microHabit: 'Vídeo curto inspirador',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Estimular esperança',
      benefits: [
        'Aumenta motivação',
        'Reduz sensação de desânimo',
        'Gera novas perspectivas',
      ],
    },
    {
      day: 5,
      microHabit: 'Pequeno ato de gentileza',
      durationMinutes: 0,
      durationLabel: '—',
      goal: 'Criar conexão social',
      benefits: [
        'Melhora humor próprio e de outra pessoa',
        'Reduz solidão emocional',
        'Gera sensação de propósito',
      ],
    },
    {
      day: 6,
      microHabit: 'Visualização do “eu ideal”',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Inspirar ação futura',
      benefits: [
        'Aumenta foco em objetivos',
        'Reduz insegurança',
        'Melhora clareza do que deseja ser',
      ],
    },
    {
      day: 7,
      microHabit: 'Check-out + escolha da próxima trilha',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Continuidade',
      benefits: [
        'Fortalece disciplina emocional',
        'Aumenta engajamento',
        'Estimula autocuidado constante',
      ],
    },
  ],
};
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
      microHabit: 'Escrever 3 coisas pelas quais é grato hoje',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Cultivar gratidão',
      benefits: [
        'Aumenta foco no que há de bom',
        'Reduz comparação excessiva com outros',
        'Melhora bem-estar emocional geral',
      ],
    },
    {
      day: 2,
      microHabit: 'Compartilhar mensagem positiva com alguém',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Gerar conexão social',
      benefits: [
        'Fortalece laços afetivos',
        'Melhora humor de quem envia e de quem recebe',
        'Aumenta sensação de pertencimento',
      ],
    },
    {
      day: 3,
      microHabit: 'Playlist de músicas felizes + movimento corporal',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Ativar energia positiva',
      benefits: [
        'Aumenta dopamina e serotonina',
        'Reduz sensação de letargia',
        'Melhora disposição para o resto do dia',
      ],
    },
    {
      day: 4,
      microHabit: 'Registrar vitória recente (mesmo pequena)',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Reforçar autoconfiança',
      benefits: [
        'Ajuda a enxergar conquistas que passariam despercebidas',
        'Fortalece sensação de competência',
        'Reduz autocrítica exagerada',
      ],
    },
    {
      day: 5,
      microHabit: 'Pequeno ato de gentileza com alguém',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Aumentar bem-estar social',
      benefits: [
        'Gera sensação de propósito',
        'Melhora clima nas relações',
        'Aumenta empatia e compaixão',
      ],
    },
    {
      day: 6,
      microHabit: 'Visualização de um momento feliz do passado',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Reforçar memórias positivas',
      benefits: [
        'Ajuda a recordar sensações boas já vividas',
        'Equilibra lembranças difíceis com lembranças boas',
        'Fortalece esperança e otimismo',
      ],
    },
    {
      day: 7,
      microHabit: 'Revisão da semana: maior motivo de gratidão',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Fechar ciclo com reflexão positiva',
      benefits: [
        'Cria síntese dos aprendizados positivos da semana',
        'Ajuda a manter gratidão como hábito',
        'Aumenta satisfação com a própria vida',
      ],
    },
  ],
};
import { TrilhaModel } from "../types";

/**
 * Trilha 7 – Triste
 */
export const trilhaTriste: TrilhaModel = {
  id: 7,
  key: 'trilha-triste',
  name: 'Trilha 7 – Triste',
  focus: 'Acolher a emoção e estimular autocompaixão.',
  level: 'Livre',
  minMinutes: null,
  maxMinutes: null,
  days: [
    {
      day: 1,
      microHabit: 'Escrever livremente sobre o que sente',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Acolher a emoção',
      benefits: [
        'Ajuda a dar nome ao que está sentindo',
        'Reduz sensação de nó na garganta ou no peito',
        'Previne acúmulo de emoções não expressas',
      ],
    },
    {
      day: 2,
      microHabit: 'Respiração 4-7-8',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Acalmar o corpo',
      benefits: [
        'Reduz agitação interna causada pela tristeza',
        'Ajudar a diminuir aperto no peito',
        'Promove sensação de relaxamento suave',
      ],
    },
    {
      day: 3,
      microHabit: 'Ouvir música calma e relaxante',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Criar espaço seguro interno',
      benefits: [
        'Ajuda a regular o humor sem ignorar a tristeza',
        'Cria sensação de acolhimento emocional',
        'Diminui sensação de solidão',
      ],
    },
    {
      day: 4,
      microHabit: 'Lista de coisas que já superou',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Resgatar força interna',
      benefits: [
        'Lembra da própria capacidade de superar desafios',
        'Reforça autoestima',
        'Reduz sensação de impotência',
      ],
    },
    {
      day: 5,
      microHabit: 'Alongamento focado em ombros e peito',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Abrir espaço para respirar melhor',
      benefits: [
        'Reduz postura encolhida típica da tristeza',
        'Alivia tensões acumuladas na parte superior do corpo',
        'Promove sensação de leveza corporal',
      ],
    },
    {
      day: 6,
      microHabit: 'Enviar mensagem para alguém de confiança',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Compartilhar o peso emocional',
      benefits: [
        'Reduz sensação de isolamento',
        'Fortalece vínculo com pessoas importantes',
        'Ajuda a se sentir visto e ouvido',
      ],
    },
    {
      day: 7,
      microHabit: 'Assistir a um vídeo curto engraçado ou inspirador',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Trazer leveza',
      benefits: [
        'Gera pequenos momentos de alegria',
        'Ajuda a quebrar ciclos de pensamentos tristes',
        'Aumenta esperança em dias melhores',
      ],
    },
  ],
};

import { TrilhaModel } from "../types";

/**
 * Trilha 8 – Irritado
 */
export const trilhaIrritado: TrilhaModel = {
  id: 8,
  key: 'trilha-irritado',
  name: 'Trilha 8 – Irritado',
  focus: 'Descarregar tensão e recuperar clareza mental.',
  level: 'Livre',
  minMinutes: null,
  maxMinutes: null,
  days: [
    {
      day: 1,
      microHabit: 'Exercício físico rápido (polichinelo ou corrida parada)',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Descarregar tensão física',
      benefits: [
        'Libera adrenalina acumulada',
        'Reduz agitação corporal',
        'Facilita relaxamento após o esforço',
      ],
    },
    {
      day: 2,
      microHabit: 'Escrever motivos da raiva e amassar o papel',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Externalizar a irritação',
      benefits: [
        'Ajuda a tirar a raiva da cabeça e colocar no papel',
        'Cria sensação simbólica de liberação',
        'Reduz probabilidade de explosões emocionais',
      ],
    },
    {
      day: 3,
      microHabit: 'Técnica do “tempo fora” com 10 respirações profundas',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Recuperar clareza mental',
      benefits: [
        'Aumenta distância entre emoção e reação',
        'Reduz impulsividade',
        'Ajuda a responder em vez de reagir automaticamente',
      ],
    },
    {
      day: 4,
      microHabit: 'Alongamento de pescoço e mandíbula',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Soltar pontos de tensão',
      benefits: [
        'Alivia apertamento da mandíbula',
        'Reduz dor de cabeça por tensão',
        'Relaxar músculos usados em momentos de irritação',
      ],
    },
    {
      day: 5,
      microHabit: 'Ouvir música rítmica (dançar se possível)',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Transformar energia em movimento saudável',
      benefits: [
        'Canaliza irritação em algo construtivo',
        'Melhora humor após o movimento',
        'Aumenta sensação de liberdade corporal',
      ],
    },
    {
      day: 6,
      microHabit: 'Caminhada curta para esfriar a cabeça',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Reduzir sobrecarga mental',
      benefits: [
        'Afasta do gatilho da irritação por alguns minutos',
        'Ajuda a organizar pensamentos',
        'Promove sensação de reset mental',
      ],
    },
    {
      day: 7,
      microHabit: 'Banho consciente, focando na sensação da água',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Encerrar o ciclo de irritação',
      benefits: [
        'Ajuda a relaxar musculatura e mente',
        'Gera sensação de limpeza emocional',
        'Cria momento de cuidado com o próprio corpo',
      ],
    },
  ],
};
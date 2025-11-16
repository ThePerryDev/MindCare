import { TrilhaModel } from "../types";

/**
 * Trilha 10 – Mindfulness Básico (Iniciante – 5 a 10 min)
 */
export const trilhaMindfulnessBasico: TrilhaModel = {
  id: 10,
  key: 'trilha-mindfulness-basico',
  name: 'Trilha 10 – Mindfulness Básico',
  focus:
    'Desenvolver atenção plena e consciência do momento presente.',
  level: 'Iniciante',
  minMinutes: 5,
  maxMinutes: 10,
  days: [
    {
      day: 1,
      microHabit: 'Respiração consciente 4-4-4-4 (caixa)',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Desenvolver foco no presente',
      benefits: [
        'Estabiliza o ritmo respiratório',
        'Ajuda a treinar a atenção em um único ponto',
        'Reduz dispersão mental',
      ],
    },
    {
      day: 2,
      microHabit: 'Meditação guiada curta (atenção na respiração)',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Treinar concentração',
      benefits: [
        'Fortalece capacidade de retornar ao foco',
        'Reduz pensamentos automáticos',
        'Cria base para práticas mais longas',
      ],
    },
    {
      day: 3,
      microHabit: 'Caminhada mindful observando sons e cores',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Aumentar percepção',
      benefits: [
        'Expande consciência do ambiente',
        'Ajuda a sair do piloto automático',
        'Aumenta sensação de presença física',
      ],
    },
    {
      day: 4,
      microHabit: 'Comer uma fruta lentamente, sentindo os sentidos',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Praticar atenção plena no ato de comer',
      benefits: [
        'Reduz comer automático ou emocional',
        'Aumenta apreciação do alimento',
        'Conecta corpo e mente na mesma experiência',
      ],
    },
    {
      day: 5,
      microHabit: 'Escaneamento corporal da cabeça aos pés',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Observar sensações físicas',
      benefits: [
        'Aumenta percepção corporal',
        'Ajuda a identificar tensões escondidas',
        'Promove relaxamento profundo gradual',
      ],
    },
    {
      day: 6,
      microHabit: 'Anotar 3 momentos de presença vividos no dia',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Registrar experiências de mindfulness',
      benefits: [
        'Reforça o hábito de estar presente',
        'Ajuda a lembrar que momentos simples podem ser profundos',
        'Aumenta consistência da prática',
      ],
    },
    {
      day: 7,
      microHabit: 'Revisão da semana: mudança na atenção',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Autoavaliação consciente',
      benefits: [
        'Ajuda a perceber evolução na atenção plena',
        'Fortalece motivação para continuar praticando',
        'Traz clareza sobre o que funcionou melhor',
      ],
    },
  ],
};
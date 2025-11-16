import { TrilhaModel } from "../types";

/**
 * Trilha 10 – Mindfulness Básico (Iniciante – 5 a 10 min)
 */
export const trilhaMindfulnessBasico: TrilhaModel = {
  id: 10,
  key: 'trilha-mindfulness-basico',
  name: 'Trilha 10 – Mindfulness Básico',
  focus: 'Desenvolver atenção plena e consciência do momento presente.',
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
        'Ajuda a estabilizar o ritmo da respiração',
        'Traz a atenção para o aqui e agora',
        'Reduz leve agitação mental',
      ],
      howTo: [
        'Sente-se confortavelmente com a coluna ereta e pés apoiados no chão.',
        'Inspire pelo nariz por 4 segundos, contando mentalmente.',
        'Segure o ar por 4 segundos, sem forçar.',
        'Expire pela boca por 4 segundos.',
        'Permaneça com os pulmões vazios por 4 segundos.',
        'Repita esse ciclo várias vezes, imaginando que está desenhando um quadrado com a respiração.',
      ],
    },
    {
      day: 2,
      microHabit: 'Meditação guiada curta (atenção na respiração)',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Treinar concentração',
      benefits: [
        'Fortalece a capacidade de manter o foco em um ponto',
        'Ajuda a perceber quando a mente se distrai',
        'Promove mais clareza e presença no dia a dia',
      ],
      howTo: [
        'Escolha uma meditação guiada curta com foco na respiração (cerca de 5 a 7 minutos).',
        'Sente-se ou deite-se em uma posição confortável.',
        'Dê play no áudio e acompanhe as instruções com curiosidade, sem cobrança.',
        'Sempre que perceber que a mente se distraiu, apenas volte a focar na respiração, sem se julgar.',
        'Ao final, perceba como está seu corpo e sua mente em comparação ao início.',
      ],
    },
    {
      day: 3,
      microHabit: 'Caminhada mindful observando sons e cores',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Aumentar percepção',
      benefits: [
        'Amplia a consciência do ambiente ao redor',
        'Ajuda a sair do piloto automático durante o movimento',
        'Conecta corpo, sentidos e mente no momento presente',
      ],
      howTo: [
        'Escolha um local seguro para caminhar alguns minutos.',
        'Comece a caminhar em um ritmo confortável.',
        'Direcione a atenção para os sons que você escuta: carros, vozes, vento, pássaros.',
        'Depois, volte a atenção para as cores, formas e detalhes que vê pelo caminho.',
        'Sempre que perceber que se perdeu em pensamentos, volte aos sons ou às cores.',
      ],
    },
    {
      day: 4,
      microHabit:
        'Comer uma fruta lentamente, prestando atenção nos sentidos',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Praticar atenção plena',
      benefits: [
        'Transforma um ato comum em experiência de presença',
        'Aumenta a percepção de sabor e textura',
        'Ajuda a desacelerar a mente usando os sentidos',
      ],
      howTo: [
        'Escolha uma fruta que você goste.',
        'Observe a cor, formato e textura antes de comer.',
        'Aproxime a fruta do nariz e perceba o aroma.',
        'Dê uma pequena mordida e mastigue devagar, sentindo o sabor e a textura.',
        'Evite mexer no celular ou fazer outra coisa enquanto come.',
        'Mantenha a atenção nos sentidos do início ao fim da fruta.',
      ],
    },
    {
      day: 5,
      microHabit: 'Escaneamento corporal (da cabeça aos pés)',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Relaxar e observar sensações',
      benefits: [
        'Aumenta a consciência sobre o corpo e suas tensões',
        'Ajuda a identificar partes que pedem mais cuidado',
        'Promove relaxamento gradual e profundo',
      ],
      howTo: [
        'Deite-se ou sente-se em uma posição em que possa relaxar o corpo.',
        'Feche os olhos e comece levando a atenção para o topo da cabeça.',
        'Vá descendo a atenção lentamente: testa, olhos, mandíbula, pescoço, ombros, braços, mãos, peito, barriga, quadris, pernas e pés.',
        'Em cada região, note se há alguma tensão, desconforto ou sensação neutra.',
        'Não tente mudar nada; apenas observe. Se quiser, pode respirar fundo nas áreas mais tensas.',
      ],
    },
    {
      day: 6,
      microHabit: 'Anotar 3 momentos de presença vividos no dia',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Registrar experiências de mindfulness',
      benefits: [
        'Ajuda a perceber que momentos de presença já acontecem naturalmente',
        'Fortalece o hábito de notar o que acontece no agora',
        'Cria um registro de pequenas práticas ao longo dos dias',
      ],
      howTo: [
        'No fim do dia, pegue um caderno ou aplicativo de notas.',
        'Pense em três momentos em que você esteve mais presente (por exemplo: durante um banho, ao ouvir alguém, ao caminhar).',
        'Anote cada um em uma linha, descrevendo rapidamente o que estava fazendo.',
        'Observe se esses momentos trouxeram alguma sensação diferente (calma, foco, curiosidade).',
        'Leia a lista e reconheça que você já está praticando atenção plena em pequenos instantes.',
      ],
    },
    {
      day: 7,
      microHabit: 'Revisão da semana: identificar mudança na atenção',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Autoavaliação',
      benefits: [
        'Ajuda a perceber o impacto da prática de mindfulness',
        'Fortalece o compromisso com a continuidade das práticas',
        'Dá clareza sobre em quais situações você conseguiu estar mais presente',
      ],
      howTo: [
        'Sente-se em um local tranquilo por alguns minutos.',
        'Pense em como estavam sua atenção e sua mente antes de começar a trilha.',
        'Compare com como você se sente agora em relação a foco e presença.',
        'Anote um exemplo de situação em que você percebeu estar mais atenta(o) ao momento.',
        'Se quiser, escreva uma pequena intenção para manter ou aumentar essas práticas na próxima semana.',
      ],
    },
  ],
};
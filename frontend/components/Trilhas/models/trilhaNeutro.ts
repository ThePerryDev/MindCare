import { TrilhaModel } from '../types';

/**
 * Trilha 6 – Neutro
 */

export const trilhaNeutro: TrilhaModel = {
  id: 6,
  key: 'trilha-neutro',
  name: 'Trilha 6 – Neutro',
  focus: 'Aumentar consciência emocional e trazer uma leve energia ao dia.',
  level: 'Iniciante',
  minMinutes: 5,
  maxMinutes: 10,
  days: [
    {
      day: 1,
      microHabit: 'Meditação guiada por 5 min',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Ativar presença',
      benefits: [
        'Ajuda a sair do modo automático',
        'Traz mais clareza sobre como você está se sentindo',
        'Prepara a mente para o restante do dia de forma equilibrada',
      ],
      howTo: [
        'Encontre um áudio curto de meditação guiada de cerca de 5 minutos.',
        'Sente-se ou deite-se em uma posição confortável.',
        'Dê play no áudio e siga as instruções, mantendo atenção nas orientações do guia.',
        'Se a mente divagar, apenas volte a focar na voz ou na respiração.',
        'Ao finalizar, faça uma respiração profunda e perceba como está seu corpo.',
      ],
    },
    {
      day: 2,
      microHabit: 'Escrever como foi o dia e identificar pontos bons',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Aumentar consciência emocional',
      benefits: [
        'Ajuda a organizar as experiências do dia',
        'Permite identificar momentos positivos que poderiam passar despercebidos',
        'Favorece compreensão do próprio estado emocional',
      ],
      howTo: [
        'Pegue um caderno ou abra um aplicativo de notas.',
        'Escreva um breve resumo de como foi o seu dia, em poucas linhas.',
        'Depois, destaque pelo menos 1 ou 2 pontos que foram positivos, mesmo que pequenos.',
        'Observe como esses pontos fizeram diferença na sua experiência.',
        'Finalize com uma respiração profunda, reconhecendo o valor desses momentos.',
      ],
    },
    {
      day: 3,
      microHabit: 'Tocar ou ouvir uma música calma',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Suavizar o estado emocional',
      benefits: [
        'Ajuda a reduzir levemente a tensão interna',
        'Cria um ambiente mais tranquilo por alguns minutos',
        'Facilita uma transição suave entre tarefas do dia',
      ],
      howTo: [
        'Escolha uma música calma, tranquila e sem muitos estímulos intensos.',
        'Coloque para tocar em volume confortável.',
        'Se você toca algum instrumento, pode tocar uma melodia simples em vez de ouvir.',
        'Feche os olhos ou fixe o olhar em um ponto enquanto escuta.',
        'Perceba como seu corpo e sua respiração respondem ao som.',
      ],
    },
    {
      day: 4,
      microHabit: 'Tomar um chá/café observando aromas e sabores',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Praticar atenção plena sensorial',
      benefits: [
        'Traz a atenção para o momento presente por meio dos sentidos',
        'Transforma uma atividade simples em um pequeno ritual de pausa',
        'Ajuda a desacelerar durante o dia',
      ],
      howTo: [
        'Prepare um chá ou café de sua preferência.',
        'Antes de beber, aproxime a xícara do nariz e perceba o aroma com calma.',
        'Dê um pequeno gole, prestando atenção na temperatura, no sabor e na sensação na boca.',
        'Evite mexer no celular durante esses minutos, focando apenas na experiência.',
        'Respire devagar entre um gole e outro, mantendo a atenção nos sentidos.',
      ],
    },
    {
      day: 5,
      microHabit: 'Respiração quadrada (4-4-4-4)',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Regular o sistema nervoso',
      benefits: [
        'Promove equilíbrio entre ativação e relaxamento',
        'Ajuda a estabilizar o ritmo respiratório',
        'Pode ser usada em qualquer momento do dia para recentrar',
      ],
      howTo: [
        'Sente-se confortavelmente, com a coluna ereta e os pés no chão.',
        'Inspire pelo nariz por 4 segundos.',
        'Segure o ar por 4 segundos.',
        'Expire pela boca por 4 segundos.',
        'Fique com os pulmões vazios por 4 segundos.',
        'Repita esse ciclo várias vezes, como se estivesse desenhando um quadrado com a respiração.',
      ],
    },
    {
      day: 6,
      microHabit: 'Caminhar devagar prestando atenção ao ambiente',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Trazer leve energia',
      benefits: [
        'Estimula o corpo sem exigir esforço intenso',
        'Aumenta a percepção do ambiente ao redor',
        'Ajuda a sair do modo “piloto automático” enquanto se movimenta',
      ],
      howTo: [
        'Escolha um local seguro para caminhar alguns minutos.',
        'Comece andando em um ritmo mais lento do que o habitual.',
        'Observe cores, formas, sons e cheiros ao seu redor.',
        'Perceba a sensação dos pés tocando o chão e do corpo se movendo.',
        'Sempre que a mente se perder em pensamentos, volte a atenção para o ambiente.',
      ],
    },
    {
      day: 7,
      microHabit: 'Listar uma meta pequena para a semana',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Criar direção',
      benefits: [
        'Ajuda a dar sentido aos próximos dias',
        'Evita sobrecarregar com metas grandes demais',
        'Fortalece o hábito de planejar de forma leve',
      ],
      howTo: [
        'Pegue um papel ou bloco de notas.',
        'Pense em algo pequeno e concreto que você gostaria de realizar na próxima semana (por exemplo: caminhar 2 vezes, beber mais água, dormir um pouco mais cedo em 1 dia).',
        'Escreva essa meta em uma frase simples.',
        'Se quiser, adicione quando ou como pretende fazer isso.',
        'Guarde a anotação em um lugar visível para lembrar ao longo da semana.',
      ],
    },
  ],
};

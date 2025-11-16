import { TrilhaModel } from "../types";

/**
 * Trilha 8 – Irritado
 */
export const trilhaIrritado: TrilhaModel = {
  id: 8,
  key: 'trilha-irritado',
  name: 'Trilha 8 – Irritado',
  focus: 'Descarregar tensão acumulada e recuperar clareza mental.',
  level: 'Iniciante',
  minMinutes: 5,
  maxMinutes: 10,
  days: [
    {
      day: 1,
      microHabit: 'Exercício físico rápido (polichinelo ou corrida no lugar)',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Liberar energia acumulada',
      benefits: [
        'Ajuda a descarregar a energia da irritação no corpo',
        'Ativa a circulação e reduz agitação interna',
        'Facilita relaxamento após o esforço físico',
      ],
      howTo: [
        'Escolha um espaço seguro onde possa se movimentar sem esbarrar em nada.',
        'Defina se vai fazer polichinelos, corrida no lugar ou outro exercício leve.',
        'Comece em um ritmo moderado, respeitando seus limites físicos.',
        'Mantenha o movimento contínuo por alguns minutos, sem prender a respiração.',
        'Ao final, diminua o ritmo até parar e faça algumas respirações profundas.',
      ],
    },
    {
      day: 2,
      microHabit:
        'Escrever num papel os motivos da raiva e depois amassar/jogar fora',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Canalizar a raiva de forma segura',
      benefits: [
        'Ajuda a organizar o que está gerando irritação',
        'Permite expressar o que sente sem explodir em alguém',
        'Simboliza o ato de soltar parte dessa carga emocional',
      ],
      howTo: [
        'Pegue uma folha de papel e uma caneta.',
        'Escreva tudo o que está te deixando irritado(a), sem filtro ou censura.',
        'Não se preocupe com a forma, apenas deixe as palavras saírem.',
        'Quando sentir que já colocou o essencial no papel, leia rapidamente se quiser.',
        'Amassar o papel com força, como um gesto de descarregar a raiva.',
        'Jogue o papel no lixo, simbolizando que você está liberando parte dessa carga.',
      ],
    },
    {
      day: 3,
      microHabit:
        "Técnica do 'tempo fora': fechar os olhos e respirar 10 vezes fundo",
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Criar uma pausa antes de reagir',
      benefits: [
        'Ajuda a interromper respostas impulsivas',
        'Reduz a intensidade da irritação no momento',
        'Cria espaço para responder em vez de reagir',
      ],
      howTo: [
        'Afaste-se, se possível, da situação que está te irritando.',
        'Sente-se em uma posição confortável e feche os olhos.',
        'Inspire profundamente pelo nariz, sentindo o ar preencher o abdômen.',
        'Expire lentamente pela boca, soltando o ar por completo.',
        'Conte mentalmente cada respiração até completar cerca de 10 ciclos.',
        'Ao final, abra os olhos devagar e observe se algo mudou na intensidade da raiva.',
      ],
    },
    {
      day: 4,
      microHabit: 'Alongamento focado em pescoço e mandíbula',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Soltar tensões típicas da irritação',
      benefits: [
        'Ajuda a aliviar apertamento da mandíbula e rigidez no pescoço',
        'Reduz dores de tensão associadas ao estresse e irritação',
        'Facilita uma respiração mais solta e profunda',
      ],
      howTo: [
        'Sente-se com a coluna ereta e os ombros relaxados.',
        'Incline a cabeça suavemente para um lado, alongando a lateral do pescoço, e mantenha alguns segundos.',
        'Repita para o outro lado, sem forçar além do confortável.',
        'Abra e feche a boca lentamente algumas vezes, relaxando a mandíbula.',
        'Faça pequenos movimentos circulares com a cabeça, bem devagar.',
        'Durante os movimentos, respire com calma, percebendo a liberação de tensão.',
      ],
    },
    {
      day: 5,
      microHabit: 'Ouvir música rítmica (dançar se possível)',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Canalizar energia de forma positiva',
      benefits: [
        'Transforma tensão em movimento e expressão',
        'Ajuda a mudar o foco mental da irritação para o corpo',
        'Pode gerar sensação de liberdade e alívio',
      ],
      howTo: [
        'Escolha uma música com ritmo que combine com a energia que você está sentindo.',
        'Dê play e fique em um espaço em que possa se movimentar.',
        'Permita que o corpo se mexa ao som da música, mesmo que de forma simples.',
        'Se não quiser dançar, apenas balance o corpo, cabeça ou ombros no ritmo.',
        'Observe se, ao longo da música, a irritação muda de intensidade.',
      ],
    },
    {
      day: 6,
      microHabit: 'Fazer caminhada curta',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Reduzir agitação mental',
      benefits: [
        'Ajuda a esfriar a cabeça afastando-se da situação',
        'Facilita o fluxo de pensamentos de forma mais organizada',
        'Promove sensação de “arejar” o corpo e a mente',
      ],
      howTo: [
        'Escolha um trajeto curto e seguro para caminhar, mesmo que seja dentro de casa.',
        'Comece a caminhar em ritmo constante, sem pressa.',
        'Enquanto caminha, tente observar o ambiente: cores, formas, sons.',
        'Se pensamentos sobre o motivo da irritação surgirem, apenas note e volte a focar na caminhada.',
        'Ao final, faça uma respiração profunda antes de retomar suas atividades.',
      ],
    },
    {
      day: 7,
      microHabit:
        'Tomar um banho consciente, focando na sensação da água no corpo',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Lavar a tensão acumulada',
      benefits: [
        'Ajuda a simbolizar um “reset” no estado emocional',
        'Relaxar músculos e amenizar sensação de peso no corpo',
        'Cria um momento íntimo de cuidado consigo mesma',
      ],
      howTo: [
        'Entre no banho com a intenção de usar esse momento para se acalmar.',
        'Enquanto a água cai, observe a temperatura e a sensação na pele.',
        'Passe as mãos pelos ombros, pescoço e cabeça como se estivesse “lavando” a irritação.',
        'Evite ficar pensando na situação que gerou a raiva; volte a atenção para a água sempre que perceber isso.',
        'Ao finalizar, respire fundo e imagine que parte da tensão foi embora pelo ralo.',
      ],
    },
  ],
};
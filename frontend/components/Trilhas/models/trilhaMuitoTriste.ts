import { TrilhaModel } from "../types";

/**
 * Trilha 9 – Muito Triste
 */
export const trilhaMuitoTriste: TrilhaModel = {
  id: 9,
  key: 'trilha-muito-triste',
  name: 'Trilha 9 – Muito Triste',
  focus: 'Criar segurança emocional e, aos poucos, elevar o humor.',
  level: 'Iniciante',
  minMinutes: 5,
  maxMinutes: 10,
  days: [
    {
      day: 1,
      microHabit:
        'Respiração lenta com uma mão no coração e outra na barriga',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Gerar sensação de acolhimento interno',
      benefits: [
        'Ajuda a regular o ritmo da respiração em momentos de tristeza',
        'Traz sensação de aconchego por meio do toque',
        'Reduz a sensação de vazio ou aperto no peito',
      ],
      howTo: [
        'Sente-se ou deite-se em um lugar confortável.',
        'Coloque uma mão sobre o coração e a outra sobre o abdômen.',
        'Inspire lentamente pelo nariz, sentindo a barriga subir sob a mão.',
        'Expire devagar pela boca, percebendo a barriga descer.',
        'Enquanto respira, imagine que está oferecendo cuidado a si mesma por meio das mãos.',
      ],
    },
    {
      day: 2,
      microHabit:
        'Escrever uma carta de autocompaixão (como se falasse com um amigo)',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Falar consigo mesma com gentileza',
      benefits: [
        'Ajuda a diminuir a autocrítica em momentos difíceis',
        'Cria uma voz interna mais acolhedora',
        'Fortalece o hábito de se tratar como trataria alguém querido',
      ],
      howTo: [
        'Pegue papel e caneta ou abra um documento no celular.',
        'Imagine que você é uma amiga muito querida que está passando pelo que você está vivendo agora.',
        'Escreva uma carta para essa amiga, oferecendo compreensão, apoio e palavras de carinho.',
        'Evite conselhos duros; foque em acolhimento e validação.',
        'Ao terminar, leia a carta lembrando que ela também é para você.',
      ],
    },
    {
      day: 3,
      microHabit: 'Ouvir áudio de meditação guiada sobre acolhimento',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Reduzir a sensação de dor emocional bruta',
      benefits: [
          'Oferece um espaço guiado para sentir sem se perder na dor',
          'Ajuda a acalmar a mente com instruções simples',
          'Promove sensação de ser amparada, mesmo sozinha',
      ],
      howTo: [
        'Procure uma meditação guiada curta com foco em acolhimento ou autocompaixão.',
        'Sente-se ou deite-se em um local confortável.',
        'Dê play no áudio e tente seguir as instruções da melhor forma possível, sem se cobrar.',
        'Se a mente se distrair, apenas volte a focar na voz que está guiando.',
        'Ao final, permaneça alguns instantes em silêncio, respirando fundo.',
      ],
    },
    {
      day: 4,
      microHabit: 'Fazer um exercício leve (yoga suave ou alongamento)',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Tirar o corpo da imobilidade',
      benefits: [
        'Ajuda a ativar suavemente a circulação',
        'Reduz a sensação de corpo pesado e parado',
        'Conecta movimento físico com cuidado emocional',
      ],
      howTo: [
        'Escolha 3 a 5 movimentos leves de alongamento ou yoga que você conheça (ou siga um vídeo curto).',
        'Faça cada movimento devagar, respeitando seus limites físicos.',
        'Mantenha a respiração fluindo, sem prendê-la durante os alongamentos.',
        'Preste atenção nas partes do corpo que mais pedem cuidado.',
        'Finalize com uma respiração profunda, notando qualquer pequena mudança na sensação corporal.',
      ],
    },
    {
      day: 5,
      microHabit: 'Relembrar uma memória boa olhando fotos/vídeos',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Reconectar-se com momentos de alegria',
      benefits: [
        'Ajuda a lembrar que sua história também tem momentos felizes',
        'Pode despertar emoções de carinho, saudade boa ou gratidão',
        'Diminui a sensação de que tudo sempre foi triste',
      ],
      howTo: [
        'Abra a galeria do celular ou um álbum de fotos/vídeos que você gosta.',
        'Escolha alguns registros que remetam a momentos felizes, leves ou significativos.',
        'Observe cada imagem com calma, lembrando onde estava, com quem e como se sentia.',
        'Permita-se sentir o que vier, seja saudade, alegria ou emoção.',
        'Ao finalizar, agradeça mentalmente por já ter vivido esses momentos.',
      ],
    },
    {
      day: 6,
      microHabit: 'Tomar um pouco de sol e observar o ambiente',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Ativar suavemente corpo e mente',
      benefits: [
        'Ajuda a regular o relógio biológico e o humor',
        'Traz uma sensação física agradável de calor suave',
        'Convida a mente a olhar para fora, não só para dentro',
      ],
      howTo: [
        'Encontre um local em que seja possível tomar um pouco de sol com segurança.',
        'Fique em pé ou sente-se, deixando o sol tocar braços, rosto ou pernas (com proteção adequada).',
        'Observe a luz, as sombras, as cores e os sons ao seu redor.',
        'Respire devagar, percebendo a sensação do calor na pele.',
        'Permaneça assim alguns minutos, apenas notando o ambiente.',
      ],
    },
    {
      day: 7,
      microHabit: 'Conectar-se com alguém (ligação ou mensagem)',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Reduzir sensação de isolamento',
      benefits: [
        'Ajuda a lembrar que você não está sozinha no mundo',
        'Abre espaço para receber apoio emocional',
        'Fortalece vínculos afetivos importantes',
      ],
      howTo: [
        'Pense em alguém com quem você se sente relativamente segura em conversar.',
        'Escolha se prefere mandar mensagem ou fazer uma ligação rápida.',
        'Entre em contato com algo simples como “oi, lembrei de você” ou “queria conversar um pouquinho quando você puder”.',
        'Não se cobre por contar tudo; apenas permita uma aproximação.',
        'Ao encerrar o contato, note como se sente por ter dado esse passo.',
      ],
    },
  ],
};
import { TrilhaModel } from '../types';

/**
 * Trilha 1 – Ansiedade Leve / Foco no Presente
 */
export const trilhaAnsiedadeLeve: TrilhaModel = {
  id: 1,
  key: 'trilha-ansiedade-leve',
  name: 'Trilha 1 – Ansiedade Leve',
  focus: 'Foco no presente e redução de sintomas leves de ansiedade.',
  level: 'Iniciante',
  minMinutes: 5,
  maxMinutes: 8,
  days: [
    {
      day: 1,
      microHabit: 'Respiração 4-7-8 guiada',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Acalmar corpo e mente',
      benefits: [
        'Reduz rapidamente ansiedade fisiológica',
        'Diminui frequência cardíaca e tensão muscular',
        'Ajuda a controlar pensamentos acelerados',
      ],
      howTo: [
        'Sente-se ou deite-se em uma posição confortável.',
        'Inspire pelo nariz por 4 segundos.',
        'Segure o ar nos pulmões por 7 segundos.',
        'Expire lentamente pela boca por 8 segundos.',
        'Mantenha os ombros relaxados durante todo o exercício.',
        'Repita o ciclo até completar o tempo.'
      ],
    },
    {
      day: 2,
      microHabit: 'Lista de preocupações + reclassificação',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Criar clareza mental',
      benefits: [
        'Ajuda a diferenciar o que é real do que é antecipação',
        'Reduz sensação de sobrecarga mental',
        'Organiza ações e evita rumininação',
      ],
      howTo: [
        'Pegue um papel ou abra um bloco de notas no celular.',
        'Escreva tudo o que estiver te preocupando, sem censurar.',
        'Leia a lista e marque o que você pode agir hoje.',
        'Separe o restante entre: “posso agendar para depois” e “não depende de mim”.',
        'Escolha uma ação simples para fazer ainda hoje ou registrar na agenda.',
        'Guarde a lista e encerre o exercício por agora.'
      ],
    },
    {
      day: 3,
      microHabit: 'Alongamento leve de pescoço e ombros',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Reduzir tensão física',
      benefits: [
        'Libera tensão acumulada típica da ansiedade',
        'Melhora a postura e respiração',
        'Promove relaxamento muscular imediato',
      ],
      howTo: [
        'Sente-se ou fique em pé com a coluna ereta, mas relaxada.',
        'Incline a cabeça devagar para um lado e mantenha por alguns segundos.',
        'Repita para o outro lado, sem forçar o limite.',
        'Gire os ombros lentamente para frente algumas vezes.',
        'Agora gire os ombros para trás, em movimentos amplos e suaves.',
        'Mantenha a respiração lenta e profunda enquanto alonga.'
      ],
    },
    {
      day: 4,
      microHabit: 'Mini-meditação guiada',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Recentrar atenção',
      benefits: [
        'Reduz distração e pensamentos invasivos',
        'Aumenta foco no presente',
        'Induz sensação de calma profunda',
      ],
      howTo: [
        'Sente-se em um lugar confortável, com a coluna ereta e o corpo relaxado.',
        'Feche os olhos ou mantenha o olhar em um ponto fixo.',
        'Leve a atenção para a respiração, sentindo o ar entrar e sair.',
        'Não tente controlar a respiração, apenas observe o fluxo natural.',
        'Se surgirem pensamentos, reconheça e volte gentilmente a atenção para a respiração.',
        'Permaneça assim até o fim do tempo, encerrando com um suspiro profundo.'
      ],
    },
    {
      day: 5,
      microHabit: 'Diário de emoções',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Processar sentimentos',
      benefits: [
        'Ajuda a expressar emoções acumuladas',
        'Aumenta clareza emocional',
        'Reduz sensação de “bola na garganta”',
      ],
      howTo: [
        'Abra um caderno ou aplicativo de notas.',
        'Escreva em 3 a 5 linhas como você está se sentindo agora.',
        'Use palavras simples, sem se preocupar com gramática ou beleza do texto.',
        'Se quiser, adicione o motivo (ou possíveis motivos) desse sentimento.',
        'Não corrija nem julgue o que escreveu, apenas registre.',
        'Ao terminar, respire fundo e feche o diário.'
      ],
    },
    {
      day: 6,
      microHabit: 'Música relaxante + respiração profunda',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Relaxamento profundo',
      benefits: [
        'Diminui tensão corporal e mental',
        'Melhora humor e sensação de segurança',
        'Estabiliza o sistema nervoso autônomo',
      ],
      howTo: [
        'Escolha uma música calma e coloque em volume confortável.',
        'Sente-se ou deite-se em um local tranquilo.',
        'Inspire profundamente pelo nariz por 4 segundos.',
        'Expire devagar pela boca por cerca de 6 segundos.',
        'Mantenha a atenção na música e na sensação do ar entrando e saindo.',
        'Se a mente se dispersar, retorne o foco para a respiração e o som.'
      ],
    },
    {
      day: 7,
      microHabit: 'Revisão da semana + Parabéns',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Reforço positivo',
      benefits: [
        'Aumenta percepção de evolução',
        'Fortalece motivação para continuar hábitos saudáveis',
        'Melhora autoestima e autocuidado',
      ],
      howTo: [
        'Reserve um momento calmo para pensar na sua semana.',
        'Lembre-se de como você estava se sentindo no início da trilha.',
        'Observe se percebe alguma mudança na ansiedade, no corpo ou nos pensamentos.',
        'Anote uma pequena conquista da semana, mesmo que pareça simples.',
        'Diga mentalmente ou em voz alta: “Parabéns por ter cuidado de você essa semana.”',
        'Respire fundo e escolha se deseja continuar essa trilha ou seguir para a próxima.'
      ],
    },
  ],
};

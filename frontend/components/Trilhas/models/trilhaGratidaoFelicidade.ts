import { TrilhaModel } from '../types';

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
        'Ajuda a enxergar coisas boas que já existem no dia a dia',
        'Equilibra o foco entre dificuldades e conquistas',
        'Fortalece uma visão mais apreciativa da própria vida',
      ],
      howTo: [
        'Pegue um caderno ou abra um bloco de notas no celular.',
        'Pense no seu dia de hoje e identifique 3 coisas pelas quais você se sente grato(a).',
        'Podem ser coisas simples, como uma conversa, um café, um momento de descanso ou algo que deu certo.',
        'Escreva uma frase para cada item, em linhas separadas.',
        'Leia as três frases e faça uma respiração profunda, reconhecendo esses momentos.',
      ],
    },
    {
      day: 2,
      microHabit: 'Compartilhar uma mensagem positiva com alguém',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Gerar conexão social',
      benefits: [
        'Fortalece vínculos e aproxima pessoas importantes',
        'Espalha sentimentos positivos para além de você',
        'Melhora o próprio humor ao oferecer apoio ou carinho',
      ],
      howTo: [
        'Pense em alguém que fez parte do seu dia ou que você queira apoiar.',
        'Abra o aplicativo de mensagens que você usa com essa pessoa.',
        'Escreva uma mensagem breve e positiva, como um agradecimento, elogio ou desejo de boa semana.',
        'Envie a mensagem sem se preocupar em receber uma resposta imediata.',
        'Perceba como você se sente por ter enviado algo bom para alguém.',
      ],
    },
    {
      day: 3,
      microHabit: 'Playlist curta de músicas felizes + movimento corporal',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Ativar energia positiva',
      benefits: [
        'Eleva a energia física e emocional em poucos minutos',
        'Ajuda a quebrar um clima neutro ou apático',
        'Conecta corpo e emoção por meio da música',
      ],
      howTo: [
        'Escolha uma música ou uma pequena playlist com músicas felizes que você gosta.',
        'Dê play e coloque em um volume confortável.',
        'Comece a mexer o corpo como for natural: dançando, caminhando pela casa, balançando braços ou cabeça.',
        'Não se preocupe com passos certos, apenas permita o movimento.',
        'Ao final, pare um instante, respire fundo e note como está sua energia.',
      ],
    },
    {
      day: 4,
      microHabit: 'Registrar uma vitória recente (mesmo pequena)',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Reforçar autoconfiança',
      benefits: [
        'Ajuda a lembrar que você é capaz de realizar coisas boas',
        'Diminui o foco exclusivo em erros ou falhas',
        'Fortalece a percepção de progresso pessoal',
      ],
      howTo: [
        'Pegue um caderno ou app de notas.',
        'Pense em algo que você conseguiu fazer nos últimos dias, mesmo que pareça pequeno.',
        'Escreva o que foi essa vitória, como você se dedicou e o que sentiu ao realizar.',
        'Leia o que escreveu e reconheça o esforço envolvido.',
        'Se quiser, finalize com uma frase de reconhecimento, como “eu consegui fazer isso”.',
      ],
    },
    {
      day: 5,
      microHabit: 'Pequeno ato de gentileza com alguém',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Aumentar bem-estar social',
      benefits: [
        'Fortalece laços de confiança e cuidado',
        'Gera bem-estar tanto em quem faz quanto em quem recebe',
        'Ajuda a sair do foco apenas em si mesmo(a)',
      ],
      howTo: [
        'Escolha uma ação simples de gentileza que você possa fazer hoje (como ajudar alguém, ouvir com atenção, oferecer um elogio sincero).',
        'Realize essa ação de forma discreta e genuína, sem esperar nada em troca.',
        'Depois, pare alguns instantes para notar como você se sente após esse gesto.',
        'Se quiser, anote em um caderno qual foi o ato de gentileza que você fez.',
      ],
    },
    {
      day: 6,
      microHabit: 'Visualização de um momento feliz do passado',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Reforçar memórias positivas',
      benefits: [
        'Resgata sensações boas já vividas',
        'Ajuda a lembrar que sua história também tem alegria e leveza',
        'Traz conforto emocional em momentos mais neutros ou difíceis',
      ],
      howTo: [
        'Sente-se ou deite-se em um lugar confortável.',
        'Feche os olhos e escolha uma lembrança feliz: pode ser uma viagem, um encontro, uma conquista ou um momento simples de carinho.',
        'Reviva a cena mentalmente, imaginando o lugar, as pessoas, as cores, os sons e até cheiros, se lembrar.',
        'Perceba como você se sentia naquele momento.',
        'Fique alguns instantes nessa lembrança, respirando fundo e deixando a sensação boa se espalhar pelo corpo.',
      ],
    },
    {
      day: 7,
      microHabit: 'Revisão da semana: escrever o maior motivo de gratidão',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Fechar ciclo com reflexão positiva',
      benefits: [
        'Ajuda a integrar as experiências positivas da semana',
        'Fortalece o hábito de olhar para o que deu certo',
        'Cria um fechamento de ciclo mais leve e consciente',
      ],
      howTo: [
        'Reserve alguns minutos em um lugar tranquilo.',
        'Pense na sua semana como um todo.',
        'Identifique qual foi o maior motivo de gratidão nesses dias (pode ser uma pessoa, um acontecimento, uma conquista ou algo interno).',
        'Escreva esse motivo em uma frase clara.',
        'Leia o que escreveu e faça uma respiração profunda, reconhecendo esse momento importante.',
      ],
    },
  ],
};

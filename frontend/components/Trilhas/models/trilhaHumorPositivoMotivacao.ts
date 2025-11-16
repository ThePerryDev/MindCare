import { TrilhaModel } from "../types";

/**
 * Trilha 4 – Humor Positivo e Motivação
 */
export const trilhaHumorPositivoMotivacao: TrilhaModel = {
  id: 4,
  key: 'trilha-humor-positivo-motivacao',
  name: 'Trilha 4 – Humor Positivo e Motivação',
  focus: 'Aumentar emoções positivas e fortalecer motivação no dia a dia.',
  level: 'Iniciante',
  minMinutes: 3,
  maxMinutes: 7,
  days: [
    {
      day: 1,
      microHabit: 'Playlist motivacional + movimento',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Ativar energia',
      benefits: [
        'Eleva rapidamente o nível de energia e disposição',
        'Ajuda a quebrar sensação de apatia ou cansaço mental',
        'Conecta movimento corporal com emoção positiva',
      ],
      howTo: [
        'Escolha uma música motivadora que você goste.',
        'Dê play e permita-se mexer o corpo: dançar, balançar os ombros, caminhar pelo ambiente.',
        'Não se preocupe com passos certos, apenas se mova como for confortável.',
        'Preste atenção em como o corpo responde à música.',
        'Ao final, faça uma respiração profunda, mantendo a sensação de energia.'
      ],
    },
    {
      day: 2,
      microHabit: 'Escrever uma vitória recente',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Reforçar autoconfiança',
      benefits: [
        'Ajuda a lembrar que você já superou desafios',
        'Fortalece a percepção de capacidade pessoal',
        'Diminui foco exclusivo em erros e falhas',
      ],
      howTo: [
        'Pegue um caderno ou use um app de notas.',
        'Pense em algo que você realizou recentemente, mesmo que pareça pequeno.',
        'Escreva o que aconteceu, o que você fez e como contribuiu para esse resultado.',
        'Leia o que escreveu e reconheça o esforço envolvido.',
        'Se quiser, finalize escrevendo uma frase de reconhecimento, como “eu consegui fazer isso”.'
      ],
    },
    {
      day: 3,
      microHabit: 'Praticar sorriso consciente',
      durationMinutes: 3,
      durationLabel: '3 min',
      goal: 'Melhorar humor instantâneo',
      benefits: [
        'Estimula o corpo a associar sorriso com sensação de bem-estar',
        'Pode aliviar rapidamente um pouco da tensão emocional',
        'Ajuda a suavizar a expressão facial e o clima interno',
      ],
      howTo: [
        'Encontre um lugar em que você possa ficar alguns minutos sem interrupção.',
        'Relaxe o rosto e, aos poucos, forme um leve sorriso, mesmo que no início pareça “forçado”.',
        'Mantenha esse sorriso por alguns instantes, respirando devagar.',
        'Perceba as sensações no rosto, na mandíbula e no peito.',
        'Se quiser, pense em uma lembrança leve ou engraçada para reforçar o sorriso.'
      ],
    },
    {
      day: 4,
      microHabit: 'Vídeo curto inspirador',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Estimular esperança',
      benefits: [
        'Traz mensagens positivas em poucos minutos',
        'Ajuda a mudar o foco de pensamentos negativos',
        'Pode gerar sensação de “quero tentar também”',
      ],
      howTo: [
        'Escolha um vídeo curto com conteúdo inspirador, motivacional ou que conte uma história de superação.',
        'Evite vídeos muito longos ou com conteúdos pesados.',
        'Assista com atenção, tentando não mexer em outras abas ou no celular ao mesmo tempo.',
        'Ao terminar, perceba qual frase, imagem ou parte mais te tocou.',
        'Se quiser, anote essa parte para lembrar em outro momento.'
      ],
    },
    {
      day: 5,
      microHabit: 'Pequeno ato de gentileza (registrar no app)',
      durationMinutes: 5,
      durationLabel: '—',
      goal: 'Criar conexão social',
      benefits: [
        'Fortalece vínculos e sensação de pertencimento',
        'Gera bem-estar tanto em quem faz quanto em quem recebe',
        'Ajuda a sair do foco apenas em problemas pessoais',
      ],
      howTo: [
        'Escolha uma pequena ação gentil que você possa fazer hoje, como enviar uma mensagem de apoio, elogiar alguém ou ajudar em algo simples.',
        'Realize essa ação de forma sincera, sem esperar nada em troca.',
        'Depois, registre no app ou em um caderno o que você fez e para quem.',
        'Perceba como você se sente após esse ato de gentileza.',
        'Se fizer sentido, repita essa prática em outros dias.'
      ],
    },
    {
      day: 6,
      microHabit: "Visualização do 'eu ideal'",
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Inspirar ação futura',
      benefits: [
        'Ajuda a clarear a imagem de quem você quer se tornar',
        'Cria motivação interna para cuidar mais de si',
        'Facilita alinhar escolhas diárias com seus objetivos',
      ],
      howTo: [
        'Sente-se ou deite-se em um lugar confortável.',
        'Feche os olhos e imagine uma versão sua no futuro, alguns meses ou anos à frente.',
        'Observe como essa versão se comporta, como cuida da saúde, do trabalho, dos relacionamentos.',
        'Perceba a postura, a expressão facial e o tom de voz do seu “eu ideal”.',
        'Escolha uma característica dessa versão (por exemplo, mais calma, organizada, confiante) e pense em um pequeno passo que você pode dar hoje para se aproximar disso.'
      ],
    },
    {
      day: 7,
      microHabit: 'Check-out + escolha da próxima trilha',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Continuidade',
      benefits: [
        'Ajuda a perceber o impacto da trilha no seu humor',
        'Favorece escolhas conscientes para os próximos passos',
        'Refuerça o compromisso com o autocuidado contínuo',
      ],
      howTo: [
        'Pare alguns minutos para lembrar como você estava no início desta trilha.',
        'Observe se percebe mudanças no seu humor e na sua motivação.',
        'Anote um aspecto positivo que você notou em si ao longo dos últimos dias.',
        'Decida se quer repetir essa trilha ou experimentar outra, de acordo com como você se sente agora.',
        'Confirme mentalmente seu compromisso em continuar se cuidando nos próximos dias.'
      ],
    },
  ],
};
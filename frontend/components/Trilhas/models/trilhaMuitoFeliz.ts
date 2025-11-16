import { TrilhaModel } from '../types';

/**
 * Trilha 5 – Muito Feliz
 * (Objetivo da trilha aplicado como foco; como não há duração, usei null/“—”)
 */
export const trilhaMuitoFeliz: TrilhaModel = {
  id: 5,
  key: 'trilha-muito-feliz',
  name: 'Trilha 5 – Muito Feliz',
  focus: 'Manter o bem-estar e reforçar emoções positivas.',
  level: 'Iniciante',
  minMinutes: 5,
  maxMinutes: 10,
  days: [
    {
      day: 1,
      microHabit: 'Escrever 3 coisas pelas quais é grato',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Cultivar gratidão',
      benefits: [
        'Torna mais visíveis as coisas boas do dia a dia',
        'Fortalece a sensação de satisfação com a vida',
        'Ajuda a equilibrar o foco entre problemas e conquistas',
      ],
      howTo: [
        'Pegue um caderno ou abra um bloco de notas no celular.',
        'Pense no seu dia e identifique 3 coisas pelas quais você se sente grato(a).',
        'Podem ser coisas simples, como uma conversa, uma refeição ou um momento de descanso.',
        'Escreva cada ponto em uma linha separada.',
        'Leia o que escreveu e faça uma respiração profunda, reconhecendo essas coisas boas.',
      ],
    },
    {
      day: 2,
      microHabit: 'Compartilhar uma mensagem positiva com alguém',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Espalhar positividade',
      benefits: [
        'Fortalece vínculos com outras pessoas',
        'Melhora o humor de quem envia e de quem recebe',
        'Estimula uma comunicação mais afetuosa no dia a dia',
      ],
      howTo: [
        'Pense em alguém que fez parte do seu dia ou que você quer apoiar.',
        'Abra o aplicativo de mensagens que você usa com essa pessoa.',
        'Escreva uma mensagem curta e positiva, como um agradecimento, elogio ou desejo de bom dia/noite.',
        'Envie a mensagem sem esperar uma resposta específica.',
        'Perceba como você se sente após esse gesto de carinho.',
      ],
    },
    {
      day: 3,
      microHabit: 'Respiração profunda consciente',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Aprofundar sensação de bem-estar',
      benefits: [
        'Regula a respiração e o ritmo cardíaco',
        'Amplia a sensação de calma e presença',
        'Ajuda a prolongar o estado de tranquilidade',
      ],
      howTo: [
        'Sente-se ou deite-se em um lugar confortável.',
        'Inspire pelo nariz contando até 4, enchendo o abdômen de ar.',
        'Segure o ar por 1 ou 2 segundos, sem desconforto.',
        'Expire lentamente pela boca contando até 6.',
        'Repita esse ciclo de forma contínua até completar o tempo, mantendo a atenção no ar entrando e saindo.',
      ],
    },
    {
      day: 4,
      microHabit: 'Caminhar ao ar livre ouvindo uma música animada',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Potencializar o bom humor',
      benefits: [
        'Combina movimento físico com estímulo musical positivo',
        'Ajuda a manter a energia alta de forma saudável',
        'Promove sensação de leveza e liberdade',
      ],
      howTo: [
        'Escolha uma música animada que você goste.',
        'Coloque fones de ouvido (se for seguro) e comece a caminhar em um ritmo confortável.',
        'Preste atenção nos sons, nas cores ao redor e na sensação dos pés tocando o chão.',
        'Permita-se acompanhar a música com o corpo, mexendo braços ou cabeça se sentir vontade.',
        'Ao final da caminhada, faça uma respiração profunda e perceba como seu corpo e humor estão.',
      ],
    },
    {
      day: 5,
      microHabit: 'Registrar em diário um momento marcante do dia',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Fixar memórias positivas',
      benefits: [
        'Ajuda a guardar lembranças boas com mais detalhes',
        'Fortalece a sensação de que o dia valeu a pena',
        'Constrói um registro de momentos felizes para revisitar depois',
      ],
      howTo: [
        'Reserve alguns minutos em um lugar tranquilo.',
        'Pense em um momento do dia que tenha sido especial ou prazeroso para você.',
        'Descreva o que aconteceu, onde você estava, quem estava junto e como se sentiu.',
        'Inclua detalhes sensoriais, como cores, sons ou cheiros, se lembrar.',
        'Ao terminar, releia o que escreveu e permita-se reviver um pouco dessa sensação boa.',
      ],
    },
    {
      day: 6,
      microHabit: 'Fazer alongamento leve',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Cuidar do corpo com leveza',
      benefits: [
        'Ajuda a manter o corpo solto e confortável',
        'Reduz pequenos desconfortos musculares ao longo do dia',
        'Conecta autocuidado físico com bem-estar emocional',
      ],
      howTo: [
        'Fique em pé ou sente-se com a coluna ereta, mas relaxada.',
        'Estique os braços para cima, alongando o corpo todo, e mantenha alguns segundos.',
        'Incline o tronco levemente para um lado e depois para o outro, sem forçar.',
        'Gire lentamente os ombros para frente e para trás.',
        'Faça alguns movimentos leves com o pescoço, inclinando a cabeça de um lado para o outro.',
        'Respire devagar enquanto se alonga, prestando atenção nas sensações do corpo.',
      ],
    },
    {
      day: 7,
      microHabit: 'Ouvir uma música favorita e cantar junto',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Reforçar alegria',
      benefits: [
        'Libera tensão emocional por meio da voz e do som',
        'Aumenta a sensação de liberdade e autenticidade',
        'Fortalece a conexão com lembranças e sentimentos positivos',
      ],
      howTo: [
        'Escolha uma música que você adora e que te faça bem.',
        'Dê play e permita-se cantar junto, mesmo que não se considere afinado(a).',
        'Concentre-se na letra, na melodia e em como o seu corpo responde à música.',
        'Se sentir vontade, mexa o corpo, dance ou feche os olhos para aproveitar mais.',
        'Ao final, perceba como está seu humor em comparação ao início da música.',
      ],
    },
  ],
};

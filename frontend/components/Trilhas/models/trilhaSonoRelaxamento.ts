import { TrilhaModel } from '../types';

/**
 * Trilha 3 – Sono e Relaxamento
 */
export const trilhaSonoRelaxamento: TrilhaModel = {
  id: 3,
  key: 'trilha-sono-relaxamento',
  name: 'Trilha 3 – Sono e Relaxamento',
  focus:
    'Melhorar a qualidade do sono e favorecer um relaxamento profundo ao fim do dia.',
  level: 'Iniciante',
  minMinutes: 5,
  maxMinutes: 8,
  days: [
    {
      day: 1,
      microHabit: 'Respiração 4-7-8 na cama',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Induzir relaxamento',
      benefits: [
        'Ajuda a desacelerar o corpo antes de dormir',
        'Reduz ritmo cardíaco e tensão física',
        'Facilita a transição da vigília para o sono',
      ],
      howTo: [
        'Deite-se em uma posição confortável, com o corpo apoiado e relaxado.',
        'Feche os olhos e coloque a ponta da língua atrás dos dentes frontais superiores, encostando levemente no céu da boca.',
        'Inspire silenciosamente pelo nariz por 4 segundos.',
        'Segure o ar por 7 segundos, sem forçar.',
        'Expire completamente pela boca por 8 segundos, fazendo um som suave.',
        'Repita esse ciclo algumas vezes, sem se preocupar em contar perfeitamente, apenas mantendo o ritmo aproximado.',
      ],
    },
    {
      day: 2,
      microHabit: 'Desconexão digital 30 min antes de dormir',
      durationMinutes: 5,
      durationLabel: '—',
      goal: 'Higiene do sono',
      benefits: [
        'Reduz estímulos visuais e mentais que dificultam o sono',
        'Ajuda o cérebro a entender que está chegando a hora de descansar',
        'Diminui exposição à luz de telas, que atrapalha a melatonina',
      ],
      howTo: [
        'Defina um horário aproximado para dormir.',
        'Trinta minutos antes desse horário, desligue ou afaste celular, computador e TV.',
        'Escolha uma atividade tranquila, como ler algo leve, tomar um banho morno ou ouvir música calma.',
        'Evite checar notificações durante esse tempo.',
        'Mantenha o ambiente com iluminação mais baixa, preparando o corpo para o sono.',
      ],
    },
    {
      day: 3,
      microHabit: 'Relaxamento muscular progressivo',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Reduzir tensão física',
      benefits: [
        'Ajuda a soltar músculos que ficaram tensos ao longo do dia',
        'Aumenta percepção das sensações corporais',
        'Facilita um sono mais profundo e reparador',
      ],
      howTo: [
        'Deite-se na cama ou em um lugar confortável.',
        'Comece pelos pés: contraia a musculatura por cerca de 3 segundos e depois solte de uma vez.',
        'Suba para as pernas, glúteos, abdômen, peito, braços, mãos, ombros, pescoço e rosto, repetindo o processo de tensionar e relaxar.',
        'Evite forçar a contração além do confortável.',
        'Perceba a diferença entre o músculo tenso e relaxado.',
        'Ao final, faça algumas respirações profundas, sentindo o corpo mais solto.',
      ],
    },
    {
      day: 4,
      microHabit: "Escrever 'lista de preocupações' antes de dormir",
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Esvaziar mente',
      benefits: [
        'Ajuda a tirar da cabeça pensamentos que poderiam atrapalhar o sono',
        'Organiza mentalmente temas que podem ser resolvidos em outro momento',
        'Reduz o hábito de ficar ruminando na cama',
      ],
      howTo: [
        'Pegue um caderno ou bloco de notas alguns minutos antes de deitar.',
        'Liste tudo o que estiver ocupando sua mente nesse momento, sem filtro.',
        'Ao lado de cada item, escreva algo como “ver amanhã” ou “não depende de mim agora”.',
        'Ao terminar, feche o caderno e mentalmente diga a si mesma que vai retomar isso em outro momento, não agora.',
        'Siga para a cama com a intenção de apenas descansar, não resolver problemas.',
      ],
    },
    {
      day: 5,
      microHabit: 'Áudio de paisagem sonora',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Preparar ambiente',
      benefits: [
        'Cria um clima mais tranquilo para adormecer',
        'Ajuda a abafar ruídos externos incômodos',
        'Favorece um estado de relaxamento mental',
      ],
      howTo: [
        'Escolha um áudio de paisagem sonora, como chuva, mar, floresta ou vento.',
        'Ajuste o volume para um nível confortável, que não incomode.',
        'Deite-se, feche os olhos e direcione sua atenção para os sons.',
        'Deixe pensamentos passarem como nuvens, voltando sempre aos sons da paisagem.',
        'Mantenha a respiração lenta e profunda durante a escuta.',
      ],
    },
    {
      day: 6,
      microHabit: 'Alongamento para lombar e quadril',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Aliviar corpo',
      benefits: [
        'Reduz desconfortos na lombar e região do quadril',
        'Ajuda o corpo a encontrar uma posição mais confortável para dormir',
        'Libera tensão acumulada em quem passa muito tempo sentado(a)',
      ],
      howTo: [
        'Deite-se de barriga para cima em uma superfície confortável.',
        'Puxe um joelho de cada vez em direção ao peito, segurando por alguns segundos.',
        'Se sentir confortável, puxe os dois joelhos ao mesmo tempo em direção ao peito.',
        'Faça movimentos suaves de balanço para os lados, massageando a lombar.',
        'Evite movimentos bruscos e respeite os limites do seu corpo.',
        'Finalize esticando as pernas novamente e respirando fundo.',
      ],
    },
    {
      day: 7,
      microHabit: 'Reflexão do sono da semana + ajuste de rotina',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Melhorar consistência',
      benefits: [
        'Ajuda a identificar padrões de noites melhores e piores',
        'Facilita ajustes práticos na rotina noturna',
        'Fortalece compromisso com hábitos de sono saudáveis',
      ],
      howTo: [
        'Reserve alguns minutos, de preferência durante o dia ou início da noite.',
        'Pense em como foram suas noites de sono ao longo da semana.',
        'Identifique quais dias dormiu melhor e o que fez de diferente nesses dias.',
        'Anote um hábito que você quer manter e outro que pretende ajustar.',
        'Escolha um pequeno ajuste para testar na próxima semana, como horário, luz ou uso de telas.',
      ],
    },
  ],
};

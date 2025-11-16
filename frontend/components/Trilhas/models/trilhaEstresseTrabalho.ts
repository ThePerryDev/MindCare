import { TrilhaModel } from '../types';

/**
 * Trilha 2 – Estresse no Trabalho / Estudo
 */
export const trilhaEstresseTrabalho: TrilhaModel = {
  id: 2,
  key: 'trilha-estresse-trabalho',
  name: 'Trilha 2 – Estresse no Trabalho / Estudo',
  focus: 'Organizar a mente e reduzir estresse relacionado a demandas de trabalho e estudo.',
  level: 'Iniciante',
  minMinutes: 5,
  maxMinutes: 8,
  days: [
    {
      day: 1,
      microHabit: 'Check-in + respiração caixa (4-4-4-4)',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Criar estabilidade',
      benefits: [
        'Ajuda a estabilizar a respiração e o ritmo interno',
        'Reduz a sensação de urgência constante',
        'Facilita iniciar o dia com mais foco e calma',
      ],
      howTo: [
        'Sente-se confortavelmente com os pés apoiados no chão.',
        'Feche os olhos ou suavize o olhar.',
        'Inspire pelo nariz por 4 segundos.',
        'Segure o ar por 4 segundos.',
        'Expire lentamente pela boca por 4 segundos.',
        'Fique 4 segundos com os pulmões vazios antes de inspirar novamente.',
        'Repita esse ciclo de 4-4-4-4 até completar o tempo, observando como o corpo vai desacelerando.'
      ],
    },
    {
      day: 2,
      microHabit: 'Escrever prioridades de hoje e descartar ruído',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Reduzir sobrecarga mental',
      benefits: [
        'Organiza o dia de forma objetiva',
        'Evita espalhar energia em tarefas pouco importantes',
        'Reduz a sensação de “não vou dar conta de tudo”',
      ],
      howTo: [
        'Pegue um papel ou bloco de notas no celular.',
        'Faça uma lista com tudo o que você sente que precisa fazer hoje.',
        'Marque com um símbolo (★) apenas 3 tarefas realmente essenciais.',
        'Tudo que não for essencial hoje pode ser reagendado ou deixado para depois.',
        'Destaque a primeira tarefa essencial e comprometa-se a começar por ela.',
        'Guarde a lista em um lugar de fácil acesso para acompanhar ao longo do dia.'
      ],
    },
    {
      day: 3,
      microHabit: 'Alongamento de punhos e costas',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Prevenir tensão',
      benefits: [
        'Reduz dores relacionadas a digitação e postura prolongada',
        'Melhora circulação em membros superiores',
        'Ajuda a quebrar longos períodos sentado(a)',
      ],
      howTo: [
        'Afaste-se um pouco da mesa e mantenha a coluna ereta.',
        'Estenda um braço à frente com a palma para baixo e puxe levemente os dedos para baixo com a outra mão.',
        'Mantenha alguns segundos e repita invertendo a mão.',
        'Gire os punhos em círculos, primeiro para um lado, depois para o outro.',
        'Entrelaçe os dedos, estenda os braços à frente e empurre as mãos para fora, alongando costas e ombros.',
        'Incline o tronco levemente para frente, como se fosse alcançar o chão, respeitando seus limites e respirando devagar.'
      ],
    },
    {
      day: 4,
      microHabit: 'Técnica de visualização positiva',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Recuperar confiança',
      benefits: [
        'Ajuda a reduzir pensamentos de incapacidade',
        'Fortalece uma imagem interna de competência',
        'Prepara a mente para enfrentar desafios com mais segurança',
      ],
      howTo: [
        'Sente-se em um local tranquilo e feche os olhos.',
        'Lembre-se de uma situação em que você se saiu bem em algo desafiador.',
        'Recrie mentalmente o ambiente: onde você estava, quem estava lá, o que você dizia e fazia.',
        'Perceba como você se sentia nesse momento de sucesso.',
        'Agora imagine você lidando com uma situação atual de forma confiante e firme.',
        'Respire fundo algumas vezes, mantendo essa imagem positiva por alguns instantes.'
      ],
    },
    {
      day: 5,
      microHabit: '10 afirmações positivas rápidas',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Reprogramar autodiálogo',
      benefits: [
        'Substitui pensamentos autocríticos por frases de apoio',
        'Fortalece autoestima e senso de capacidade',
        'Ajuda a criar um tom interno mais gentil',
      ],
      howTo: [
        'Encontre um lugar em que você possa falar ou pensar em voz baixa sem interrupções.',
        'Escolha algumas frases curtas como: “Eu sou capaz”, “Eu aprendo com os desafios”, “Eu estou fazendo o meu melhor”.',
        'Repita cerca de 10 afirmações, podendo repetir as mesmas ou variar.',
        'Se quiser, fale em voz baixa ou apenas mentalmente, sentindo o efeito das palavras.',
        'Ao final, respire fundo e note se a sua fala interna ficou um pouco mais suave.'
      ],
    },
    {
      day: 6,
      microHabit: 'Mini-pausa de gratidão: 3 coisas boas do dia',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Equilibrar percepção',
      benefits: [
        'Ajuda a não focar apenas nos problemas do dia',
        'Torna mais visível o que também funcionou bem',
        'Promove um fechamento de dia mais leve',
      ],
      howTo: [
        'Pare por alguns minutos em um lugar tranquilo.',
        'Pense nas últimas horas e identifique 3 coisas boas que aconteceram, mesmo que pequenas.',
        'Podem ser coisas simples, como um café gostoso, uma risada ou uma mensagem legal.',
        'Se quiser, anote essas 3 coisas em um caderno ou app de notas.',
        'Leia o que escreveu e respire fundo, reconhecendo esses momentos positivos.'
      ],
    },
    {
      day: 7,
      microHabit: 'Autoavaliação semanal + sugestão da próxima trilha',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Fechar ciclo',
      benefits: [
        'Ajuda a perceber o que mudou em relação ao estresse ao longo da semana',
        'Facilita identificar hábitos que funcionaram melhor para você',
        'Prepara a escolha consciente da próxima trilha ou foco',
      ],
      howTo: [
        'Reserve alguns minutos para pensar na sua semana de trabalho ou estudo.',
        'Pergunte a si mesma: “Em quais dias me senti mais sobrecarregada?”',
        'Observe quais práticas da trilha ajudaram mais nesses momentos.',
        'Anote um aprendizado ou algo que você quer manter para a próxima semana.',
        'Com base nisso, escolha se deseja repetir esta trilha ou experimentar uma trilha diferente no app.'
      ],
    },
  ],
};
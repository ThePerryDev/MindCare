import { TrilhaModel } from "../types";

/**
 * Trilha 11 – Alívio do Estresse (Intermediário – 10 a 15 min)
 */
export const trilhaAlivioEstresse: TrilhaModel = {
  id: 11,
  key: 'trilha-alivio-estresse',
  name: 'Trilha 11 – Alívio do Estresse',
  focus: 'Reduzir tensão física e mental.',
  level: 'Intermediário',
  minMinutes: 10,
  maxMinutes: 15,
  days: [
    {
      day: 1,
      microHabit: 'Respiração profunda com música relaxante',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Diminuir ritmo e relaxar',
      benefits: [
        'Reduz ativação do sistema de alerta',
        'Ajuda a desacelerar os pensamentos',
        'Promove sensação de descanso mental',
      ],
      howTo: [
        'Coloque uma música suave e mantenha o volume baixo.',
        'Sente-se ou deite-se confortavelmente.',
        'Inspire profundamente pelo nariz por 4 segundos.',
        'Expire lentamente pela boca por 6 segundos.',
        'Mantenha os ombros relaxados durante todo o exercício.',
        'Repita o ciclo até completar o tempo.'
      ],
    },
    {
      day: 2,
      microHabit: 'Alongamento de pescoço, ombros e costas',
      durationMinutes: 12,
      durationLabel: '12 min',
      goal: 'Reduzir tensão física',
      benefits: [
        'Alivia dores causadas por má postura e estresse',
        'Melhora mobilidade da coluna',
        'Reduz sensação de peso nas costas',
      ],
      howTo: [
        'Gire o pescoço lentamente para um lado e mantenha por alguns segundos.',
        'Repita para o outro lado sem forçar.',
        'Eleve os ombros até perto das orelhas e solte devagar.',
        'Faça rotações lentas dos ombros para frente e para trás.',
        'Estique levemente a coluna inclinando o tronco para os lados.',
        'Respire devagar durante todo o alongamento.'
      ],
    },
    {
      day: 3,
      microHabit:
        'Escrever preocupações e classificá-las (resolver / agendar / soltar)',
      durationMinutes: 15,
      durationLabel: '15 min',
      goal: 'Criar clareza mental',
      benefits: [
        'Separar o que é realmente ação de preocupação inútil',
        'Diminui sobrecarga mental',
        'Ajuda a definir próximos passos de forma mais calma',
      ],
      howTo: [
        'Pegue papel ou bloco de notas e escreva todas as preocupações que vierem à mente.',
        'Leia a lista e marque o que pode ser resolvido agora.',
        'Classifique o restante entre: “agendar” ou “soltar”.',
        'Tome uma ação simples relacionada a uma preocupação que pode ser resolvida.',
        'Guarde as anotações e finalize respirando lentamente.'
      ],
    },
    {
      day: 4,
      microHabit: 'Relaxamento muscular progressivo',
      durationMinutes: 12,
      durationLabel: '12 min',
      goal: 'Soltar tensões acumuladas',
      benefits: [
        'Alterna tensão e relaxamento de grupos musculares',
        'Ajuda o corpo a reconhecer estados de relaxamento',
        'Reduz sintomas físicos do estresse',
      ],
      howTo: [
        'Sente-se ou deite-se confortavelmente.',
        'Comece pelos pés: contraia por 3 segundos e relaxe.',
        'Suba para as pernas, glúteos, barriga e peito repetindo o processo.',
        'Faça o mesmo com braços, mãos, ombros e rosto.',
        'Mantenha a respiração calma e profunda.',
        'Sinta o corpo ficando mais leve conforme vai relaxando.'
      ],
    },
    {
      day: 5,
      microHabit: "Visualização de um 'lugar seguro'",
      durationMinutes: 15,
      durationLabel: '15 min',
      goal: 'Gerar sensação de calma interna',
      benefits: [
        'Cria um refúgio mental em momentos difíceis',
        'Reduz sensação de ameaça constante',
        'Aumenta sensação de proteção emocional',
      ],
      howTo: [
        'Feche os olhos e respire fundo algumas vezes.',
        'Imagine um lugar onde você se sente completamente seguro(a).',
        'Observe mentalmente detalhes como luz, cores, texturas e sons.',
        'Perceba como seu corpo responde a essa imagem.',
        'Fique alguns instantes nesse lugar, respirando devagar.',
        'Finalize trazendo essa sensação de segurança de volta ao momento presente.'
      ],
    },
    {
      day: 6,
      microHabit: 'Caminhada leve focando na respiração',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Integrar corpo e mente',
      benefits: [
        'Une movimento corporal e atenção plena',
        'Reduz estresse acumulado no fim do dia',
        'Melhora disposição física e mental',
      ],
      howTo: [
        'Comece caminhando em ritmo leve e constante.',
        'Inspire enquanto dá dois passos e expire nos próximos dois.',
        'Observe os pés tocando o chão e o movimento dos braços.',
        'Desvie a atenção gentilmente sempre que surgirem pensamentos.',
        'Mantenha foco na respiração e no ritmo da caminhada.',
        'Finalize diminuindo o ritmo e respirando fundo.'
      ],
    },
    {
      day: 7,
      microHabit:
        'Autoavaliação: situações de estresse e estratégias úteis na semana',
      durationMinutes: 12,
      durationLabel: '12 min',
      goal: 'Refletir sobre avanços',
      benefits: [
        'Ajuda a perceber gatilhos e respostas mais saudáveis',
        'Fortalece repertório de enfrentamento do estresse',
        'Cria plano de melhoria contínua',
      ],
      howTo: [
        'Pense nas situações que mais geraram estresse durante a semana.',
        'Observe como você reagiu em cada uma delas.',
        'Identifique estratégias que funcionaram bem para você.',
        'Anote algo que deseja melhorar ou repetir na próxima semana.',
        'Respire fundo e reconheça sua evolução até aqui.'
      ],
    },
  ],
};

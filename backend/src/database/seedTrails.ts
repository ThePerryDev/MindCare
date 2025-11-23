// src/database/seedTrails.ts

import TrailModel, { TrailCode } from '../models/trail.model';
import { FeelingValue } from '../models/feeling.model';

type SeedTrail = {
  trailId: number;
  code: TrailCode;
  nome: string;
  descricao?: string;
  sentimentosRecomendados: FeelingValue[];
  dias: {
    ordem: number;
    titulo: string;
    descricao?: string;
    duracaoMinutos?: number;
    objetivo?: string;
  }[];
};

const TRAILS_SEED: SeedTrail[] = [
  {
    trailId: 1,
    code: 'TRILHA_ANSIEDADE_LEVE',
    nome: 'Trilha 1 - Ansiedade Leve / Foco no Presente',
    sentimentosRecomendados: ['Irritado', 'Neutro', 'Triste', 'Muito Triste'],
    dias: [
      {
        ordem: 1,
        titulo: 'Respiração 4-7-8 guiada',
        duracaoMinutos: 5,
        objetivo: 'Acalmar corpo e mente',
      },
      {
        ordem: 2,
        titulo: 'Lista de preocupações',
        duracaoMinutos: 7,
        objetivo: 'Criar clareza e reclassificar o que pode ser feito agora',
      },
      {
        ordem: 3,
        titulo: 'Alongamento leve de pescoço e ombros',
        duracaoMinutos: 6,
        objetivo: 'Reduzir tensão física na parte superior do corpo',
      },
      {
        ordem: 4,
        titulo: 'Mini-meditação guiada',
        duracaoMinutos: 5,
        objetivo: 'Recentrar atenção no momento presente',
      },
      {
        ordem: 5,
        titulo: 'Diário de emoções',
        duracaoMinutos: 7,
        objetivo: 'Processar sentimentos em 3 linhas sobre o que sente',
      },
      {
        ordem: 6,
        titulo: 'Música relaxante + respiração profunda',
        duracaoMinutos: 8,
        objetivo: 'Promover relaxamento profundo',
      },
      {
        ordem: 7,
        titulo: 'Revisão da semana',
        duracaoMinutos: 5,
        objetivo:
          'Comparar humor antes/depois e reforçar progresso com parabéns',
      },
    ],
  },
  {
    trailId: 2,
    code: 'TRILHA_ESTRESSE_TRABALHO',
    nome: 'Trilha 2 - Estresse no Trabalho / Estudo',
    sentimentosRecomendados: ['Irritado', 'Triste', 'Muito Triste', 'Neutro'],
    dias: [
      {
        ordem: 1,
        titulo: 'Check-in + respiração em caixa (4-4-4-4)',
        duracaoMinutos: 5,
        objetivo: 'Criar estabilidade emocional',
      },
      {
        ordem: 2,
        titulo: 'Escrever prioridades de hoje',
        duracaoMinutos: 8,
        objetivo: 'Reduzir sobrecarga mental e descartar ruído',
      },
      {
        ordem: 3,
        titulo: 'Alongamento de punhos e costas',
        duracaoMinutos: 6,
        objetivo: 'Prevenir tensão física relacionada ao trabalho',
      },
      {
        ordem: 4,
        titulo: 'Técnica de visualização positiva',
        duracaoMinutos: 7,
        objetivo: 'Recuperar confiança',
      },
      {
        ordem: 5,
        titulo: '10 afirmações positivas rápidas',
        duracaoMinutos: 6,
        objetivo: 'Reprogramar autodiálogo',
      },
      {
        ordem: 6,
        titulo: 'Mini-pausa de gratidão',
        duracaoMinutos: 5,
        objetivo: 'Equilibrar percepção com 3 coisas boas do dia',
      },
      {
        ordem: 7,
        titulo: 'Autoavaliação semanal',
        duracaoMinutos: 5,
        objetivo: 'Fechar ciclo e sugerir próxima trilha',
      },
    ],
  },
  {
    trailId: 3,
    code: 'TRILHA_SONO_RELAX',
    nome: 'Trilha 3 - Sono e Relaxamento',
    sentimentosRecomendados: ['Triste', 'Muito Triste', 'Neutro'],
    dias: [
      {
        ordem: 1,
        titulo: 'Respiração 4-7-8 na cama',
        duracaoMinutos: 6,
        objetivo: 'Induzir relaxamento',
      },
      {
        ordem: 2,
        titulo: 'Desconexão digital 30 min antes de dormir',
        objetivo: 'Melhorar higiene do sono',
      },
      {
        ordem: 3,
        titulo: 'Relaxamento muscular progressivo',
        duracaoMinutos: 8,
        objetivo: 'Reduzir tensão física',
      },
      {
        ordem: 4,
        titulo: "Escrever 'lista de preocupações'",
        duracaoMinutos: 7,
        objetivo: 'Esvaziar a mente antes de dormir',
      },
      {
        ordem: 5,
        titulo: 'Áudio de paisagem sonora',
        duracaoMinutos: 5,
        objetivo: 'Preparar ambiente para o sono',
      },
      {
        ordem: 6,
        titulo: 'Alongamento para lombar e quadril',
        duracaoMinutos: 6,
        objetivo: 'Aliviar o corpo para dormir melhor',
      },
      {
        ordem: 7,
        titulo: 'Reflexão do sono da semana',
        duracaoMinutos: 5,
        objetivo: 'Ajustar rotina para mais consistência',
      },
    ],
  },
  {
    trailId: 4,
    code: 'TRILHA_HUMOR_POSITIVO',
    nome: 'Trilha 4 - Humor Positivo e Motivação',
    sentimentosRecomendados: ['Muito Feliz', 'Neutro'],
    dias: [
      {
        ordem: 1,
        titulo: 'Playlist motivacional + movimento',
        duracaoMinutos: 5,
        objetivo: 'Ativar energia e disposição',
      },
      {
        ordem: 2,
        titulo: 'Escrever uma vitória recente',
        duracaoMinutos: 5,
        objetivo: 'Reforçar autoconfiança',
      },
      {
        ordem: 3,
        titulo: 'Praticar sorriso consciente',
        duracaoMinutos: 3,
        objetivo: 'Melhorar humor instantâneo',
      },
      {
        ordem: 4,
        titulo: 'Vídeo curto inspirador',
        duracaoMinutos: 6,
        objetivo: 'Estimular esperança',
      },
      {
        ordem: 5,
        titulo: 'Pequeno ato de gentileza',
        objetivo: 'Criar conexão social (registrar no app)',
      },
      {
        ordem: 6,
        titulo: "Visualização do 'eu ideal'",
        duracaoMinutos: 7,
        objetivo: 'Inspirar ação futura',
      },
      {
        ordem: 7,
        titulo: 'Check-out + escolha da próxima trilha',
        duracaoMinutos: 5,
        objetivo: 'Planejar continuidade',
      },
    ],
  },
  {
    trailId: 5,
    code: 'TRILHA_MUITO_FELIZ',
    nome: 'Trilha 5 - Muito Feliz',
    sentimentosRecomendados: ['Muito Feliz'],
    dias: [
      { ordem: 1, titulo: 'Escrever 3 coisas pelas quais é grato' },
      { ordem: 2, titulo: 'Compartilhar uma mensagem positiva com alguém' },
      { ordem: 3, titulo: 'Respiração profunda consciente', duracaoMinutos: 5 },
      { ordem: 4, titulo: 'Caminhar ao ar livre ouvindo música animada' },
      { ordem: 5, titulo: 'Registrar em diário um momento marcante do dia' },
      { ordem: 6, titulo: 'Alongamento leve' },
      { ordem: 7, titulo: 'Ouvir música favorita e cantar junto' },
    ],
  },
  {
    trailId: 6,
    code: 'TRILHA_NEUTRO',
    nome: 'Trilha 6 - Neutro',
    sentimentosRecomendados: ['Neutro'],
    dias: [
      { ordem: 1, titulo: 'Meditação guiada', duracaoMinutos: 5 },
      { ordem: 2, titulo: 'Escrever como foi o dia e pontos bons' },
      { ordem: 3, titulo: 'Ouvir música calma' },
      { ordem: 4, titulo: 'Tomar chá/café observando aromas e sabores' },
      { ordem: 5, titulo: 'Respiração quadrada (4-4-4-4)' },
      { ordem: 6, titulo: 'Caminhar devagar observando o ambiente' },
      { ordem: 7, titulo: 'Listar uma meta pequena para a semana' },
    ],
  },
  {
    trailId: 7,
    code: 'TRILHA_TRISTE',
    nome: 'Trilha 7 - Triste',
    sentimentosRecomendados: ['Triste'],
    dias: [
      { ordem: 1, titulo: 'Escrita livre sobre o que sente (sem julgamentos)' },
      { ordem: 2, titulo: 'Respiração 4-7-8' },
      { ordem: 3, titulo: 'Ouvir música calma e relaxante' },
      { ordem: 4, titulo: 'Lista de coisas que já superou no passado' },
      { ordem: 5, titulo: 'Alongamento focado em ombros e peito' },
      { ordem: 6, titulo: 'Enviar mensagem para alguém de confiança' },
      { ordem: 7, titulo: 'Assistir a vídeo curto engraçado ou inspirador' },
    ],
  },
  {
    trailId: 8,
    code: 'TRILHA_IRRITADO',
    nome: 'Trilha 8 - Irritado',
    sentimentosRecomendados: ['Irritado'],
    dias: [
      {
        ordem: 1,
        titulo: 'Exercício físico rápido (polichinelo/corrida no lugar)',
      },
      {
        ordem: 2,
        titulo:
          'Escrever motivos da raiva em papel e depois amassar/jogar fora',
      },
      {
        ordem: 3,
        titulo:
          "Técnica do 'tempo fora': fechar os olhos e respirar 10 vezes fundo",
      },
      { ordem: 4, titulo: 'Alongamento focado em pescoço e mandíbula' },
      { ordem: 5, titulo: 'Ouvir música rítmica (dançar se possível)' },
      { ordem: 6, titulo: 'Caminhada curta' },
      {
        ordem: 7,
        titulo: 'Banho consciente, focando na sensação da água no corpo',
      },
    ],
  },
  {
    trailId: 9,
    code: 'TRILHA_MUITO_TRISTE',
    nome: 'Trilha 9 - Muito Triste',
    sentimentosRecomendados: ['Muito Triste'],
    dias: [
      { ordem: 1, titulo: 'Respiração lenta com mão no coração e na barriga' },
      {
        ordem: 2,
        titulo:
          'Escrever carta de autocompaixão (como se falasse com um amigo)',
      },
      {
        ordem: 3,
        titulo: 'Ouvir meditação guiada sobre acolhimento emocional',
      },
      { ordem: 4, titulo: 'Exercício leve (yoga suave ou alongamento)' },
      { ordem: 5, titulo: 'Relembrar memória boa olhando fotos/vídeos' },
      { ordem: 6, titulo: 'Tomar um pouco de sol e observar o ambiente' },
      { ordem: 7, titulo: 'Conectar-se com alguém (ligação ou mensagem)' },
    ],
  },
];

export async function ensureDefaultTrails() {
  for (const trail of TRAILS_SEED) {
    await TrailModel.findOneAndUpdate(
      { code: trail.code }, // chave estável de seed
      { $set: trail }, // inclui/atualiza trailId também
      { upsert: true, new: true }
    );
  }
  console.log('[trails] trilhas padrão garantidas/atualizadas');
}

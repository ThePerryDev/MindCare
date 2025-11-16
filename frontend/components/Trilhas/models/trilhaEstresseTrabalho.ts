import { TrilhaModel } from '../types';

/**
 * Trilha 2 – Estresse no Trabalho / Estudo
 */

export const trilhaEstresseTrabalho: TrilhaModel = {
  id: 2,
  key: 'trilha-estresse-trabalho-estudo',
  name: 'Trilha 2 – Estresse no Trabalho / Estudo',
  focus: 'Organizar mente e corpo em contextos de trabalho e estudo.',
  level: 'Intermediário',
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
        'Reduz pressão mental antes de iniciar o dia',
        'Equilibra respiração e batimentos',
        'Aumenta clareza para priorizar tarefas',
      ],
    },
    {
      day: 2,
      microHabit: 'Escrever prioridades e descartar ruído',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Reduzir sobrecarga mental',
      benefits: [
        'Evita multitarefas desnecessárias',
        'Aumenta foco e produtividade',
        'Diminui estresse por excesso de tarefas',
      ],
    },
    {
      day: 3,
      microHabit: 'Alongamento de punhos e costas',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Prevenir tensão',
      benefits: [
        'Reduz dores relacionadas a trabalho/estudos',
        'Melhora circulação e respiração',
        'Diminui fadiga física mental',
      ],
    },
    {
      day: 4,
      microHabit: 'Técnica de visualização positiva',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Recuperar confiança',
      benefits: [
        'Reduz insegurança e autossabotagem',
        'Aumenta motivação e foco',
        'Eleva otimismo sobre desafios',
      ],
    },
    {
      day: 5,
      microHabit: '10 afirmações positivas',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Reprogramar autodiálogo',
      benefits: [
        'Reduz pensamentos autocríticos excessivos',
        'Fortalece autoestima',
        'Aumenta motivação diária',
      ],
    },
    {
      day: 6,
      microHabit: 'Mini pausa de gratidão',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Equilibrar percepção',
      benefits: [
        'Diminui pessimismo gerado pelo estresse',
        'Melhora humor em poucos minutos',
        'Fortalece sensação de apoio emocional',
      ],
    },
    {
      day: 7,
      microHabit: 'Autoavaliação semanal',
      durationMinutes: 5,
      durationLabel: '5 min',
      goal: 'Fechar ciclo',
      benefits: [
        'Organiza aprendizados da semana',
        'Aumenta percepção de crescimento',
        'Ajuda a planejar melhor a semana seguinte',
      ],
    },
  ],
};
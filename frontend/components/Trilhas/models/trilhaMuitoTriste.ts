import { TrilhaModel } from "../types";

/**
 * Trilha 9 – Muito Triste
 */
export const trilhaMuitoTriste: TrilhaModel = {
  id: 9,
  key: 'trilha-muito-triste',
  name: 'Trilha 9 – Muito Triste',
  focus: 'Criar segurança emocional e elevar o humor aos poucos.',
  level: 'Livre',
  minMinutes: null,
  maxMinutes: null,
  days: [
    {
      day: 1,
      microHabit: 'Respiração lenta com mão no coração e na barriga',
      durationMinutes: 6,
      durationLabel: '6 min',
      goal: 'Criar sensação de segurança interna',
      benefits: [
        'Ativa sensação de autocuidado físico',
        'Ajuda a reduzir aperto no peito',
        'Acalma gradualmente o sistema nervoso',
      ],
    },
    {
      day: 2,
      microHabit: 'Carta de autocompaixão',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Falar consigo como falaria com um amigo',
      benefits: [
        'Reduz autocrítica dura',
        'Estimula gentileza consigo mesma',
        'Ajuda a validar a própria dor emocional',
      ],
    },
    {
      day: 3,
      microHabit: 'Meditação guiada de acolhimento',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Acolher a tristeza sem se afundar nela',
      benefits: [
        'Ajuda a observar emoções sem se perder nelas',
        'Cria sensação de suporte emocional guiado',
        'Reduz intensidade da dor emocional',
      ],
    },
    {
      day: 4,
      microHabit: 'Exercício leve (yoga suave ou alongamento)',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Cuidar do corpo com delicadeza',
      benefits: [
        'Melhora circulação',
        'Reduz sensação de peso corporal',
        'Libera endorfinas de forma suave',
      ],
    },
    {
      day: 5,
      microHabit: 'Relembrar memória boa com fotos/vídeos',
      durationMinutes: 7,
      durationLabel: '7 min',
      goal: 'Resgatar momentos de alegria',
      benefits: [
        'Traz lembrança de que já viveu momentos felizes',
        'Equilibra um pouco o foco no sofrimento atual',
        'Aumenta esperança de voltar a sentir prazer',
      ],
    },
    {
      day: 6,
      microHabit: 'Tomar um pouco de sol e observar o ambiente',
      durationMinutes: 8,
      durationLabel: '8 min',
      goal: 'Reativar contato com o mundo externo',
      benefits: [
        'Aumenta vitamina D (a longo prazo)',
        'Melhora leveza e disposição',
        'Ajuda a diminuir sensação de enclausuramento',
      ],
    },
    {
      day: 7,
      microHabit: 'Conectar-se com alguém (ligação ou mensagem)',
      durationMinutes: 10,
      durationLabel: '10 min',
      goal: 'Não enfrentar tudo sozinha',
      benefits: [
        'Reduz sensação de isolamento extremo',
        'Permite receber acolhimento ou escuta',
        'Fortalece vínculo emocional com alguém de confiança',
      ],
    },
  ],
};
// frontend/constants/feelingsScale.ts

// Use exatamente os mesmos labels do backend (FEELINGS)
// e da MoodScreen / Tela de saída.
export type FeelingLabel = 'Felicidade' | 'Tristeza' | 'Ansiedade' | 'Estresse';

export type FeelingScaleItem = {
  emoji: string;
  label: FeelingLabel;
  value: number; // usado no eixo Y do gráfico
};

// Ordem do eixo Y (de baixo pra cima: 1,2,3,4)
export const FEELINGS_SCALE: FeelingScaleItem[] = [
  { emoji: '😭', label: 'Tristeza', value: 1 },
  { emoji: '😐', label: 'Ansiedade', value: 2 },
  { emoji: '😡', label: 'Estresse', value: 3 },
  { emoji: '😄', label: 'Felicidade', value: 4 },
];

// Mapa auxiliar: label -> valor numérico
export const feelingToValue: Record<FeelingLabel, number> =
  FEELINGS_SCALE.reduce(
    (acc, item) => {
      acc[item.label] = item.value;
      return acc;
    },
    {} as Record<FeelingLabel, number>
  );

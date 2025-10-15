import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

type Step = 'completed' | 'active' | 'upcoming';

interface StepProgressProps {
  currentStep: 1 | 2 | 3;
  labels?: [string, string, string];
}

function getStepState(index: number, current: number): Step {
  if (index + 1 < current) return 'completed';
  if (index + 1 === current) return 'active';
  return 'upcoming';
}

export default function StepProgress({
  currentStep,
  labels = ['Dados Pessoais', 'Segurança', 'Confirmação'],
}: StepProgressProps) {
  // progress das barras (entre 1–2 e 2–3)
  const bar1Progress = currentStep === 1 ? 0.5 : currentStep > 1 ? 1 : 0;
  const bar2Progress = currentStep === 2 ? 0.5 : currentStep > 2 ? 1 : 0;

  return (
    <View style={styles.wrapper}>
      {/* LINHA DOS PONTOS + BARRAS */}
      <View style={styles.rowDots}>
        <Dot index={0} state={getStepState(0, currentStep)} />

        <StepBar progress={bar1Progress} />

        <Dot index={1} state={getStepState(1, currentStep)} />

        <StepBar progress={bar2Progress} />

        <Dot index={2} state={getStepState(2, currentStep)} />
      </View>

      {/* LINHA DOS LABELS */}
      <View style={styles.rowLabels}>
        <StepLabel text={labels[0]} state={getStepState(0, currentStep)} />
        <StepLabel text={labels[1]} state={getStepState(1, currentStep)} />
        <StepLabel text={labels[2]} state={getStepState(2, currentStep)} />
      </View>
    </View>
  );
}

function StepBar({ progress }: { progress: 0 | 0.5 | 1 }) {
  return (
    <View style={styles.barContainer}>
      <View style={styles.barInactive} />
      {progress > 0 && (
        <LinearGradient
          colors={['#6C63FF', '#A393FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barActive, { width: `${progress * 100}%` }]}
        />
      )}
    </View>
  );
}

function Dot({ index, state }: { index: number; state: Step }) {
  const num = String(index + 1);

  if (state === 'active') {
    return (
      <LinearGradient
        colors={['#6C63FF', '#A393FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.dot, styles.dotActive]}
      >
        <Text style={styles.dotNumber}>{num}</Text>
      </LinearGradient>
    );
  }

  if (state === 'completed') {
    return (
      <View style={[styles.dot, styles.dotCompleted]}>
        <Text style={styles.dotCheck}>✓</Text>
      </View>
    );
  }

  return (
    <View style={[styles.dot, styles.dotUpcoming]}>
      <Text style={styles.dotNumberMuted}>{num}</Text>
    </View>
  );
}

function StepLabel({ text, state }: { text: string; state: Step }) {
  return (
    <View style={styles.labelSlot}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        style={[
          styles.label,
          state === 'active' && styles.labelActive,
          state === 'completed' && styles.labelCompleted,
          state === 'upcoming' && styles.labelUpcoming,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

// frontend/components/Trilhas/ActivitySteps/ActivitySteps.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export type ActivityStepsProps = {
  /** Descrição geral do exercício (objetivo / contexto) */
  description?: string;
  /** Lista de passos de como realizar o exercício */
  tips?: string[];
  /** Título da seção (default: "Como realizar este exercício:") */
  title?: string;
};

const ActivitySteps: React.FC<ActivityStepsProps> = ({
  description,
  tips,
  title = 'Como realizar este exercício:',
}) => {
  const hasDescription = !!description && description.trim().length > 0;
  const hasTips = Array.isArray(tips) && tips.length > 0;

  if (!hasDescription && !hasTips) {
    return null;
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>

      {hasDescription && <Text style={styles.description}>{description}</Text>}

      {hasTips && (
        <>
          <Text style={styles.sectionTitle}>Passo a passo:</Text>

          {tips!.map((tip, index) => (
            <View key={`${tip}-${index}`} style={styles.tipRow}>
              <View style={styles.bullet} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </>
      )}
    </View>
  );
};

export default ActivitySteps;

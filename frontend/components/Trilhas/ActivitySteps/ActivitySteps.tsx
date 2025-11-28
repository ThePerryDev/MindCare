// frontend/components/Trilhas/ActivitySteps/ActivitySteps.tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import Checkbox from '@/components/Checkbox/Checkbox';
import type { TrilhaDayMode } from '../types';

export type ActivityStepsProps = {
  /** Descrição geral do exercício (objetivo / contexto) */
  description?: string;
  /** Lista de passos de como realizar o exercício */
  tips?: string[];
  /** Título da seção (default: "Como realizar este exercício:") */
  title?: string;
  /**
   * Modo da atividade:
   *  - 'timer' -> bullets roxos
   *  - 'checklist' -> checkboxes no lugar dos bullets
   */
  mode?: TrilhaDayMode;
};

const ActivitySteps: React.FC<ActivityStepsProps> = ({
  description,
  tips,
  title = 'Como realizar este exercício:',
  mode = 'timer',
}) => {
  const hasDescription = !!description && description.trim().length > 0;
  const hasTips = Array.isArray(tips) && tips.length > 0;

  // Estado local só pra UI dos checkboxes (não precisa ir pro backend)
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});

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

          {tips!.map((tip, index) => {
            const isChecked = !!checkedMap[index];

            // CHECKLIST: usa checkbox no lugar da bolinha roxa
            if (mode === 'checklist') {
              return (
                <View key={`${tip}-${index}`} style={styles.tipRow}>
                  <Checkbox
                    checked={isChecked}
                    onToggle={() =>
                      setCheckedMap(prev => ({
                        ...prev,
                        [index]: !prev[index],
                      }))
                    }
                    size={20}
                    accessibilityLabel={`Marcar passo ${index + 1}`}
                  />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              );
            }

            // TIMER: mantém bullet roxo normal
            return (
              <View key={`${tip}-${index}`} style={styles.tipRow}>
                <View style={styles.bullet} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            );
          })}
        </>
      )}
    </View>
  );
};

export default ActivitySteps;

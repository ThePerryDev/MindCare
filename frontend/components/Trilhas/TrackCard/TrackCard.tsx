// frontend/components/Trilhas/TrackCard/TrackCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export type TrackStatus =
  | 'completed'
  | 'in_progress'
  | 'not_started'
  | 'locked';

export type Track = {
  id: string;
  title: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Livre';
  duration: string;
  progressPercent: number;
  totalSteps: number;
  // AGORA: lista dos steps concluídos nesse ciclo (ex.: [1, 5])
  completedSteps: number[];
  status: TrackStatus;
  backgroundColor: string;
  // quantas vezes a trilha foi concluída por completo
  completionCount: number;
};

type TrackCardProps = {
  track: Track;
  onPrimaryPress: () => void;
  onDetailsPress: () => void;
  selectedStep: number;
  onStepSelect: (step: number) => void;
};

// 🔧 Regra do texto do botão primário:
// - locked      -> "Bloqueado"
// - completed   -> "Recomeçar"
// - outros      -> "Começar"
function renderPrimaryButtonLabel(status: TrackStatus) {
  if (status === 'locked') {
    return 'Bloqueado';
  }
  if (status === 'completed') {
    return 'Recomeçar';
  }
  return 'Começar';
}

const TrackCard: React.FC<TrackCardProps> = ({
  track,
  onPrimaryPress,
  onDetailsPress,
  selectedStep,
  onStepSelect,
}) => {
  const isPrimaryButtonDisabled = track.status === 'locked';
  const primaryLabel = renderPrimaryButtonLabel(track.status);

  const isCompleted = track.status === 'completed';
  const isLocked = track.status === 'locked';

  const progressLabel = isLocked
    ? 'Bloqueada'
    : isCompleted
      ? 'Trilha concluída'
      : 'Progresso';

  const lastCompleted =
    track.completedSteps.length > 0 ? Math.max(...track.completedSteps) : 0;

  return (
    <View
      style={[styles.trackCard, { backgroundColor: track.backgroundColor }]}
    >
      <View style={styles.trackHeader}>
        <View style={styles.trackHeaderText}>
          <Text style={styles.trackTitle}>{track.title}</Text>
          <View style={styles.trackMetaRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{track.level}</Text>
            </View>
            <Text style={styles.durationText}>{track.duration}</Text>
          </View>
        </View>

        <View style={styles.completionBadge}>
          <Text style={styles.completionBadgeLabel}>Concluído</Text>
          <Text style={styles.completionBadgeCount}>
            {track.completionCount}x
          </Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>{progressLabel}</Text>
        <Text style={styles.progressPercent}>{track.progressPercent}%</Text>
      </View>

      <View style={styles.stepsRow}>
        {Array.from({ length: track.totalSteps }).map((_, index) => {
          const stepNumber = index + 1;

          const isStepCompleted = track.completedSteps.includes(stepNumber);

          const isCurrentStep =
            track.status === 'in_progress' &&
            !isStepCompleted &&
            stepNumber === lastCompleted + 1;

          const isLockedStep = track.status === 'locked';
          const isSelected = selectedStep === stepNumber;

          return (
            <TouchableOpacity
              key={stepNumber}
              style={[
                styles.step,
                isLockedStep && styles.stepLocked,
                isStepCompleted && styles.stepCompleted,
                isCurrentStep && styles.stepCurrent,
                !isLockedStep && isSelected && styles.stepSelected,
              ]}
              disabled={isLockedStep}
              activeOpacity={0.8}
              onPress={() => {
                if (!isLockedStep) {
                  onStepSelect(stepNumber);
                }
              }}
            >
              <Text
                style={[
                  styles.stepText,
                  isLockedStep && styles.stepTextLocked,
                  isStepCompleted && styles.stepTextCompleted,
                  isCurrentStep && styles.stepTextCurrent,
                ]}
              >
                {stepNumber}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.trackActions}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            isLocked && styles.primaryButtonDisabled,
            isCompleted && styles.primaryButtonCompleted,
          ]}
          disabled={isPrimaryButtonDisabled}
          onPress={onPrimaryPress}
          activeOpacity={0.9}
        >
          <Text
            style={[
              styles.primaryButtonText,
              isLocked && styles.primaryButtonTextDisabled,
            ]}
          >
            {primaryLabel}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            isLocked && styles.secondaryButtonDisabled,
          ]}
          disabled={isLocked}
          onPress={onDetailsPress}
          activeOpacity={0.9}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              isLocked && styles.secondaryButtonTextDisabled,
            ]}
          >
            Detalhes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TrackCard;

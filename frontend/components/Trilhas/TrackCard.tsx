// frontend/components/Trilhas/TrackCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '@/app/screens/TrilhaScreen/styles';

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
  completedSteps: number;
  status: TrackStatus;
  backgroundColor: string;
};

type TrackCardProps = {
  track: Track;
  onPrimaryPress: () => void;
  onDetailsPress: () => void;
};

function renderPrimaryButtonLabel(status: TrackStatus) {
  switch (status) {
    case 'completed':
      return 'Concluído';
    case 'in_progress':
      return 'Continuar';
    case 'not_started':
      return 'Começar';
    case 'locked':
      return 'Bloqueado';
    default:
      return 'Começar';
  }
}

function renderStep(track: Track, index: number) {
  const stepNumber = index + 1;

  if (track.status === 'locked') {
    return (
      <View key={stepNumber} style={[styles.step, styles.stepLocked]}>
        <Text style={[styles.stepText, styles.stepTextLocked]}>
          {stepNumber}
        </Text>
      </View>
    );
  }

  if (stepNumber <= track.completedSteps) {
    return (
      <View key={stepNumber} style={[styles.step, styles.stepCompleted]}>
        <Text style={[styles.stepText, styles.stepTextCompleted]}>
          {stepNumber}
        </Text>
      </View>
    );
  }

  if (
    track.status === 'in_progress' &&
    stepNumber === track.completedSteps + 1
  ) {
    return (
      <View key={stepNumber} style={[styles.step, styles.stepCurrent]}>
        <Text style={[styles.stepText, styles.stepTextCurrent]}>
          {stepNumber}
        </Text>
      </View>
    );
  }

  return (
    <View key={stepNumber} style={styles.step}>
      <Text style={styles.stepText}>{stepNumber}</Text>
    </View>
  );
}

const TrackCard: React.FC<TrackCardProps> = ({
  track,
  onPrimaryPress,
  onDetailsPress,
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

  return (
    <View
      style={[styles.trackCard, { backgroundColor: track.backgroundColor }]}
    >
      <View style={styles.trackHeader}>
        <View style={styles.trackIcon} />
        <View style={styles.trackHeaderText}>
          <Text style={styles.trackTitle}>{track.title}</Text>
          <View style={styles.trackMetaRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{track.level}</Text>
            </View>
            <Text style={styles.durationText}>{track.duration}</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>{progressLabel}</Text>
        <Text style={styles.progressPercent}>{track.progressPercent}%</Text>
      </View>

      <View style={styles.stepsRow}>
        {Array.from({ length: track.totalSteps }).map((_, i) =>
          renderStep(track, i)
        )}
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

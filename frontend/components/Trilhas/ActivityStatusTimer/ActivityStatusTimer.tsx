// frontend/components/Trilhas/ActivityStatusTimer/ActivityStatusTimer.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

export interface ActivityStatusTimerProps {
  /** Tempo restante em segundos */
  remainingSeconds: number;
  /** Tempo total da atividade em segundos */
  totalSeconds: number;
  /** Se o timer está rodando ou não */
  isPlaying: boolean;
  /** Callback para alternar entre play/pause */
  onTogglePlayPause: () => void;
  /** Callback para concluir atividade (sempre visível) */
  onCompletePress: () => void;
  /** Se os botões devem ficar desabilitados (ex: salvando no backend) */
  disabled?: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function ActivityStatusTimer({
  remainingSeconds,
  totalSeconds,
  isPlaying,
  onTogglePlayPause,
  onCompletePress,
  disabled = false,
}: ActivityStatusTimerProps) {
  const progress = totalSeconds > 0 ? 1 - remainingSeconds / totalSeconds : 0;

  const statusLabel =
    remainingSeconds <= 0
      ? 'Atividade concluída'
      : isPlaying
        ? 'Atividade em andamento'
        : 'Atividade pausada';

  const canToggle = !disabled && remainingSeconds > 0;

  return (
    <View style={styles.container}>
      {/* Status + Tempo */}
      <View style={styles.headerRow}>
        <Text style={styles.statusLabel}>{statusLabel}</Text>
        <Text style={styles.timeText}>{formatTime(remainingSeconds)}</Text>
      </View>

      {/* Barra de progresso */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(Math.max(progress, 0), 1) * 100}%` },
          ]}
        />
      </View>

      {/* Controles */}
      <View style={styles.controlsRow}>
        {/* Botão Play/Pause */}
        <Pressable
          onPress={onTogglePlayPause}
          disabled={!canToggle}
          style={({ pressed }) => [
            styles.playPauseButton,
            !canToggle && styles.buttonDisabled,
            pressed && canToggle && styles.buttonPressed,
          ]}
          accessibilityRole='button'
          accessibilityLabel={
            isPlaying ? 'Pausar atividade' : 'Iniciar atividade'
          }
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color='#FFFFFF'
          />
        </Pressable>

        {/* Botão Concluir (sempre visível) */}
        <Pressable
          onPress={onCompletePress}
          disabled={disabled}
          style={({ pressed }) => [
            styles.completeButton,
            disabled && styles.buttonDisabled,
            pressed && !disabled && styles.buttonPressedLight,
          ]}
          accessibilityRole='button'
          accessibilityLabel='Concluir atividade'
        >
          <Text style={styles.completeButtonText}>Concluir atividade</Text>
        </Pressable>
      </View>
    </View>
  );
}

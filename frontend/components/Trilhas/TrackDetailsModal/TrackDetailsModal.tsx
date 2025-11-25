// frontend/components/Trilhas/TrackDetailsModal/TrackDetailsModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
import { styles } from './styles';
import { Track } from '../TrackCard/TrackCard';
import type { TrilhaModel } from '@/components/Trilhas/types';
import CloseButton from '@/components/CloseButton/CloseButton';

type TrackDetailsModalProps = {
  visible: boolean;
  track: Track | null;
  trilha: TrilhaModel | null;
  onClose: () => void;
  onStart: (event: GestureResponderEvent) => void;
};

export const TrackDetailsModal: React.FC<TrackDetailsModalProps> = ({
  visible,
  track,
  trilha,
  onClose,
  onStart,
}) => {
  if (!visible || !track || !trilha) {
    return null;
  }

  // Define qual dia mostrar com base no progresso da trilha
  const totalDays = trilha.days.length || 1;
  const currentDayIndex = Math.max(
    0,
    Math.min(track.completedSteps, totalDays - 1)
  );
  const currentDay = trilha.days[currentDayIndex];

  const activityTitle = currentDay?.microHabit ?? trilha.name;
  const description =
    currentDay?.goal ??
    'Prática guiada para apoiar seu bem-estar nesta trilha.';
  const benefits = currentDay?.benefits ?? [];

  return (
    <Modal
      transparent
      visible={visible}
      animationType='fade'
      onRequestClose={onClose}
    >
      {/* Fundo escuro clicável para fechar */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Card */}
      <View style={styles.sheet}>
        {/* Topo: nome da trilha + CloseButton */}
        <View style={styles.topRow}>
          <Text style={styles.trailTitle}>{track.title}</Text>

          <CloseButton onPress={onClose} />
        </View>

        <View style={styles.divider} />

        {/* Nome da atividade do dia */}
        <Text style={styles.activityTitle}>{activityTitle}</Text>

        {/* Objetivo / descrição da atividade */}
        <Text style={styles.description}>{description}</Text>

        {/* Benefícios */}
        {benefits.length > 0 && (
          <>
            <Text style={styles.benefitsTitle}>Benefícios desta trilha:</Text>

            {benefits.map(benefit => (
              <View key={benefit} style={styles.benefitRow}>
                <Text style={styles.benefitCheck}>✓</Text>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </>
        )}

        {/* Botão para iniciar a atividade */}
        <View style={styles.actionWrapper}>
          <Pressable onPress={onStart} android_ripple={{ color: '#5534d4' }}>
            <View style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Iniciar atividade</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

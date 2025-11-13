// app/screens/TrilhaScreen/TrilhaScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { styles } from './styles';
import { theme } from '@/styles/theme';
import Navbar from '@/components/Navbar/Navbar';

type TrackStatus = 'completed' | 'in_progress' | 'not_started' | 'locked';

type Track = {
  id: string;
  title: string;
  level: 'Iniciante' | 'Intermediário';
  duration: string;
  progressPercent: number;
  totalSteps: number;
  completedSteps: number;
  status: TrackStatus;
  backgroundColor: string;
};

const TRACKS: Track[] = [
  {
    id: 'mindfulness-basic',
    title: 'Mindfulness Básico',
    level: 'Iniciante',
    duration: '5–10 min',
    progressPercent: 100,
    totalSteps: 7,
    completedSteps: 7,
    status: 'completed',
    backgroundColor: '#DFF4EE',
  },
  {
    id: 'stress-relief',
    title: 'Alívio do Estresse',
    level: 'Intermediário',
    duration: '10–15 min',
    progressPercent: 43,
    totalSteps: 7,
    completedSteps: 3, // 1,2,3 concluídas – 4 é atual
    status: 'in_progress',
    backgroundColor: '#FFEDE1',
  },
  {
    id: 'gratitude',
    title: 'Gratidão e Felicidade',
    level: 'Iniciante',
    duration: '5–10 min',
    progressPercent: 0,
    totalSteps: 7,
    completedSteps: 0,
    status: 'not_started',
    backgroundColor: '#F3EEFF',
  },
  {
    id: 'anxiety-control',
    title: 'Controle de Ansiedade',
    level: 'Intermediário',
    duration: '10–15 min',
    progressPercent: 0,
    totalSteps: 7,
    completedSteps: 0,
    status: 'locked',
    backgroundColor: '#F1F4F7',
  },
];

export default function TrilhaScreen() {
  const router = useRouter();

  const renderStep = (track: Track, index: number) => {
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
  };

  const renderPrimaryButtonLabel = (track: Track) => {
    switch (track.status) {
      case 'completed':
        return 'Concluída';
      case 'in_progress':
        return 'Continuar';
      case 'not_started':
        return 'Iniciar';
      case 'locked':
        return 'Bloqueado';
      default:
        return 'Iniciar';
    }
  };

  const isPrimaryButtonDisabled = (track: Track) =>
    track.status === 'locked';

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.bg}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={28}
                color="#4C46B6"
              />
            </TouchableOpacity>
            <Text style={styles.title}>Trilhas</Text>
          </View>

          {/* LISTA DE TRILHAS */}
          {TRACKS.map(track => (
            <View
              key={track.id}
              style={[styles.trackCard, { backgroundColor: track.backgroundColor }]}
            >
              {/* Header do card */}
              <View style={styles.trackHeader}>
                <View style={styles.trackIcon} />
                <View style={styles.trackHeaderText}>
                  <Text style={styles.trackTitle}>{track.title}</Text>
                  <View style={styles.trackMetaRow}>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelBadgeText}>
                        {track.level}
                      </Text>
                    </View>
                    <Text style={styles.durationText}>{track.duration}</Text>
                  </View>
                </View>
              </View>

              {/* Progresso */}
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>
                  {track.status === 'locked' ? 'Bloqueada' : 'Progresso'}
                </Text>
                <Text style={styles.progressPercent}>
                  {track.progressPercent}%
                </Text>
              </View>

              {/* Etapas */}
              <View style={styles.stepsRow}>
                {Array.from({ length: track.totalSteps }).map((_, i) =>
                  renderStep(track, i),
                )}
              </View>

              {/* Botões */}
              <View style={styles.trackActions}>
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    isPrimaryButtonDisabled(track) &&
                      styles.primaryButtonDisabled,
                    track.status === 'completed' &&
                      styles.primaryButtonCompleted,
                  ]}
                  disabled={isPrimaryButtonDisabled(track)}
                  onPress={() => {
                    // TODO: navegar para detalhes / player da trilha
                  }}
                >
                  <Text
                    style={[
                      styles.primaryButtonText,
                      isPrimaryButtonDisabled(track) &&
                        styles.primaryButtonTextDisabled,
                    ]}
                  >
                    {renderPrimaryButtonLabel(track)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    track.status === 'locked' &&
                      styles.secondaryButtonDisabled,
                  ]}
                  disabled={track.status === 'locked'}
                  onPress={() => {
                    // TODO: navegar para tela de detalhes
                  }}
                >
                  <Text
                    style={[
                      styles.secondaryButtonText,
                      track.status === 'locked' &&
                        styles.secondaryButtonTextDisabled,
                    ]}
                  >
                    Detalhes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <Navbar />
      </LinearGradient>
    </SafeAreaView>
  );
}

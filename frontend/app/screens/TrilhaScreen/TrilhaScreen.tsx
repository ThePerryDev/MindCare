import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from './styles';
import { theme } from '@/styles/theme';
import Navbar from '@/components/Navbar/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TrackCard, { Track } from '@/components/Trilhas/TrackCard';

import {
  trilhaAnsiedadeLeve,
  trilhaEstresseTrabalho,
  trilhaSonoRelaxamento,
  trilhaHumorPositivoMotivacao,
  trilhaMuitoFeliz,
  trilhaNeutro,
  trilhaTriste,
  trilhaIrritado,
  trilhaMuitoTriste,
  trilhaMindfulnessBasico,
  trilhaAlivioEstresse,
  trilhaGratidaoFelicidade,
  trilhaControleAnsiedade,
} from '@/components/Trilhas/models';

import type { TrilhaModel } from '@/components/Trilhas/types';

const PROGRESS_PREFIX = '@mindcare/trilha-progress/';

async function getCurrentDay(trackKey: string): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_PREFIX + trackKey);
    const n = Number(raw);
    return Number.isFinite(n) && n >= 1 && n <= 7 ? n : 1;
  } catch {
    return 1;
  }
}

async function setCurrentDay(trackKey: string, day: number): Promise<void> {
  const safeDay = Math.max(1, Math.min(7, day));
  await AsyncStorage.setItem(PROGRESS_PREFIX + trackKey, String(safeDay));
}

async function advanceDay(trackKey: string): Promise<number> {
  const current = await getCurrentDay(trackKey);
  const next = Math.min(current + 1, 7);
  await setCurrentDay(trackKey, next);
  return next;
}

type TrackDetails = {
  activityTitle: string;
  description: string;
  benefits: string[];
};

type SessionActivity = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tips?: string[];
};

type Session = {
  trackId: string;
  dayLabel: string;
  activityTitle: string;
  minutes: number;
  description: string;
  activities: SessionActivity[];
  totalSeconds: number;
};

/**
 * Define a cor de fundo do card de acordo com o status da trilha
 */
function getTrackBackgroundColor(status: Track['status']): string {
  switch (status) {
    case 'completed':
      // #10B981 com ~20% de transparência
      return 'rgba(16, 185, 129, 0.2)';
    case 'in_progress':
      // #F59E0B com ~20% de transparência
      return 'rgba(245, 158, 11, 0.2)';
    case 'not_started':
      // #E5E7EB opaco
      return '#E5E7EB';
    case 'locked':
    default:
      return '#E5E7EB';
  }
}

/**
 * Lista de trilhas vindas dos models
 */
const TRILHAS: TrilhaModel[] = [
  trilhaAnsiedadeLeve,
  trilhaEstresseTrabalho,
  trilhaSonoRelaxamento,
  trilhaHumorPositivoMotivacao,
  trilhaMuitoFeliz,
  trilhaNeutro,
  trilhaTriste,
  trilhaIrritado,
  trilhaMuitoTriste,
  trilhaMindfulnessBasico,
  trilhaAlivioEstresse,
  trilhaGratidaoFelicidade,
  trilhaControleAnsiedade,
];

const DEFAULT_TRILHA = trilhaAnsiedadeLeve;

/**
 * Extrai minutos da label do dia ou usa minMinutes / fallback
 */
function getMinutesFromDay(trilha: TrilhaModel, dayIndex: number): number {
  const day = trilha.days[dayIndex];
  if (day?.durationLabel) {
    const match = day.durationLabel.match(/(\d+)/);
    if (match) {
      const n = Number(match[1]);
      if (Number.isFinite(n) && n > 0) return n;
    }
  }

  if (trilha.minMinutes && Number.isFinite(trilha.minMinutes)) {
    return trilha.minMinutes;
  }

  return 5; // fallback
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TrilhaScreen() {
  const router = useRouter();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentDay, setCurrentDay] = useState(1);

  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedActivity, setSelectedActivity] =
    useState<SessionActivity | null>(null);

  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  /**
   * Recalcula os TRACKS lendo o currentDay de cada trilha no AsyncStorage
   */
  const refreshTracks = useCallback(async () => {
    const newTracks: Track[] = [];

    for (const trilha of TRILHAS) {
      const totalSteps = trilha.days.length || 1;
      let day = 1;
      try {
        day = await getCurrentDay(trilha.key);
      } catch {
        day = 1;
      }

      const currentStep = Math.max(1, Math.min(day, totalSteps));
      const completedSteps = currentStep - 1;

      let status: Track['status'];
      if (completedSteps <= 0) {
        status = 'not_started';
      } else if (completedSteps >= totalSteps) {
        status = 'completed';
      } else {
        status = 'in_progress';
      }

      const progressPercent =
        totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

      let duration = '—';
      if (trilha.minMinutes && trilha.maxMinutes) {
        duration = `${trilha.minMinutes}–${trilha.maxMinutes} min`;
      } else if (trilha.minMinutes && !trilha.maxMinutes) {
        duration = `${trilha.minMinutes} min`;
      }

      newTracks.push({
        id: trilha.key,
        title: trilha.name,
        level: trilha.level,
        duration,
        progressPercent,
        totalSteps,
        completedSteps,
        status,
        backgroundColor: getTrackBackgroundColor(status),
      });
    }

    setTracks(newTracks);
  }, []);

  useEffect(() => {
    refreshTracks();
  }, [refreshTracks]);

  useEffect(() => {
    if (!session || !isPlaying) return;

    const id = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(id);

          if (session.trackId) {
            advanceDay(session.trackId)
              .then(day => {
                setCurrentDay(day);
                refreshTracks(); // atualiza cards depois de avançar o dia
              })
              .catch(() => {});
          }

          setIsPlaying(false);
          setShowCompletion(true);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [session, isPlaying, refreshTracks]);

  const closeDetailsModal = () => setSelectedTrack(null);

  const handlePrimaryPress = (track: Track) => {
    if (track.status === 'locked') return;
    setSelectedTrack(track);
  };

  const handleDetailsPress = (track: Track) => {
    if (track.status === 'locked') return;
    setSelectedTrack(track);
  };

  const handleStartSession = (track: Track) => {
    const trilha = TRILHAS.find(t => t.key === track.id) ?? DEFAULT_TRILHA;

    getCurrentDay(trilha.key)
      .then(day => {
        const safeDay = Math.max(1, Math.min(day, trilha.days.length || 1));
        setCurrentDay(safeDay);

        const dayIndex = safeDay - 1;
        const dayData = trilha.days[dayIndex] ?? trilha.days[0];

        const minutes = getMinutesFromDay(trilha, dayIndex);
        const totalSeconds = minutes * 60;

        const sessionData: Session = {
          trackId: trilha.key,
          dayLabel: `Dia ${safeDay}`,
          activityTitle: dayData?.microHabit ?? trilha.name,
          minutes,
          description: dayData?.goal ?? '',
          activities: [
            {
              id: 'main',
              title: dayData?.microHabit ?? trilha.name,
              subtitle: dayData?.durationLabel ?? `${minutes} min`,
              description: dayData?.goal ?? '',
              tips: [],
            },
          ],
          totalSeconds,
        };

        setSession(sessionData);
        setSelectedActivity(null);
        setRemainingSeconds(sessionData.totalSeconds);
        setIsPlaying(true);
      })
      .catch(() => {
        const dayIndex = 0;
        const dayData = trilha.days[dayIndex];
        const minutes = getMinutesFromDay(trilha, dayIndex);

        const sessionData: Session = {
          trackId: trilha.key,
          dayLabel: 'Dia 1',
          activityTitle: dayData?.microHabit ?? trilha.name,
          minutes,
          description: dayData?.goal ?? '',
          activities: [
            {
              id: 'main',
              title: dayData?.microHabit ?? trilha.name,
              subtitle: dayData?.durationLabel ?? `${minutes} min`,
              description: dayData?.goal ?? '',
              tips: [],
            },
          ],
          totalSeconds: minutes * 60,
        };

        setCurrentDay(1);
        setSession(sessionData);
        setSelectedActivity(null);
        setRemainingSeconds(sessionData.totalSeconds);
        setIsPlaying(true);
      });
  };

  const closeSessionModal = () => {
    setSession(null);
    setIsPlaying(false);
    setRemainingSeconds(0);
    setSelectedActivity(null);
  };

  const handleCloseCompletion = () => {
    setShowCompletion(false);
    closeSessionModal();
  };

  const progress =
    session && session.totalSeconds > 0
      ? 1 - remainingSeconds / session.totalSeconds
      : 0;

  const activeTrilha =
    TRILHAS.find(t => t.key === session?.trackId) ?? DEFAULT_TRILHA;

  const activeDays = activeTrilha.days;
  const currentDayIndex = Math.max(
    0,
    Math.min(currentDay - 1, activeDays.length - 1)
  );
  const currentDayData = activeDays[currentDayIndex] ?? activeDays[0];

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
                name='chevron-left'
                size={28}
                color='#4C46B6'
              />
            </TouchableOpacity>
            <Text style={styles.title}>Trilhas</Text>
          </View>

          {/* LISTA DE TRILHAS */}
          {tracks.map(track => (
            <TrackCard
              key={track.id}
              track={track}
              onPrimaryPress={() => handlePrimaryPress(track)}
              onDetailsPress={() => handleDetailsPress(track)}
            />
          ))}
        </ScrollView>

        {/* MODAL 1 – DETALHES DA TRILHA */}
        <Modal
          transparent
          visible={!!selectedTrack}
          animationType='fade'
          onRequestClose={closeDetailsModal}
        >
          <Pressable style={styles.infoBackdrop} onPress={closeDetailsModal} />
          {selectedTrack && (
            <View style={[styles.infoSheet, styles.modalCard]}>
              <View style={styles.modalTopRow}>
                <Text style={styles.modalTrackTitle}>
                  {selectedTrack.title}
                </Text>
                <TouchableOpacity
                  onPress={closeDetailsModal}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <View style={styles.modalCloseIcon}>
                    <MaterialCommunityIcons
                      name='close'
                      size={18}
                      color='#7B6AFB'
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.modalDivider} />

              {(() => {
                const trilha =
                  TRILHAS.find(t => t.key === selectedTrack.id) ??
                  DEFAULT_TRILHA;

                // Pegamos o dia atual salvo no AsyncStorage
                const currentDayIndex = Math.max(
                  0,
                  Math.min(selectedTrack.completedSteps, trilha.days.length - 1)
                );

                // Pegamos os dados do dia atual
                const currentDayData = trilha.days[currentDayIndex];

                const details: TrackDetails = {
                  activityTitle: currentDayData?.microHabit ?? trilha.name,
                  description:
                    currentDayData?.goal ??
                    'Prática guiada para apoiar seu bem-estar nesta trilha.',
                  benefits: currentDayData?.benefits ?? [],
                };

                return (
                  <>
                    <Text style={styles.modalActivityTitle}>
                      {details.activityTitle}
                    </Text>

                    <Text style={styles.modalDescription}>
                      {details.description}
                    </Text>

                    {details.benefits.length > 0 && (
                      <>
                        <Text style={styles.modalBenefitsTitle}>
                          Benefícios desta trilha:
                        </Text>

                        {details.benefits.map(benefit => (
                          <View key={benefit} style={styles.modalBenefitRow}>
                            <Text style={styles.modalBenefitCheck}>✓</Text>
                            <Text style={styles.modalBenefitText}>
                              {benefit}
                            </Text>
                          </View>
                        ))}
                      </>
                    )}
                  </>
                );
              })()}

              <View style={styles.modalActionWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    if (!selectedTrack) return;
                    const track = selectedTrack;
                    closeDetailsModal();
                    handleStartSession(track);
                  }}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['#6C4FF6', '#9A4DFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.modalActionButton}
                  >
                    <Text style={styles.modalActionButtonText}>
                      Iniciar Agora
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Modal>

        {/* MODAL 2 – SESSÃO EM ANDAMENTO COM TIMER */}
        <Modal
          transparent
          visible={!!session}
          animationType='fade'
          onRequestClose={closeSessionModal}
        >
          <Pressable style={styles.infoBackdrop} onPress={closeSessionModal} />
          {session && (
            <View style={[styles.infoSheet, styles.sessionModalCard]}>
              <View style={styles.sessionTopRow}>
                <Text style={styles.sessionDayText}>Dia {currentDay}</Text>

                <TouchableOpacity
                  onPress={closeSessionModal}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <View style={styles.modalCloseIcon}>
                    <MaterialCommunityIcons
                      name='close'
                      size={18}
                      color='#7B6AFB'
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.sessionDivider} />

              <View style={styles.sessionHeaderCenter}>
                <LinearGradient
                  colors={['#6C4FF6', '#9A4DFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sessionIconCircle}
                >
                  <Text style={styles.sessionIconText}>{currentDay}</Text>
                </LinearGradient>

                <Text style={styles.sessionTitle}>
                  {currentDayData.microHabit}
                </Text>

                <Text style={styles.sessionDurationText}>
                  {currentDayData.durationLabel}
                </Text>

                <Text style={styles.sessionDescription}>
                  {currentDayData.goal}
                </Text>
              </View>

              <Text style={styles.sessionSectionTitle}>Atividades</Text>

              {session.activities.map(activity => (
                <TouchableOpacity
                  key={activity.id}
                  activeOpacity={0.9}
                  onPress={() => setSelectedActivity(activity)}
                >
                  <View style={styles.sessionActivityCard}>
                    <View style={styles.sessionActivityLeft}>
                      <View style={styles.sessionActivityIcon} />
                      <View style={styles.sessionActivityTextBlock}>
                        <Text style={styles.sessionActivityTitle}>
                          {activity.title}
                        </Text>
                        <Text style={styles.sessionActivitySubtitle}>
                          {activity.subtitle}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              <View style={styles.sessionStatusRow}>
                <Text style={styles.sessionStatusLabel}>
                  Atividade em andamento
                </Text>
                <Text style={styles.sessionStatusTime}>
                  {formatTime(remainingSeconds)}
                </Text>
              </View>

              <View style={styles.sessionProgressBarTrack}>
                <View
                  style={[
                    styles.sessionProgressBarFill,
                    { width: `${progress * 100}%` },
                  ]}
                />
              </View>

              <View style={styles.sessionControlsRow}>
                <TouchableOpacity
                  onPress={() => setIsPlaying(false)}
                  disabled={!session || remainingSeconds === 0}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#E4E0FF', '#E4E0FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sessionControlButton}
                  >
                    <MaterialCommunityIcons
                      name='pause'
                      size={22}
                      color='#6C4FF6'
                    />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!session) return;
                    if (remainingSeconds === 0) {
                      setRemainingSeconds(session.totalSeconds);
                    }
                    setIsPlaying(true);
                  }}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#6C4FF6', '#9A4DFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sessionControlButton}
                  >
                    <MaterialCommunityIcons
                      name='play'
                      size={22}
                      color='#FFFFFF'
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Modal>

        {/* MODAL 3 – DETALHES DO EXERCÍCIO */}
        <Modal
          transparent
          visible={!!selectedActivity}
          animationType='fade'
          onRequestClose={() => setSelectedActivity(null)}
        >
          <Pressable
            style={styles.infoBackdrop}
            onPress={() => setSelectedActivity(null)}
          />
          {selectedActivity && (
            <View style={[styles.infoSheet, styles.activityModalCard]}>
              <View style={styles.activityModalTopRow}>
                <Text style={styles.activityModalTitle}>
                  {selectedActivity.title}
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedActivity(null)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <View style={styles.modalCloseIcon}>
                    <MaterialCommunityIcons
                      name='close'
                      size={18}
                      color='#7B6AFB'
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <Text style={styles.activityModalSubtitle}>
                {selectedActivity.subtitle}
              </Text>

              <View style={styles.activityModalDivider} />

              <Text style={styles.activityModalSectionTitle}>
                Como realizar este exercício:
              </Text>

              <Text style={styles.activityModalDescription}>
                {selectedActivity.description}
              </Text>

              {selectedActivity.tips && selectedActivity.tips.length > 0 && (
                <>
                  <Text style={styles.activityModalSectionTitle}>
                    Passo a passo:
                  </Text>
                  {selectedActivity.tips.map(tip => (
                    <View key={tip} style={styles.activityModalTipRow}>
                      <View style={styles.activityModalBullet} />
                      <Text style={styles.activityModalTipText}>{tip}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}
        </Modal>

        {/* MODAL 4 – TELA DE CONCLUSÃO ("Parabéns!") */}
        <Modal
          transparent={false}
          visible={showCompletion}
          animationType='fade'
          onRequestClose={handleCloseCompletion}
        >
          <SafeAreaView style={styles.completionSafe}>
            <LinearGradient
              colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={styles.completionGradient}
            >
              <View style={styles.completionContent}>
                <Text style={styles.completionTitle}>Parabéns !</Text>
                <Text style={styles.completionSubtitle}>
                  Você completou a atividade com sucesso!
                </Text>

                <Image
                  source={require('../../../assets/images/Platypus.png')}
                  style={styles.completionImage}
                />

                <TouchableOpacity
                  style={styles.completionButton}
                  onPress={handleCloseCompletion}
                  activeOpacity={0.9}
                >
                  <Text style={styles.completionButtonText}>Voltar</Text>
                </TouchableOpacity>
              </View>

              <Navbar />
            </LinearGradient>
          </SafeAreaView>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

import React, { useEffect, useState } from 'react';
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

/**
 * Cores usadas para os cards (vai ciclando)
 */
const CARD_COLORS = [
  '#DFF4EE',
  '#FFEDE1',
  '#F3EEFF',
  '#F1F4F7',
  '#FFF6E5',
  '#E6F4FF',
];

/**
 * Gera os TRACKS (cards) a partir dos models de trilha
 */
const TRACKS: Track[] = TRILHAS.map((trilha, index) => {
  let duration = '—';

  if (trilha.minMinutes && trilha.maxMinutes) {
    duration = `${trilha.minMinutes}–${trilha.maxMinutes} min`;
  } else if (trilha.minMinutes && !trilha.maxMinutes) {
    duration = `${trilha.minMinutes} min`;
  }

  return {
    id: trilha.key,
    title: trilha.name,
    level: trilha.level,
    duration,
    progressPercent: 0, // depois você pode ligar com AsyncStorage
    totalSteps: trilha.days.length,
    completedSteps: 0, // idem
    status: 'not_started',
    backgroundColor: CARD_COLORS[index % CARD_COLORS.length],
  };
});

/**
 * Usaremos a trilha de Ansiedade Leve como fallback
 * para o conteúdo dos detalhes/sessão por enquanto
 */
const FALLBACK_SESSION_TRACK_KEY = trilhaAnsiedadeLeve.key;

const TRACK_DETAILS: Record<string, TrackDetails> = {
  [FALLBACK_SESSION_TRACK_KEY]: {
    activityTitle: 'Respiração Consciente',
    description:
      'Pratique respiração profunda por alguns minutos para acalmar a mente e reduzir o estresse.',
    benefits: [
      'Reduz ansiedade e estresse',
      'Melhora o foco e concentração',
      'Promove relaxamento',
    ],
  },
};

const SESSION_DETAILS: Record<string, Session> = {
  [FALLBACK_SESSION_TRACK_KEY]: {
    trackId: FALLBACK_SESSION_TRACK_KEY,
    dayLabel: 'Dia 1',
    activityTitle: 'Respiração Consciente',
    minutes: 5,
    description:
      'Aprenda a técnica básica de respiração consciente para acalmar a mente.',
    activities: [
      {
        id: 'breathing',
        title: 'Exercício de Respiração',
        subtitle: '3 minutos de respiração 4–7–8',
        description:
          'Sente-se em uma posição confortável, com a coluna ereta, e foque na sua respiração seguindo o padrão 4–7–8.',
        tips: [
          'Inspire profundamente pelo nariz contando até 4.',
          'Segure o ar nos pulmões contando até 7.',
          'Expire lentamente pela boca contando até 8.',
          'Repita o ciclo por alguns minutos de forma suave, sem forçar.',
        ],
      },
      {
        id: 'reflection',
        title: 'Reflexão',
        subtitle: 'Como você se sente?',
        description:
          'Após o exercício de respiração, observe como seu corpo e sua mente se sentem neste momento.',
        tips: [
          'Feche os olhos por alguns instantes.',
          'Perceba seu ritmo cardíaco e sua respiração.',
          'Identifique emoções presentes sem julgá-las.',
          'Se quiser, anote em poucas palavras como está se sentindo.',
        ],
      },
    ],
    totalSeconds: 5 * 60,
  },
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TrilhaScreen() {
  const [currentDay, setCurrentDay] = useState(1);

  // por enquanto, o progresso está amarrado só à trilha de Ansiedade Leve
  useEffect(() => {
    getCurrentDay(trilhaAnsiedadeLeve.key).then(setCurrentDay);
  }, []);

  const router = useRouter();

  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedActivity, setSelectedActivity] =
    useState<SessionActivity | null>(null);

  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // NOVO: controla exibição da tela de "Parabéns!"
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    if (!session || !isPlaying || remainingSeconds <= 0) return;

    const id = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(id);

          if (session.trackId === FALLBACK_SESSION_TRACK_KEY) {
            advanceDay(trilhaAnsiedadeLeve.key)
              .then(setCurrentDay)
              .catch(() => {});
          }

          // terminou a atividade
          setIsPlaying(false);
          setShowCompletion(true);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [session, isPlaying, remainingSeconds]);

  const closeDetailsModal = () => setSelectedTrack(null);

  const handlePrimaryPress = (track: Track) => {
    if (track.status === 'locked') return;
    setSelectedTrack(track);
  };

  const handleDetailsPress = (track: Track) => {
    if (track.status === 'locked') return;

    const sessionData =
      SESSION_DETAILS[track.id] ?? SESSION_DETAILS[FALLBACK_SESSION_TRACK_KEY];

    const firstActivity = sessionData.activities[0];

    if (firstActivity) {
      setSelectedActivity(firstActivity);
    } else {
      setSelectedTrack(track);
    }
  };

  const handleStartSession = (track: Track) => {
    const sessionData =
      SESSION_DETAILS[track.id] ?? SESSION_DETAILS[FALLBACK_SESSION_TRACK_KEY];

    setSession(sessionData);
    setSelectedActivity(null);
    setRemainingSeconds(sessionData.totalSeconds);
    setIsPlaying(true);
  };

  const closeSessionModal = () => {
    setSession(null);
    setIsPlaying(false);
    setRemainingSeconds(0);
    setSelectedActivity(null);
  };

  // quando fecha a tela de "Parabéns", também fechamos a sessão
  const handleCloseCompletion = () => {
    setShowCompletion(false);
    closeSessionModal();
  };

  const progress =
    session && session.totalSeconds > 0
      ? 1 - remainingSeconds / session.totalSeconds
      : 0;

  // ainda usando só a trilha de Ansiedade Leve no modal de sessão
  const currentDayIndex = Math.max(
    0,
    Math.min(currentDay - 1, trilhaAnsiedadeLeve.days.length - 1)
  );
  const currentDayData = trilhaAnsiedadeLeve.days[currentDayIndex];

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
            <TrackCard
              key={track.id}
              track={track}
              onPrimaryPress={() => handlePrimaryPress(track)}
              onDetailsPress={() => handleDetailsPress(track)}
            />
          ))}
        </ScrollView>

        {/* MODAL 1 – DETALHES DA ATIVIDADE */}
        <Modal
          transparent
          visible={!!selectedTrack}
          animationType="fade"
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
                      name="close"
                      size={18}
                      color="#7B6AFB"
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.modalDivider} />

              {(() => {
                const details =
                  TRACK_DETAILS[selectedTrack.id] ??
                  TRACK_DETAILS[FALLBACK_SESSION_TRACK_KEY];

                return (
                  <>
                    <Text style={styles.modalActivityTitle}>
                      {details.activityTitle}
                    </Text>

                    <Text style={styles.modalDescription}>
                      {details.description}
                    </Text>

                    <Text style={styles.modalBenefitsTitle}>
                      Benefícios desta atividade:
                    </Text>

                    {details.benefits.map(benefit => (
                      <View key={benefit} style={styles.modalBenefitRow}>
                        <Text style={styles.modalBenefitCheck}>✓</Text>
                        <Text style={styles.modalBenefitText}>{benefit}</Text>
                      </View>
                    ))}
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
          animationType="fade"
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
                      name="close"
                      size={18}
                      color="#7B6AFB"
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
                      name="pause"
                      size={22}
                      color="#6C4FF6"
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
                      name="play"
                      size={22}
                      color="#FFFFFF"
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
          animationType="fade"
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
                      name="close"
                      size={18}
                      color="#7B6AFB"
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
          animationType="fade"
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
                  // 🔽 AJUSTE o caminho desse require para o asset real do ornitorrinco
                  source={require('@/assets/ornitorrinco-doutor.png')}
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

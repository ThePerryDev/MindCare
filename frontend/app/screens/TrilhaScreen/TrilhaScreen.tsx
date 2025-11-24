// frontend/app/TrilhaScreen/TrilhaScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';
import { theme } from '@/styles/theme';
import Navbar from '@/components/Navbar/Navbar';
import TrackCard, { Track } from '@/components/Trilhas/TrackCard/TrackCard';
import { TrackDetailsModal } from '@/components/Trilhas/TrackDetailsModal/TrackDetailsModal';
import ActivityModal from '@/components/Trilhas/ActivityModal/ActivityModal';
import type { TrilhaModel } from '@/components/Trilhas/types';
import {
  trilhaAnsiedadeLeve,
  trilhaEstresseTrabalho,
  trilhaMuitoFeliz,
  trilhaMuitoTriste,
} from '@/components/Trilhas/models';

const PROGRESS_PREFIX = '@mindcare/trilha-progress/';

// ---------------------- Persistência de progresso ----------------------

export async function getCurrentDay(trackKey: string): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_PREFIX + trackKey);
    const n = Number(raw);
    // Mantém compatibilidade com limite 1–8
    return Number.isFinite(n) && n >= 1 && n <= 8 ? n : 1;
  } catch {
    return 1;
  }
}

export async function setCurrentDay(
  trackKey: string,
  day: number
): Promise<void> {
  const safeDay = Math.max(1, Math.min(8, day));
  await AsyncStorage.setItem(PROGRESS_PREFIX + trackKey, String(safeDay));
}

export async function advanceDay(trackKey: string): Promise<number> {
  const current = await getCurrentDay(trackKey);
  const next = current + 1;
  await setCurrentDay(trackKey, next);
  return next;
}

// ---------------------- Utilidades de trilha ----------------------

function getTrackBackgroundColor(status: Track['status']): string {
  switch (status) {
    case 'completed':
      return 'rgba(16, 185, 129, 0.2)'; // verde claro
    case 'in_progress':
      return 'rgba(245, 158, 11, 0.2)'; // amarelo claro
    case 'not_started':
      return '#E5E7EB';
    case 'locked':
    default:
      return '#E5E7EB';
  }
}

const TRILHAS: TrilhaModel[] = [
  trilhaAnsiedadeLeve,
  trilhaEstresseTrabalho,
  trilhaMuitoFeliz,
  trilhaMuitoTriste,
];

const DEFAULT_TRILHA = trilhaAnsiedadeLeve;

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

  return 5;
}

// Mapeia emoção (string vinda do bot, ex.: 'tristeza') -> key da trilha
function getTrilhaKeyFromEmotion(emotionRaw?: string | null): string | null {
  if (!emotionRaw) return null;
  const emotion = emotionRaw.toLowerCase();

  switch (emotion) {
    case 'ansiedade':
      return trilhaAnsiedadeLeve.key;
    case 'estresse':
      return trilhaEstresseTrabalho.key;
    case 'felicidade':
      return trilhaMuitoFeliz.key;
    case 'tristeza':
      return trilhaMuitoTriste.key;
    default:
      return null;
  }
}

// ---------------------- Componente principal ----------------------

export default function TrilhaScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    trailId?: string | string[];
    emotion?: string | string[];
    autoStart?: string | string[];
  }>();

  const trailIdParam = Array.isArray(params.trailId)
    ? params.trailId[0]
    : params.trailId;

  const emotionParam = Array.isArray(params.emotion)
    ? params.emotion[0]
    : params.emotion;

  const autoStartParam = Array.isArray(params.autoStart)
    ? params.autoStart[0]
    : params.autoStart;

  // Lista de cards
  const [tracks, setTracks] = useState<Track[]>([]);

  // Estado para modal de detalhes da trilha
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedTrilha, setSelectedTrilha] = useState<TrilhaModel | null>(
    null
  );
  const [detailsVisible, setDetailsVisible] = useState(false);

  // Estado da sessão (ActivityModal)
  const [sessionVisible, setSessionVisible] = useState(false);
  const [sessionTrilha, setSessionTrilha] = useState<TrilhaModel | null>(null);
  const [currentDay, setCurrentDayState] = useState(1);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // ---------------------- Cálculo/refresh dos cards ----------------------

  const refreshTracks = useCallback(async () => {
    const newTracks: Track[] = [];

    for (const trilha of TRILHAS) {
      const totalSteps = trilha.days.length || 1;
      let storedDay = 1;

      try {
        storedDay = await getCurrentDay(trilha.key);
      } catch {
        storedDay = 1;
      }

      let completedSteps = storedDay - 1;
      if (completedSteps < 0) completedSteps = 0;
      if (completedSteps > totalSteps) completedSteps = totalSteps;

      let status: Track['status'];

      if (completedSteps === 0) {
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
    void (async () => {
      await refreshTracks();
    })();
  }, [refreshTracks]);

  // ---------------------- Timer da atividade ----------------------

  useEffect(() => {
    if (!sessionVisible) return;
    if (!isPlaying) return;
    if (remainingSeconds <= 0) {
      setIsPlaying(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      setRemainingSeconds(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [sessionVisible, isPlaying, remainingSeconds]);

  // ---------------------- Ações: cards ----------------------

  const handlePrimaryPress = (track: Track) => {
    if (track.status === 'locked') return;

    // Se já concluiu, no futuro você pode mandar pra uma tela de resumo da trilha
    if (track.status === 'completed') {
      router.push({
        pathname: '/trailcomplete',
        params: { trilhaKey: track.id },
      });
      return;
    }

    const trilha = TRILHAS.find(t => t.key === track.id) ?? DEFAULT_TRILHA;
    setSelectedTrack(track);
    setSelectedTrilha(trilha);
    setDetailsVisible(true);
  };

  const handleDetailsPress = (track: Track) => {
    if (track.status === 'locked') return;

    const trilha = TRILHAS.find(t => t.key === track.id) ?? DEFAULT_TRILHA;
    setSelectedTrack(track);
    setSelectedTrilha(trilha);
    setDetailsVisible(true);
  };

  const closeDetailsModal = () => {
    setDetailsVisible(false);
    setSelectedTrack(null);
    setSelectedTrilha(null);
  };

  // 🔵 Caso venha um trailId explícito na rota, abre o modal de detalhes dessa trilha
  useEffect(() => {
    if (!trailIdParam || tracks.length === 0) return;

    const targetTrack = tracks.find(track => track.id === String(trailIdParam));
    if (!targetTrack) return;

    handleDetailsPress(targetTrack);
  }, [trailIdParam, tracks]);

  // ---------------------- Ações: iniciar sessão ----------------------

  const startSessionForTrack = useCallback(async (track: Track) => {
    const trilha = TRILHAS.find(t => t.key === track.id) ?? DEFAULT_TRILHA;

    try {
      const storedDay = await getCurrentDay(trilha.key);
      const safeDay = Math.max(1, Math.min(storedDay, trilha.days.length || 1));
      setCurrentDayState(safeDay);

      const dayIndex = safeDay - 1;
      const minutes = getMinutesFromDay(trilha, dayIndex);
      const safeMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : 5;
      const total = safeMinutes * 60;

      setSessionTrilha(trilha);
      setTotalSeconds(total);
      setRemainingSeconds(total);
      setIsPlaying(true);
      setSessionVisible(true);
    } catch {
      const dayIndex = 0;
      const minutes = getMinutesFromDay(trilha, dayIndex);
      const safeMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : 5;
      const total = safeMinutes * 60;

      setCurrentDayState(1);
      setSessionTrilha(trilha);
      setTotalSeconds(total);
      setRemainingSeconds(total);
      setIsPlaying(true);
      setSessionVisible(true);
    }
  }, []);

  const handleStartFromDetails = () => {
    if (!selectedTrack) return;
    const track = selectedTrack;
    closeDetailsModal();
    void startSessionForTrack(track);
  };

  // 🟣 Caso venha emotion + autoStart pela rota (do chatbot),
  // abre automaticamente a sessão da trilha recomendada
  useEffect(() => {
    if (!emotionParam || !autoStartParam || tracks.length === 0) return;

    const trilhaKey = getTrilhaKeyFromEmotion(emotionParam);
    if (!trilhaKey) return;

    const targetTrack = tracks.find(track => track.id === trilhaKey);
    if (!targetTrack) return;

    void startSessionForTrack(targetTrack);
  }, [emotionParam, autoStartParam, tracks, startSessionForTrack]);

  // ---------------------- Ações: sessão (ActivityModal) ----------------------

  const closeSessionModal = () => {
    setSessionVisible(false);
    setIsPlaying(false);
    setRemainingSeconds(0);
    setTotalSeconds(0);
    setSessionTrilha(null);
  };

  const handleTogglePlayPause = () => {
    if (!sessionVisible) return;
    if (remainingSeconds <= 0) {
      return;
    }
    setIsPlaying(prev => !prev);
  };

  const handleCompleteActivity = async () => {
    if (!sessionTrilha) {
      closeSessionModal();
      return;
    }

    try {
      const day = await advanceDay(sessionTrilha.key);
      setCurrentDayState(day);
      await refreshTracks();
    } catch {
      // erro ao salvar progresso – pode tentar de novo depois
    }

    const completedTrilhaKey = sessionTrilha.key;

    closeSessionModal();

    // 👉 Agora navega para a tela separada de conclusão
    router.push({
      pathname: '/trailcomplete',
      params: { trilhaKey: completedTrilhaKey },
    });
  };

  // ---------------------- Derivados da sessão ----------------------

  const activeTrilha = sessionTrilha ?? DEFAULT_TRILHA;
  const activeDays = activeTrilha.days;
  const currentDayIndex = Math.max(
    0,
    Math.min(currentDay - 1, activeDays.length - 1)
  );
  const currentDayData = activeDays[currentDayIndex] ?? activeDays[0];

  const dayLabel = `Dia ${currentDay}`;
  const activityNumberLabel = `Atividade ${currentDay} de ${activeDays.length}`;
  const activityTitle = currentDayData?.microHabit ?? activeTrilha.name;
  const durationLabel = currentDayData?.durationLabel;

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.bg}
      >
        {/* Conteúdo principal */}
        <ScrollView contentContainerStyle={styles.content}>
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

          {tracks.map(track => (
            <TrackCard
              key={track.id}
              track={track}
              onPrimaryPress={() => handlePrimaryPress(track)}
              onDetailsPress={() => handleDetailsPress(track)}
            />
          ))}
        </ScrollView>

        <Navbar />

        {/* Modal de detalhes da trilha */}
        <TrackDetailsModal
          visible={detailsVisible}
          track={selectedTrack}
          trilha={selectedTrilha}
          onClose={closeDetailsModal}
          onStart={handleStartFromDetails}
        />

        {/* Modal da atividade (sessão) */}
        <ActivityModal
          visible={sessionVisible}
          dayLabel={dayLabel}
          activityNumberLabel={activityNumberLabel}
          activityTitle={activityTitle}
          durationLabel={durationLabel}
          description={currentDayData?.goal}
          tips={currentDayData?.howTo}
          remainingSeconds={remainingSeconds}
          totalSeconds={totalSeconds}
          isPlaying={isPlaying}
          onTogglePlayPause={handleTogglePlayPause}
          onCompletePress={handleCompleteActivity}
          onClose={closeSessionModal}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

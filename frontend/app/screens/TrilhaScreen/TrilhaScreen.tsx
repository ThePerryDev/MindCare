// frontend/app/TrilhaScreen/TrilhaScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
import { useAuth } from '@/hooks/useAuth';
import { registerExercise } from '@/services/trail';
import { api } from '@/services/api';

// ---------------------- Mapeamentos / Constantes ----------------------

// Mapeia cada trilha local (key) para o trailId numérico do backend.
const BACKEND_TRAIL_ID_BY_KEY: Record<string, number> = {
  [trilhaAnsiedadeLeve.key]: 1,
  [trilhaEstresseTrabalho.key]: 2,
  [trilhaMuitoFeliz.key]: 3,
  [trilhaMuitoTriste.key]: 4,
};

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

// ---------------------- Tipos auxiliares ----------------------

type TrailProgressFromApi = {
  trailDbId: string;
  trailId: number;
  code: string;
  nome: string;
  stepsDone: number[]; // dias que ESTE usuário realmente fez (únicos)
  totalExecutions: number; // total de execuções (contando repetições)
  lastStep: number; // maior diaDaTrilha já feito nessa trilha
  totalSteps: number; // normalmente 7
  cyclesCompleted: number; // floor(totalExecutions / totalSteps)
};

// Track estendido com infos do backend
type ExtendedTrack = Track & {
  backendTrailId?: number;
  stepsDone: number[]; // duplicamos por clareza, completedSteps = stepsDone
  lastStep: number; // último dia concluído (maior diaDaTrilha)
  totalExecutions: number;
  cyclesCompleted: number;
};

// ---------------------- Componente principal ----------------------

export default function TrilhaScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const userId = user?._id ?? user?.id ?? null;

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

  // Lista de cards (já com infos de progresso do backend)
  const [tracks, setTracks] = useState<ExtendedTrack[]>([]);

  // Step selecionado por trilha (para borda roxa + qual dia abrir na atividade)
  const [selectedSteps, setSelectedSteps] = useState<Record<string, number>>(
    {}
  );

  // Estado para modal de detalhes da trilha
  const [selectedTrack, setSelectedTrack] = useState<ExtendedTrack | null>(
    null
  );
  const [selectedTrilha, setSelectedTrilha] = useState<TrilhaModel | null>(
    null
  );
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [detailsDay, setDetailsDay] = useState<number | null>(null);

  // Estado da sessão (ActivityModal)
  const [sessionVisible, setSessionVisible] = useState(false);
  const [sessionTrilha, setSessionTrilha] = useState<TrilhaModel | null>(null);
  const [currentDay, setCurrentDayState] = useState(1);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // ---------------------- Carregar progresso do backend ----------------------

  const loadTracksFromBackend = useCallback(async () => {
    if (!userId) {
      setTracks([]);
      return;
    }

    try {
      const response =
        await api.get<TrailProgressFromApi[]>('/trails/progress');
      const progressList = response.data;

      const progressByTrailId = new Map<number, TrailProgressFromApi>();
      for (const p of progressList) {
        progressByTrailId.set(p.trailId, p);
      }

      const newTracks: ExtendedTrack[] = TRILHAS.map(trilha => {
        const backendTrailId = BACKEND_TRAIL_ID_BY_KEY[trilha.key];
        const progress = backendTrailId
          ? progressByTrailId.get(backendTrailId)
          : undefined;

        const totalSteps = trilha.days.length || 1;
        const stepsDone = progress?.stepsDone ?? [];
        const completedCount = stepsDone.length;
        const lastStep = progress?.lastStep ?? 0;
        const totalExecutions = progress?.totalExecutions ?? 0;
        const cyclesCompleted = progress?.cyclesCompleted ?? 0;

        let status: Track['status'];
        if (completedCount === 0) {
          status = 'not_started';
        } else if (completedCount >= totalSteps) {
          status = 'completed';
        } else {
          status = 'in_progress';
        }

        const progressPercent =
          totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

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
          progressPercent,
          totalSteps,
          completedSteps: stepsDone,
          status,
          backgroundColor: getTrackBackgroundColor(status),
          completionCount: cyclesCompleted,

          backendTrailId,
          stepsDone,
          lastStep,
          totalExecutions,
          cyclesCompleted,
        };
      });

      setTracks(newTracks);
    } catch (err) {
      console.error(
        '[TrilhaScreen] erro ao carregar progresso das trilhas',
        err
      );

      // fallback: mostra trilhas "zeradas" caso o backend falhe
      const newTracks: ExtendedTrack[] = TRILHAS.map(trilha => {
        const totalSteps = trilha.days.length || 1;
        let duration = '—';
        if (trilha.minMinutes && trilha.maxMinutes) {
          duration = `${trilha.minMinutes}–${trilha.maxMinutes} min`;
        } else if (trilha.minMinutes && !trilha.maxMinutes) {
          duration = `${trilha.minMinutes} min`;
        }

        const status: Track['status'] = 'not_started';

        return {
          id: trilha.key,
          title: trilha.name,
          level: trilha.level,
          duration,
          progressPercent: 0,
          totalSteps,
          completedSteps: [],
          status,
          backgroundColor: getTrackBackgroundColor(status),
          completionCount: 0,
          backendTrailId: BACKEND_TRAIL_ID_BY_KEY[trilha.key],
          stepsDone: [],
          lastStep: 0,
          totalExecutions: 0,
          cyclesCompleted: 0,
        };
      });

      setTracks(newTracks);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    void loadTracksFromBackend();
  }, [userId, loadTracksFromBackend]);

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

  // Detalhes: sempre respeita o exercício selecionado (bolinha roxa).
  const handleDetailsPress = useCallback(
    (track: ExtendedTrack, stepFromCard?: number) => {
      if (track.status === 'locked') return;

      const trilha = TRILHAS.find(t => t.key === track.id) ?? DEFAULT_TRILHA;
      const totalSteps = trilha.days.length || 1;

      const suggestedFromBackend =
        track.lastStep && track.lastStep < totalSteps ? track.lastStep + 1 : 1;

      const userSelected =
        typeof stepFromCard === 'number'
          ? stepFromCard
          : selectedSteps[track.id];

      const stepForDetails =
        typeof userSelected === 'number' &&
        userSelected >= 1 &&
        userSelected <= totalSteps
          ? userSelected
          : suggestedFromBackend;

      setSelectedTrack(track);
      setSelectedTrilha(trilha);
      setDetailsDay(stepForDetails);
      setDetailsVisible(true);
    },
    [selectedSteps]
  );

  const closeDetailsModal = () => {
    setDetailsVisible(false);
    setSelectedTrack(null);
    setSelectedTrilha(null);
    setDetailsDay(null);
  };

  // Se vier trailId pela rota, abre detalhes dessa trilha
  useEffect(() => {
    if (!trailIdParam || tracks.length === 0) return;

    const targetTrack = tracks.find(track => track.id === String(trailIdParam));
    if (!targetTrack) return;

    handleDetailsPress(targetTrack);
  }, [trailIdParam, tracks, handleDetailsPress]);

  // ---------------------- Ações: iniciar sessão ----------------------
  // Sempre respeita o dia selecionado pelo usuário (bolinha roxa),
  // ou um override explícito (por ex. vindo do modal de detalhes).

  const startSessionForTrack = useCallback(
    (track: ExtendedTrack, dayOverride?: number) => {
      const trilha = TRILHAS.find(t => t.key === track.id) ?? DEFAULT_TRILHA;
      const totalSteps = trilha.days.length || 1;

      const suggestedFromBackend =
        track.lastStep && track.lastStep < totalSteps ? track.lastStep + 1 : 1;

      const userSelectedFromState = selectedSteps[track.id];

      let stepToRun: number;

      if (
        typeof dayOverride === 'number' &&
        dayOverride >= 1 &&
        dayOverride <= totalSteps
      ) {
        stepToRun = dayOverride;
      } else if (
        typeof userSelectedFromState === 'number' &&
        userSelectedFromState >= 1 &&
        userSelectedFromState <= totalSteps
      ) {
        stepToRun = userSelectedFromState;
      } else {
        stepToRun = suggestedFromBackend;

        setSelectedSteps(prev => ({
          ...prev,
          [track.id]: stepToRun,
        }));
      }

      setCurrentDayState(stepToRun);

      const dayIndex = stepToRun - 1;
      const minutes = getMinutesFromDay(trilha, dayIndex);
      const safeMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : 5;
      const total = safeMinutes * 60;

      setSessionTrilha(trilha);
      setTotalSeconds(total);
      setRemainingSeconds(total);
      setIsPlaying(false);
      setSessionVisible(true);
    },
    [selectedSteps]
  );

  // 👉 Botão primário (Começar / Recomeçar)
  const handlePrimaryPress = useCallback(
    (track: ExtendedTrack) => {
      if (track.status === 'locked') return;

      // Se a trilha estiver concluída (100% verde),
      // apenas "reseta" o ciclo visualmente e NÃO abre modal
      if (track.status === 'completed') {
        setTracks(prev =>
          prev.map(t =>
            t.id === track.id
              ? {
                  ...t,
                  status: 'not_started',
                  progressPercent: 0,
                  completedSteps: [],
                  lastStep: 0, // zera o "último dia" pra sugestão voltar pro 1
                }
              : t
          )
        );

        setSelectedSteps(prev => ({
          ...prev,
          [track.id]: 1,
        }));

        return;
      }

      // Qualquer outro status → abre o modal
      startSessionForTrack(track);
    },
    [startSessionForTrack]
  );

  const handleStartFromDetails = () => {
    if (!selectedTrack) return;

    const dayToRun = detailsDay && detailsDay >= 1 ? detailsDay : undefined;

    const track = selectedTrack;
    closeDetailsModal();
    startSessionForTrack(track, dayToRun);
  };

  // Caso venha emotion + autoStart pela rota (do chatbot),
  // abre automaticamente a sessão da trilha recomendada
  useEffect(() => {
    if (!emotionParam || !autoStartParam || tracks.length === 0) return;

    const trilhaKey = getTrilhaKeyFromEmotion(emotionParam);
    if (!trilhaKey) return;

    const targetTrack = tracks.find(track => track.id === trilhaKey);
    if (!targetTrack) return;

    startSessionForTrack(targetTrack);
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
    if (!sessionTrilha || !userId) {
      closeSessionModal();
      return;
    }

    const trilha = sessionTrilha;

    try {
      const backendTrailId = BACKEND_TRAIL_ID_BY_KEY[trilha.key];

      if (backendTrailId) {
        await registerExercise({
          trailId: backendTrailId,
          diaDaTrilha: currentDay,
          origemSentimento: 'trilhas',
        });
      } else {
        console.warn(
          '[TrilhaScreen] Nenhum trailId mapeado para a trilha',
          trilha.key
        );
      }

      await loadTracksFromBackend();
    } catch (err) {
      console.error(
        '[TrilhaScreen] Erro ao registrar exercício ou recarregar progresso:',
        err
      );
    }

    closeSessionModal();

    router.push({
      pathname: '/trailcomplete',
      params: { trilhaKey: trilha.key },
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

  // ---------------------- Render ----------------------

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.bg}
      >
        {/* Header fixo */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons
              name='chevron-left'
              size={24}
              color='#4C46B6'
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Trilhas</Text>

          {/* Placeholder pra balancear igual o PerfilScreen */}
          <View style={styles.headerRight} />
        </View>

        {/* Lista scrollável abaixo do header */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {tracks.map(track => {
            const trilha =
              TRILHAS.find(t => t.key === track.id) ?? DEFAULT_TRILHA;
            const totalSteps = trilha.days.length || 1;

            const suggestedFromBackend =
              track.lastStep && track.lastStep < totalSteps
                ? track.lastStep + 1
                : 1;

            const selectedStep =
              selectedSteps[track.id] ?? suggestedFromBackend;

            return (
              <TrackCard
                key={track.id}
                track={track}
                selectedStep={selectedStep}
                onStepSelect={(step: number) => {
                  setSelectedSteps(prev => ({
                    ...prev,
                    [track.id]: step,
                  }));
                }}
                onPrimaryPress={() => handlePrimaryPress(track)}
                onDetailsPress={() => handleDetailsPress(track, selectedStep)}
              />
            );
          })}
        </ScrollView>

        <Navbar />

        {/* Modal de detalhes da trilha */}
        <TrackDetailsModal
          visible={detailsVisible}
          track={selectedTrack}
          trilha={selectedTrilha}
          selectedDay={detailsDay}
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
          mode={currentDayData?.mode ?? 'timer'}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

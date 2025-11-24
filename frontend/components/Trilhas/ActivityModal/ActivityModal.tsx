import React from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { styles } from './styles';
import ActivityHeader from '../ActivityHeader/ActivityHeader';
import ActivitySteps from '../ActivitySteps/ActivitySteps';
import ActivityStatusTimer from '../ActivityStatusTimer/ActivityStatusTimer';

export interface ActivityModalProps {
  /** Se o modal está visível */
  visible: boolean;

  /** Label do dia, ex: "Dia 1" */
  dayLabel: string;

  /** Ex: "Atividade 1 de 7" (opcional) */
  activityNumberLabel?: string;

  /** Nome da atividade / micro-hábito */
  activityTitle: string;

  /** Ex: "5 min", "7 min" (opcional) */
  durationLabel?: string;

  /** Descrição / objetivo da atividade (goal) */
  description?: string;

  /** Lista de passos (howTo) */
  tips?: string[];

  /** Tempo restante em segundos */
  remainingSeconds: number;

  /** Tempo total da atividade em segundos */
  totalSeconds: number;

  /** Timer está rodando? */
  isPlaying: boolean;

  /** Alternar play/pause */
  onTogglePlayPause: () => void;

  /** Concluir atividade (botão sempre visível) */
  onCompletePress: () => void;

  /** Fechar modal */
  onClose: () => void;

  /** Desabilitar botões (ex: salvando no backend) */
  disabledControls?: boolean;
}

const ActivityModal: React.FC<ActivityModalProps> = ({
  visible,
  dayLabel,
  activityNumberLabel,
  activityTitle,
  durationLabel,
  description,
  tips,
  remainingSeconds,
  totalSeconds,
  isPlaying,
  onTogglePlayPause,
  onCompletePress,
  onClose,
  disabledControls = false,
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType='fade'
      onRequestClose={onClose}
    >
      {/* Fundo escurecido clicável */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Card principal */}
      <View style={styles.sheet}>
        {/* Topo: Dia + CloseButton */}
        <ActivityHeader dayLabel={dayLabel} onClose={onClose} />

        <View style={styles.divider} />

        {/* Conteúdo scrollável (para textos longos) */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Número da atividade da trilha */}
          {activityNumberLabel ? (
            <Text style={styles.activityNumber}>{activityNumberLabel}</Text>
          ) : null}

          {/* Nome da atividade */}
          <Text style={styles.activityTitle}>{activityTitle}</Text>

          {/* Duração da atividade */}
          {durationLabel ? (
            <Text style={styles.durationText}>{durationLabel}</Text>
          ) : null}

          {/* Descrição + passo a passo (ActivitySteps) */}
          <ActivitySteps description={description} tips={tips} />
        </ScrollView>

        {/* Status + Timer + Play/Pause + Concluir */}
        <ActivityStatusTimer
          remainingSeconds={remainingSeconds}
          totalSeconds={totalSeconds}
          isPlaying={isPlaying}
          onTogglePlayPause={onTogglePlayPause}
          onCompletePress={onCompletePress}
          disabled={disabledControls}
        />
      </View>
    </Modal>
  );
};

export default ActivityModal;

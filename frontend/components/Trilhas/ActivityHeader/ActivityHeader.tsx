// frontend/components/Trilhas/ActivityHeader/ActivityHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import CloseButton from '@/components/CloseButton/CloseButton';
import { styles } from './styles';

export interface ActivityHeaderProps {
  /** Label do dia da trilha, ex: "Dia 1" */
  dayLabel: string;
  /** Função chamada ao fechar o modal */
  onClose: () => void;
  /** Opcional: testID para testes automatizados */
  testID?: string;
}

export default function ActivityHeader({
  dayLabel,
  onClose,
  testID,
}: ActivityHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.dayText}>{dayLabel}</Text>

      <CloseButton
        onPress={onClose}
        size={28}
        testID={testID ?? 'activity-header-close'}
      />
    </View>
  );
}

import React from 'react';
import { Modal, View, Text, Pressable, ActivityIndicator } from 'react-native';
import CloseDeleteButton from '../CloseDeleteButton/CloseDeleteButton';
import { styles } from './styles';

export interface ConfirmDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}

export default function ConfirmDeleteModal({
  visible,
  onClose,
  onConfirm,
  loading = false,
}: ConfirmDeleteModalProps) {
  // Handlers que sempre são funções (evitam undefined na prop onPress)
  const handleBackdropPress = () => {
    if (!loading) onClose();
  };

  const handleHeaderClose = () => {
    if (!loading) onClose();
  };

  const handleConfirm = () => {
    if (!loading) onConfirm();
  };

  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Backdrop clicável */}
      <Pressable style={styles.backdrop} onPress={handleBackdropPress} />

      {/* Card */}
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Atenção !</Text>
          <CloseDeleteButton onPress={handleHeaderClose} size={28} />
        </View>

        {/* Mensagem */}
        <Text style={styles.message}>
          Ao clicar no botão abaixo, todos os seus dados serão permanentemente
          excluídos do sistema.
        </Text>

        {/* Botão vermelho de excluir */}
        <Pressable
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.dangerButton, loading && { opacity: 0.6 }]}
          onPress={handleConfirm}
          disabled={loading}
          accessibilityRole='button'
          accessibilityLabel='Excluir Conta'
        >
          {loading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text style={styles.dangerText}>Excluir Conta</Text>
          )}
        </Pressable>
      </View>
    </Modal>
  );
}

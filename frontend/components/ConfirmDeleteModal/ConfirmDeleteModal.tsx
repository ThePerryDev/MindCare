import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import CloseDeleteButton from '../CloseDeleteButton/CloseDeleteButton';
import { styles } from './styles';

export interface ConfirmDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void; // ação de exclusão (placeholder por enquanto)
}

export default function ConfirmDeleteModal({
  visible,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Backdrop clicável */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Card */}
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Atenção !</Text>
          {/* por enquanto usando o CloseButton padrão */}
          <CloseDeleteButton onPress={onClose} size={28} />
        </View>

        {/* Mensagem */}
        <Text style={styles.message}>
          Ao clicar no botão abaixo, todos os seus dados serão permanentemente
          excluídos do sistema.
        </Text>

        {/* Botão vermelho de excluir */}
        <Pressable
          style={styles.dangerButton}
          onPress={onConfirm}
          accessibilityRole='button'
          accessibilityLabel='Excluir Conta'
        >
          <Text style={styles.dangerText}>Excluir Conta</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

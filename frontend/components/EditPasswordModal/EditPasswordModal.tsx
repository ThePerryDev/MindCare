import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import PasswordInput from '@/components/PasswordInput/PasswordInput';
import Button from '@/components/Button/Button';
import CloseButton from '@/components/CloseButton/CloseButton';
import { styles } from './styles';

export interface EditPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void; // apenas UI/UX (placeholder)
}

export default function EditPasswordModal({
  visible,
  onClose,
  onSubmit,
}: EditPasswordModalProps) {
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');

  useEffect(() => {
    if (visible) {
      setPwd('');
      setConfirm('');
    }
  }, [visible]);

  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Sheet */}
      <View style={styles.sheet}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Senha</Text>
          <CloseButton onPress={onClose} size={28} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <PasswordInput
            label='Senha'
            value={pwd}
            onChangeText={setPwd}
            placeholder='Digite a nova senha'
          />
          <PasswordInput
            label='Confirmar Senha'
            value={confirm}
            onChangeText={setConfirm}
            placeholder='Confirme a nova senha'
          />
          <Button onPress={() => onSubmit(pwd)}>
            <Text>Atualizar</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

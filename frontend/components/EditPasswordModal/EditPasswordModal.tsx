import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import PasswordInput from '@/components/PasswordInput/PasswordInput';
import Button from '@/components/Button/Button';
import { styles } from './styles';
import { theme } from '@/styles/theme';

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

  const canSubmit = useMemo(
    () => pwd.length > 0 && confirm.length > 0 && pwd === confirm,
    [pwd, confirm]
  );

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
          <Pressable
            style={styles.close}
            onPress={onClose}
            hitSlop={8}
            accessibilityLabel='Fechar'
          >
            <Feather name='x' size={20} color={theme.colors.primary} />
          </Pressable>
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
          <Button onPress={() => onSubmit(pwd)}>Atualizar</Button>

          {!canSubmit && (
            <Text style={styles.hint}>
              As senhas devem ser iguais para atualizar.
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

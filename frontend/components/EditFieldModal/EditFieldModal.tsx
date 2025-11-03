import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import CloseButton from '@/components/CloseButton/CloseButton';
import { styles } from './styles';

type KeyboardType =
  | 'default'
  | 'email-address'
  | 'numeric'
  | 'decimal-pad'
  | 'number-pad'
  | 'phone-pad';

export interface EditFieldModalProps {
  visible: boolean;
  title: string; // ex.: "Nome de Usuário"
  label: string; // ex.: "Nome de Usuário"
  placeholder?: string;
  value?: string;
  keyboardType?: KeyboardType;
  onClose: () => void;
  onSubmit: (nextValue: string) => void; // apenas UI/UX (placeholder)
}

export default function EditFieldModal({
  visible,
  title,
  label,
  placeholder,
  value = '',
  keyboardType = 'default',
  onClose,
  onSubmit,
}: EditFieldModalProps) {
  const [text, setText] = useState(value);

  useEffect(() => {
    if (visible) setText(value);
  }, [visible, value]);

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
        {/* Header com título centralizado e CloseButton à direita */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>{title}</Text>
          <CloseButton onPress={onClose} size={28} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label={label}
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            keyboardType={keyboardType}
          />
          <Button onPress={() => onSubmit(text)}>
            <Text>Atualizar</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

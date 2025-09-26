import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { styles } from './styles';

interface InputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  ...rest
}: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
    </View>
  );
}

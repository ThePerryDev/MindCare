import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';

interface PasswordInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function PasswordInput({
  label,
  value,
  onChangeText,
  placeholder,
  ...rest
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          {...rest}
        />

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setShowPassword(prev => !prev)}
          accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          <Feather
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color='#9CA3AF'
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

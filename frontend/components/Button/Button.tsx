import React from 'react';
import { Text, Pressable, GestureResponderEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

export default function Button({
  children,
  onPress,
  disabled = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[styles.disabled, pressable && styles.disabled]}
      disabled={disabled}
    >
      <LinearGradient
        colors={['#4776E6', '#8E54E9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.text}>{children}</Text>
      </LinearGradient>
    </Pressable>
  );
}

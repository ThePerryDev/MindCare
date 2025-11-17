import React from 'react';
import { Pressable, GestureResponderEvent } from 'react-native';
import { styles } from './styles';
import { Feather } from '@expo/vector-icons';

interface CloseButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  size?: number;
  testID?: string;
}

export default function CloseDeleteButton({
  onPress,
  size = 25,
  testID,
}: CloseButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      accessibilityRole='button'
      accessibilityLabel='Fechar'
      hitSlop={8}
      testID={testID}
    >
      <Feather name='x' size={size * 0.7} color='#D63C3C' />
    </Pressable>
  );
}

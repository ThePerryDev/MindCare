import React from 'react';
import { Text, Pressable, GestureResponderEvent } from 'react-native';
import { styles } from './styles';

interface Return_ButtonProps {
  children: string;
  onPress: (event: GestureResponderEvent) => void;
}

export default function Button({ children, onPress }: Return_ButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

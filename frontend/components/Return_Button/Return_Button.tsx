import React from 'react';
import { Text, Pressable, GestureResponderEvent } from 'react-native';
import { styles } from './styles';

interface Return_ButtonProps {
  children: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
}

export default function ReturnButton({
  children,
  onPress,
}: Return_ButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

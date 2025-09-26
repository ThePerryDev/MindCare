import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { styles } from './styles';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export default function Card({ children, style }: CardProps) {
  return <View style={[styles.shadow, style]}>{children}</View>;
}

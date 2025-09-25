import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { styles } from './styles';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export default function Card({ children, style }: CardProps) {
  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F9FA']}
      style={[styles.gradient, style]}
    >
      <View style={styles.shadow}>
        {children}
      </View>
    </LinearGradient>
  );
}

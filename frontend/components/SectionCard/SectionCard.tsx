// frontend/components/SectionCard/SectionCard.tsx

import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { styles, getTone } from './styles';

interface SectionCardProps extends ViewProps {
  title: string;
  tone?: 'default' | 'danger';
  children: React.ReactNode;
}

export default function SectionCard({
  title,
  children,
  tone = 'default',
  style,
  ...rest
}: SectionCardProps) {
  const t = getTone(tone);
  return (
    <View style={[styles.container, t.container, style]} {...rest}>
      <Text style={[styles.title, t.title]}>{title}</Text>
      <View style={styles.divider} />
      <View style={styles.body}>{children}</View>
    </View>
  );
}

// frontend/components/RowItem/RowItem.tsx

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { styles, variants } from './styles';

type RowVariant = 'edit' | 'link' | 'danger';

interface RowItemProps {
  label: string;
  value?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  variant?: RowVariant;
  muted?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

export default function RowItem({
  label,
  value,
  icon,
  variant = 'edit',
  muted = false,
  disabled = false,
  onPress,
}: RowItemProps) {
  const v = variants[variant];
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={[styles.row, disabled && { opacity: 0.7 }]}>
      <View style={styles.left}>
        <Text style={styles.label}>{label}</Text>
        {!!value && (
          <Text
            style={[styles.value, muted && styles.valueMuted]}
            numberOfLines={1}
          >
            {value}
          </Text>
        )}
      </View>

      {icon && (
        <Pressable
          onPress={!disabled ? onPress : undefined}
          style={[styles.iconBtn, v.btn]}
        >
          <MaterialCommunityIcons name={icon} size={25} color={v.iconColor} />
        </Pressable>
      )}
    </View>
  );
}

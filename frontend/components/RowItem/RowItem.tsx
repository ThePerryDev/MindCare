import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles, variants } from './styles';

type RowVariant = 'edit' | 'link' | 'danger';

interface RowItemProps {
  label: string;
  value?: string;
  icon?: keyof typeof Feather.glyphMap;
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
          <Feather name={icon} size={18} color={v.iconColor} />
        </Pressable>
      )}
    </View>
  );
}

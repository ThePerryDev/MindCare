import React from 'react';
import { Pressable, View, AccessibilityRole } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';

export interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export default function Checkbox({
  checked,
  onToggle,
  size = 22,
  disabled = false,
  accessibilityLabel = 'Marcar opção',
}: CheckboxProps) {
  const a11yRole: AccessibilityRole = 'checkbox';

  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      accessibilityRole={a11yRole}
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.pressable,
        pressed && !disabled && styles.pressed,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      hitSlop={10}
    >
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          checked ? styles.circleChecked : styles.circleUnchecked,
        ]}
      >
        {checked && (
          <MaterialCommunityIcons
            name='check'
            size={Math.max(14, Math.floor(size * 0.7))}
            color='#FFFFFF'
          />
        )}
      </View>
    </Pressable>
  );
}

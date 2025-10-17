import React from 'react';
import { Pressable, Text, View, GestureResponderEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Checkbox from '../Checkbox/Checkbox';
import { styles } from './styles';

export interface ConsentCardProps {
  checked: boolean;
  onToggle: (e?: GestureResponderEvent) => void;
  // Texto:
  prefix?: string; // ex: "Concordo com os "
  link1Label?: string; // ex: "Termos de Uso"
  onPressLink1?: () => void;
  middle?: string; // ex: " e "
  link2Label?: string; // ex: "Política de Privacidade"
  onPressLink2?: () => void;
  suffix?: string; // ex: " do MindCare."
  // Visual:
  gradientColors?: [string, string];
  disabled?: boolean;
}

export default function ConsentCard({
  checked,
  onToggle,
  prefix = '',
  link1Label,
  onPressLink1,
  middle = '',
  link2Label,
  onPressLink2,
  suffix = '',
  gradientColors = ['#6C63FF', '#A393FF'],
  disabled = false,
}: ConsentCardProps) {
  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      hitSlop={4}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.row}>
          <Checkbox checked={checked} onToggle={onToggle} />

          <Text style={styles.text} numberOfLines={3}>
            {prefix ? <Text style={styles.text}>{prefix}</Text> : null}

            {link1Label ? (
              <Text style={styles.link} onPress={onPressLink1}>
                {link1Label}
              </Text>
            ) : null}

            {middle ? <Text style={styles.text}>{middle}</Text> : null}

            {link2Label ? (
              <Text style={styles.link} onPress={onPressLink2}>
                {link2Label}
              </Text>
            ) : null}

            {suffix ? <Text style={styles.text}>{suffix}</Text> : null}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

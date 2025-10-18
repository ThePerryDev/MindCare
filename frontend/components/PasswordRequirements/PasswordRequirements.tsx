import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

type RequirementItem = {
  key: string;
  label: string;
  passed: boolean;
};

interface PasswordRequirementsProps {
  password: string;
}

function checkRequirements(password: string): RequirementItem[] {
  const hasMinLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  return [
    { key: 'len', label: 'Pelo menos 8 caracteres.', passed: hasMinLen },
    { key: 'upper', label: 'Uma letra maiúscula.', passed: hasUpper },
    { key: 'lower', label: 'Uma letra minúscula.', passed: hasLower },
    { key: 'num', label: 'Pelo menos um número.', passed: hasNumber },
    {
      key: 'spec',
      label: 'Pelo menos um caracter especial.',
      passed: hasSpecial,
    },
  ];
}

function GradientIcon({ type }: { type: 'check' | 'x' }) {
  return (
    <LinearGradient
      colors={['#4776E6', '#8E54E9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.iconGradient}
    >
      <View style={styles.glyphWrap}>
        <Text style={styles.iconGlyph} allowFontScaling={false}>
          {type === 'check' ? '✓' : '✕'}
        </Text>
      </View>
    </LinearGradient>
  );
}

function PlaceholderIcon() {
  return (
    <View style={styles.iconPlaceholder}>
      <Text style={styles.placeholderGlyph} allowFontScaling={false}>
        --
      </Text>
    </View>
  );
}

function PasswordRequirementsComponent({
  password,
}: PasswordRequirementsProps) {
  const started = password.length > 0;
  const items = checkRequirements(password);

  return (
    <View style={styles.container}>
      {items.map(item => (
        <View key={item.key} style={styles.row}>
          {started ? (
            <GradientIcon type={item.passed ? 'check' : 'x'} />
          ) : (
            <PlaceholderIcon />
          )}
          <Text style={[styles.text, started && styles.textStarted]}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default memo(PasswordRequirementsComponent);

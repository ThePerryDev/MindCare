// frontend/app/screens/CheckOutMoodScreen/CheckOutMoodScreen.tsx

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import { styles } from './styles';
import Card from '@/components/Card/Card';
import { theme } from '@/styles/theme';
import Navbar from '@/components/Navbar/Navbar';
import {
  MoodLabel,
  IFeelingSaidaPayload,
} from '@/interfaces/feeling.interface';
import { registrarSentimentoSaida } from '@/services/feeling';

type Mood = {
  emoji: string;
  label: MoodLabel;
};

const MOODS: Mood[] = [
  { emoji: '😐', label: 'Ansiedade' },
  { emoji: '😡', label: 'Estresse' },
  { emoji: '😄', label: 'Felicidade' },
  { emoji: '😭', label: 'Tristeza' },
];

export default function CheckOutMoodScreen() {
  const [selected, setSelected] = useState<Mood | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // guarda o timeout pendente pra poder cancelar
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // se a tela desmontar, cancela o envio pendente
    return () => {
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
      }
    };
  }, []);

  const handleSelect = (mood: Mood) => {
    Haptics.selectionAsync();
    setSelected(mood);

    // cancela qualquer timer antigo
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
    }

    const today = dayjs().format('YYYY-MM-DD');

    console.log('🟣 [CheckOutMoodScreen] Humor de saída selecionado:', {
      label: mood.label,
      day: today,
    });

    setSubmitting(true);

    pendingTimeoutRef.current = setTimeout(async () => {
      try {
        const payload: IFeelingSaidaPayload = {
          day: today,
          sentimento_de_saida: mood.label,
        };

        console.log(
          '🟣 [CheckOutMoodScreen] Enviando sentimento de saída para o backend...',
          payload
        );

        await registrarSentimentoSaida(payload);

        console.log(
          '🟢 [CheckOutMoodScreen] Sentimento de saída enviado com sucesso.'
        );

        // após registrar o sentimento de saída, volta pra Home
        router.replace('/home');
      } catch (err) {
        console.error(
          '🔴 [CheckOutMoodScreen] Erro ao registrar sentimento de saída:',
          err
        );
      } finally {
        setSubmitting(false);
        pendingTimeoutRef.current = null;
      }
    }, 5000);
  };

  const feelingText = selected
    ? `Você está saindo se sentindo ${selected.label.replace('Muito ', '')}!`
    : '';

  return (
    <View style={localStyles.root}>
      <LinearGradient
        pointerEvents='none'
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace('/home')}
            accessibilityLabel='Voltar para Home'
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Como você está saindo hoje?</Text>
          <View style={localStyles.headerSpacer} />
        </View>

        <View style={styles.list}>
          {MOODS.map(mood => {
            const isSelected = selected?.label === mood.label;

            if (isSelected) {
              return (
                <View key={mood.label} style={styles.selectedShadowWrapper}>
                  <View style={styles.selectedGradient}>
                    <TouchableOpacity
                      onPress={() => handleSelect(mood)}
                      activeOpacity={0.85}
                      style={styles.moodInner}
                      disabled={submitting}
                    >
                      <Text style={styles.selectedEmoji}>{mood.emoji}</Text>
                      <Text style={styles.selectedLabel}>{mood.label}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }

            return (
              <View key={mood.label}>
                <Card style={styles.cardBase}>
                  <TouchableOpacity
                    onPress={() => handleSelect(mood)}
                    activeOpacity={0.85}
                    style={styles.moodInner}
                    disabled={submitting}
                  >
                    <Text style={styles.emoji}>{mood.emoji}</Text>
                    <Text style={styles.label}>{mood.label}</Text>
                  </TouchableOpacity>
                </Card>
              </View>
            );
          })}
        </View>

        {selected && (
          <Text style={styles.feedbackText}>
            {submitting
              ? `${feelingText} (confirmando em instantes...)`
              : feelingText}
          </Text>
        )}

        <Navbar />
      </SafeAreaView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  headerSpacer: { width: 24 },
  root: { flex: 1 },
});

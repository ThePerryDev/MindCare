import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

import { styles } from './styles';
import Card from '@/components/Card/Card';
import { theme } from '@/styles/theme';

type Mood = {
  emoji: string;
  label: 'Muito Feliz' | 'Irritado' | 'Neutro' | 'Triste' | 'Muito Triste';
};

const MOODS: Mood[] = [
  { emoji: '😄', label: 'Muito Feliz' },
  { emoji: '😡', label: 'Irritado' },
  { emoji: '😐', label: 'Neutro' },
  { emoji: '😔', label: 'Triste' },
  { emoji: '😭', label: 'Muito Triste' },
];

const STORAGE_KEYS = {
  SELECTED_MOOD: '@mood/selected',
  LAST_LOG_DATE: '@mood/lastLogDate',
};

export default function MoodScreen({ navigation }: any) {
  const [selected, setSelected] = useState<Mood | null>(null);
  const today = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

  useEffect(() => {
    (async () => {
      try {
        const moodJSON = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_MOOD);
        if (moodJSON) setSelected(JSON.parse(moodJSON));
      } catch {}
    })();
  }, []);

  const handleSelect = async (mood: Mood) => {
    setSelected(mood);
    Haptics.selectionAsync();
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_MOOD, JSON.stringify(mood));
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOG_DATE, today);
    } catch {}
  };

  const feelingText = selected
    ? `Você está se sentindo ${selected.label.replace('Muito ', '')} !`
    : '';

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        pointerEvents="none"
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack?.()}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Como está se sentindo hoje?</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.list}>
          {MOODS.map((mood) => {
            const isSelected = selected?.label === mood.label;

            if (isSelected) {
              return (
                <View key={mood.label} style={styles.selectedShadowWrapper}>
                  <View style={styles.selectedGradient}>
                    <TouchableOpacity
                      onPress={() => handleSelect(mood)}
                      activeOpacity={0.85}
                      style={styles.moodInner}
                    >
                      <Text style={styles.selectedEmoji}>{mood.emoji}</Text>
                      <Text style={styles.selectedLabel}>{mood.label}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }

            return (
              <Card key={mood.label} style={styles.cardBase}>
                <TouchableOpacity
                  onPress={() => handleSelect(mood)}
                  activeOpacity={0.85}
                  style={styles.moodInner}
                >
                  <Text style={styles.emoji}>{mood.emoji}</Text>
                  <Text style={styles.label}>{mood.label}</Text>
                </TouchableOpacity>
              </Card>
            );
          })}
        </View>

        {selected && <Text style={styles.feedbackText}>{feelingText}</Text>}
      </SafeAreaView>
    </View>
  );
}

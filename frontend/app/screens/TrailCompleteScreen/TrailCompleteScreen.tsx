// frontend/app/TrailCompleteScreen/TrailCompleteScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from './styles';
import { theme } from '@/styles/theme';
import Navbar from '@/components/Navbar/Navbar';
import Platypus from '../../../assets/images/Platypus.png';
import type { TrilhaModel } from '@/components/Trilhas/types';
import {
  trilhaAnsiedadeLeve,
  trilhaEstresseTrabalho,
  trilhaMuitoFeliz,
  trilhaMuitoTriste,
} from '@/components/Trilhas/models';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_PREFIX = '@mindcare/trilha-progress/';

const TRILHAS: TrilhaModel[] = [
  trilhaAnsiedadeLeve,
  trilhaEstresseTrabalho,
  trilhaMuitoFeliz,
  trilhaMuitoTriste,
];

async function getCurrentDay(trackKey: string): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_PREFIX + trackKey);
    const n = Number(raw);
    return Number.isFinite(n) && n >= 1 && n <= 8 ? n : 1;
  } catch {
    return 1;
  }
}

export default function TrailCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ trilhaKey?: string | string[] }>();

  const trilhaKey = Array.isArray(params.trilhaKey)
    ? params.trilhaKey[0]
    : params.trilhaKey;

  const trilha = TRILHAS.find(t => t.key === trilhaKey) ?? null;

  const [completedDay, setCompletedDay] = useState<number | null>(null);

  useEffect(() => {
    if (!trilhaKey) return;
    void (async () => {
      const currentDay = await getCurrentDay(trilhaKey);
      // dia completado é o anterior ao dia atual salvo
      const done = Math.max(1, currentDay - 1);
      setCompletedDay(done);
    })();
  }, [trilhaKey]);

  const subtitle = trilha
    ? completedDay
      ? `Você completou a atividade ${completedDay} da trilha ${trilha.name}.`
      : `Você completou mais uma atividade na trilha ${trilha.name}.`
    : 'Você completou uma atividade com sucesso!';

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Parabéns!</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <Image source={Platypus} style={styles.image} />

          <TouchableOpacity
            style={styles.buttonPrimary}
            activeOpacity={0.9}
            onPress={() => router.replace('/trails')}
          >
            <Text style={styles.buttonPrimaryText}>Voltar para as trilhas</Text>
          </TouchableOpacity>
        </View>

        <Navbar />
      </LinearGradient>
    </SafeAreaView>
  );
}

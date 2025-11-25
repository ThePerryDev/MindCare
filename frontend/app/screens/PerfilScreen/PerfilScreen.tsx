// frontend/app/screens/PerfilScreen/PerfilScreen.tsx

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import dayjs from 'dayjs';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';

import { styles } from './styles';
import Navbar from '@/components/Navbar/Navbar';
import WeeklyResults from '@/components/WeeklyResults/WeeklyResults';

import {
  FEELINGS_SCALE,
  feelingToValue,
  FeelingLabel,
} from '@/constants/feelingsScale';
import { listarFeelings, FeelingDTO } from '@/services/feelingHistory';

const screenWidth = Dimensions.get('window').width;

export default function PerfilScreen() {
  const router = useRouter();

  const [feelings, setFeelings] = useState<FeelingDTO[]>([]);
  const [loadingFeelings, setLoadingFeelings] = useState(false);

  // Agora só mantemos em state:
  // - Dias consecutivos / total de check-ins
  // - Atividades por categoria (placeholder)
  const [profileData, setProfileData] = useState({
    consecutiveDays: {
      bestStreak: 0,
      totalCheckins: 0,
    },
    activitiesByCategory: [
      { month: 'Jan', mindfulness: 5, stress: 6, gratitude: 7 },
      { month: 'Fev', mindfulness: 6, stress: 5, gratitude: 8 },
      { month: 'Mar', mindfulness: 4, stress: 7, gratitude: 6 },
      { month: 'Abr', mindfulness: 7, stress: 8, gratitude: 9 },
      { month: 'Mai', mindfulness: 10, stress: 7, gratitude: 8 },
      { month: 'Jun', mindfulness: 8, stress: 9, gratitude: 10 },
    ],
  });

  // Carrega feelings dos últimos 7 dias ao montar a tela
  useEffect(() => {
    const fetchFeelings = async () => {
      try {
        setLoadingFeelings(true);

        const today = dayjs();
        const inicio = today.subtract(6, 'day').format('YYYY-MM-DD');
        const fim = today.format('YYYY-MM-DD');

        const data = await listarFeelings({ inicio, fim });

        // ordena do mais antigo para o mais novo
        const ordered = [...data].sort((a, b) => a.day.localeCompare(b.day));
        setFeelings(ordered);

        // Atualiza apenas os indicadores de dias consecutivos / check-ins
        if (ordered.length > 0) {
          const activeDays = ordered.length;
          const totalCheckins = ordered.length;

          setProfileData(prev => ({
            ...prev,
            consecutiveDays: {
              ...prev.consecutiveDays,
              bestStreak: activeDays, // simplificado: pode ser refinado depois
              totalCheckins,
            },
          }));
        }
      } catch (err) {
        console.error('🔴 [PerfilScreen] Erro ao carregar feelings:', err);
      } finally {
        setLoadingFeelings(false);
      }
    };

    void fetchFeelings();
  }, []);

  // Gráfico com duas séries: entrada x saída
  const moodChartData = useMemo(() => {
    if (!feelings.length) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const labels = feelings.map(f => dayjs(f.day).format('DD/MM'));

    const dataEntrada = feelings.map(
      f => feelingToValue[f.sentimento_de_entrada as FeelingLabel] ?? 0
    );

    const dataSaida = feelings.map(
      f => feelingToValue[f.sentimento_de_saida as FeelingLabel] ?? 0
    );

    return {
      labels,
      datasets: [
        {
          data: dataEntrada,
          strokeWidth: 2,
          // roxo principal
          color: (opacity = 1) => `rgba(76, 70, 182, ${opacity})`,
        },
        {
          data: dataSaida,
          strokeWidth: 2,
          // ciano para diferenciar saída
          color: (opacity = 1) => `rgba(56, 189, 248, ${opacity})`,
        },
      ],
    };
  }, [feelings]);

  return (
    <LinearGradient
      colors={['#F4EFFF', '#D6F0F0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name='chevron-back' size={24} color='#4C46B6' />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Card Dias Consecutivos */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dias Consecutivos</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Melhor Sequência</Text>
                <Text style={styles.statValue}>
                  {profileData.consecutiveDays.bestStreak
                    .toString()
                    .padStart(2, '0')}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total de check-ins</Text>
                <Text style={styles.statValue}>
                  {profileData.consecutiveDays.totalCheckins}
                </Text>
              </View>
            </View>
          </View>

          {/* ✅ Usa o mesmo componente de Resultado Semanal da Home */}
          <WeeklyResults />

          {/* Card Evolução do Humor */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Evolução do Humor</Text>
              <TouchableOpacity>
                <Ionicons
                  name='information-circle-outline'
                  size={20}
                  color='#94A3B8'
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardSubtitle}>Últimos 7 dias</Text>

            <View style={styles.chartContainer}>
              {loadingFeelings ? (
                <ActivityIndicator color='#4C46B6' />
              ) : feelings.length === 0 ? (
                <Text style={styles.cardSubtitle}>
                  Ainda não há registros de humor suficientes.
                </Text>
              ) : (
                <LineChart
                  data={moodChartData}
                  width={screenWidth - 72}
                  height={220}
                  fromZero
                  yAxisInterval={1}
                  chartConfig={{
                    backgroundColor: '#FFFFFF',
                    backgroundGradientFrom: '#FFFFFF',
                    backgroundGradientTo: '#FFFFFF',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(76, 70, 182, ${opacity})`,
                    labelColor: () => '#94A3B8',
                    style: { borderRadius: 16 },
                    propsForDots: { r: '5', strokeWidth: '2' },
                  }}
                  style={styles.chart}
                  withInnerLines
                  withOuterLines={false}
                  withVerticalLines={false}
                  withHorizontalLines
                  withDots
                  withShadow={false}
                  formatYLabel={value => {
                    const v = Math.round(Number(value));
                    const feeling = FEELINGS_SCALE.find(f => f.value === v);
                    return feeling ? feeling.emoji : '';
                  }}
                />
              )}
            </View>

            {/* Legenda: Entrada x Saída */}
            {feelings.length > 0 && (
              <View style={styles.legend}>
                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, styles.legendDotRed]} />
                    <Text style={styles.legendText}>Sentimento de entrada</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, styles.legendDotCyan]} />
                    <Text style={styles.legendText}>Sentimento de saída</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Legenda baseada no FEELINGS_SCALE */}
            <View style={styles.legend}>
              {FEELINGS_SCALE.map(item => (
                <View key={item.label} style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <Text style={styles.legendText}>
                      {item.emoji} {item.label}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Card Atividades por Categoria (mantido como estava) */}
          <View style={[styles.card, styles.cardBottomSpace]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Atividades por Categoria</Text>
              <TouchableOpacity>
                <Ionicons
                  name='information-circle-outline'
                  size={20}
                  color='#94A3B8'
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.cardSubtitle}>Últimos 6 meses</Text>

            <View style={styles.barChartContainer}>
              {profileData.activitiesByCategory.map((item, index) => (
                <View key={index} style={styles.barGroup}>
                  <View style={styles.barsWrapper}>
                    <View
                      style={[
                        styles.bar,
                        styles.barMindfulness,
                        { height: item.mindfulness * 8 },
                      ]}
                    />
                    <View
                      style={[
                        styles.bar,
                        styles.barStress,
                        { height: item.stress * 8 },
                      ]}
                    />
                    <View
                      style={[
                        styles.bar,
                        styles.barGratitude,
                        { height: item.gratitude * 8 },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.month}</Text>
                </View>
              ))}
            </View>

            <View style={styles.legend}>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotRed]} />
                  <Text style={styles.legendText}>Mindfulness</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotGreen]} />
                  <Text style={styles.legendText}>Alívio Estresse</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotCyan]} />
                  <Text style={styles.legendText}>Gratidão</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <Navbar />
      </SafeAreaView>
    </LinearGradient>
  );
}

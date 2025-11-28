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
import { getTrailStats } from '../../../services/trailStats';
import { ITrailStatsByMesTrilha } from '@/interfaces/trail.interface';

const screenWidth = Dimensions.get('window').width;

export type TrailYearStat = {
  month: string; // "Jan", "Fev", ...
  trilha1: number; // Trilha 1 – Ansiedade Leve
  trilha2: number; // Trilha 2 – Estresse Trabalho/Estudo
  trilha3: number; // Trilha 3 – Muito Feliz
  trilha4: number; // Trilha 4 – Muito Triste
};

const MONTH_LABELS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export default function PerfilScreen() {
  const router = useRouter();

  const [feelings, setFeelings] = useState<FeelingDTO[]>([]);
  const [loadingFeelings, setLoadingFeelings] = useState(false);

  const [consecutiveDays, setConsecutiveDays] = useState({
    bestStreak: 0,
    totalCheckins: 0,
  });

  // 🔹 Dados do gráfico de trilhas no ano
  const [yearTrailStats, setYearTrailStats] = useState<TrailYearStat[]>([]);
  const [loadingYearStats, setLoadingYearStats] = useState(false);

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

        // Atualiza indicadores de dias consecutivos / check-ins (simples)
        if (ordered.length > 0) {
          const activeDays = ordered.length;
          const totalCheckins = ordered.length;

          setConsecutiveDays({
            bestStreak: activeDays, // simplificado
            totalCheckins,
          });
        }
      } catch (err) {
        console.error('🔴 [PerfilScreen] Erro ao carregar feelings:', err);
      } finally {
        setLoadingFeelings(false);
      }
    };

    void fetchFeelings();
  }, []);

  // 🔹 Carrega stats de trilhas do ANO (para o gráfico de barras)
  useEffect(() => {
    const fetchYearStats = async () => {
      try {
        setLoadingYearStats(true);

        const stats = await getTrailStats('year');
        const raw = (stats.porMesTrilha ?? []) as ITrailStatsByMesTrilha[];

        // Começa com 12 meses zerados
        const base: TrailYearStat[] = MONTH_LABELS.map(label => ({
          month: label,
          trilha1: 0,
          trilha2: 0,
          trilha3: 0,
          trilha4: 0,
        }));

        for (const item of raw) {
          if (!item.month) continue;
          const monthIndex = parseInt(item.month, 10) - 1; // '01' -> 0
          if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
            continue;
          }

          const bucket = base[monthIndex];
          const count = item.totalExercicios ?? 0;

          switch (item.trailId) {
            case 1:
              bucket.trilha1 += count;
              break;
            case 2:
              bucket.trilha2 += count;
              break;
            case 3:
              bucket.trilha3 += count;
              break;
            case 4:
              bucket.trilha4 += count;
              break;
            default:
              // se tiver outras trilhas no futuro, pode tratar aqui
              break;
          }
        }

        setYearTrailStats(base);
      } catch (err) {
        console.error('🔴 [PerfilScreen] Erro ao carregar stats do ano:', err);
      } finally {
        setLoadingYearStats(false);
      }
    };

    void fetchYearStats();
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

  // Fator para altura das barras (multiplica o número de atividades)
  const barHeightFactor = 6;

  // Tem pelo menos alguma atividade no ano?
  const hasAnyYearActivity = yearTrailStats.some(
    m => m.trilha1 || m.trilha2 || m.trilha3 || m.trilha4
  );

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
            <View className='statsRow' style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Melhor Sequência</Text>
                <Text style={styles.statValue}>
                  {consecutiveDays.bestStreak.toString().padStart(2, '0')}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total de check-ins</Text>
                <Text style={styles.statValue}>
                  {consecutiveDays.totalCheckins}
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

          {/* Card Atividades de Trilhas no Ano */}
          <View style={[styles.card, styles.cardBottomSpace]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Atividades por trilha no ano</Text>
              <TouchableOpacity>
                <Ionicons
                  name='information-circle-outline'
                  size={20}
                  color='#94A3B8'
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.cardSubtitle}>
              Total de atividades por mês · Arraste para ver todos os meses
            </Text>

            <View style={styles.barChartOuter}>
              {loadingYearStats ? (
                <ActivityIndicator color='#4C46B6' />
              ) : !hasAnyYearActivity ? (
                <Text style={styles.cardSubtitle}>
                  Ainda não há atividades registradas neste ano.
                </Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.barChartScrollContent}
                >
                  {yearTrailStats.map(item => (
                    <View key={item.month} style={styles.barGroup}>
                      <View style={styles.barsWrapper}>
                        {/* Trilha 1 – Ansiedade Leve */}
                        <View
                          style={[
                            styles.bar,
                            styles.barMindfulness,
                            {
                              height: item.trilha1 * barHeightFactor,
                            },
                          ]}
                        />
                        {/* Trilha 2 – Estresse */}
                        <View
                          style={[
                            styles.bar,
                            styles.barStress,
                            {
                              height: item.trilha2 * barHeightFactor,
                            },
                          ]}
                        />
                        {/* Trilha 3 – Muito Feliz */}
                        <View
                          style={[
                            styles.bar,
                            styles.barGratitude,
                            {
                              height: item.trilha3 * barHeightFactor,
                            },
                          ]}
                        />
                        {/* Trilha 4 – Muito Triste */}
                        <View
                          style={[
                            styles.bar,
                            styles.barVerySad,
                            {
                              height: item.trilha4 * barHeightFactor,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.barLabel}>{item.month}</Text>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Legenda das trilhas */}
            <View style={styles.legend}>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotRed]} />
                  <Text style={styles.legendText}>
                    Trilha 1 – Ansiedade Leve
                  </Text>
                </View>
              </View>

              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotGreen]} />
                  <Text style={styles.legendText}>
                    Trilha 2 – Estresse Trabalho/Estudo
                  </Text>
                </View>
              </View>

              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotCyan]} />
                  <Text style={styles.legendText}>Trilha 3 – Muito Feliz</Text>
                </View>
              </View>

              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotOrange]} />
                  <Text style={styles.legendText}>Trilha 4 – Muito Triste</Text>
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

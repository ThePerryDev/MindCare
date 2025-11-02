// frontend/app/screens/PerfilScreen/PerfilScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import { styles } from './styles';

const screenWidth = Dimensions.get('window').width;

export default function PerfilScreen() {
  const router = useRouter();

  const [profileData] = useState({
    consecutiveDays: {
      bestStreak: 5,
      totalCheckins: 15,
    },
    weeklyResults: {
      activeDays: 0,
      averageMood: 0.0,
      completedActivities: 0,
      completedTrails: 0,
    },
    moodEvolution: [
      {
        day: 'Seg',
        'Muito Feliz': 5,
        Irritado: 2,
        Triste: 3,
        Neutro: 4,
        'Muito Triste': 1,
      },
      {
        day: 'Ter',
        'Muito Feliz': 7,
        Irritado: 4,
        Triste: 2,
        Neutro: 5,
        'Muito Triste': 3,
      },
      {
        day: 'Qua',
        'Muito Feliz': 10,
        Irritado: 6,
        Triste: 4,
        Neutro: 7,
        'Muito Triste': 2,
      },
      {
        day: 'Qui',
        'Muito Feliz': 8,
        Irritado: 5,
        Triste: 7,
        Neutro: 6,
        'Muito Triste': 4,
      },
      {
        day: 'Sex',
        'Muito Feliz': 12,
        Irritado: 8,
        Triste: 5,
        Neutro: 9,
        'Muito Triste': 3,
      },
    ],
    activitiesByCategory: [
      { month: 'Jan', mindfulness: 5, stress: 6, gratitude: 7 },
      { month: 'Fev', mindfulness: 6, stress: 5, gratitude: 8 },
      { month: 'Mar', mindfulness: 4, stress: 7, gratitude: 6 },
      { month: 'Abr', mindfulness: 7, stress: 8, gratitude: 9 },
      { month: 'Mai', mindfulness: 10, stress: 7, gratitude: 8 },
      { month: 'Jun', mindfulness: 8, stress: 9, gratitude: 10 },
    ],
  });

  const moodChartData = {
    labels: profileData.moodEvolution.map(d => d.day),
    datasets: [
      {
        data: profileData.moodEvolution.map(d => d['Irritado']),
        color: () => '#EF4444',
        strokeWidth: 2,
      },
      {
        data: profileData.moodEvolution.map(d => d['Triste']),
        color: () => '#F97316',
        strokeWidth: 2,
      },
      {
        data: profileData.moodEvolution.map(d => d['Neutro']),
        color: () => '#FCD34D',
        strokeWidth: 2,
      },
      {
        data: profileData.moodEvolution.map(d => d['Muito Feliz']),
        color: () => '#10B981',
        strokeWidth: 2,
      },
      {
        data: profileData.moodEvolution.map(d => d['Muito Triste']),
        color: () => '#06B6D4',
        strokeWidth: 2,
      },
    ],
  };

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

          {/* Card Resultado Semanal */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resultado Semanal</Text>
            <View style={styles.statsGrid}>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Dias Ativos</Text>
                <Text style={styles.gridValue}>
                  {profileData.weeklyResults.activeDays}/7
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Humor Médio</Text>
                <Text style={styles.gridValue}>
                  {profileData.weeklyResults.averageMood.toFixed(1)}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Atividades Feitas</Text>
                <Text style={styles.gridValue}>
                  {profileData.weeklyResults.completedActivities}/7
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Trilhas Feitas</Text>
                <Text style={styles.gridValue}>
                  {profileData.weeklyResults.completedTrails}/10
                </Text>
              </View>
            </View>
            <View style={styles.pageIndicators}>
              <View style={[styles.indicator, styles.indicatorActive]} />
              <View style={styles.indicator} />
            </View>
          </View>

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
              <LineChart
                data={moodChartData}
                width={screenWidth - 72}
                height={220}
                chartConfig={{
                  backgroundColor: '#FFFFFF',
                  backgroundGradientFrom: '#FFFFFF',
                  backgroundGradientTo: '#FFFFFF',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(76, 70, 182, ${opacity})`,
                  labelColor: () => '#94A3B8',
                  style: { borderRadius: 16 },
                  propsForDots: { r: '4', strokeWidth: '2' },
                }}
                bezier
                style={styles.chart}
                withInnerLines
                withOuterLines={false}
                withVerticalLines={false}
                withHorizontalLines
                withDots
                withShadow={false}
              />
            </View>

            <View style={styles.legend}>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotRed]} />
                  <Text style={styles.legendText}>Irritado</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotOrange]} />
                  <Text style={styles.legendText}>Triste</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotYellow]} />
                  <Text style={styles.legendText}>Neutro</Text>
                </View>
              </View>

              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotGreen]} />
                  <Text style={styles.legendText}>Muito Feliz</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotCyan]} />
                  <Text style={styles.legendText}>Muito Triste</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Card Atividades por Categoria */}
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
      </SafeAreaView>
    </LinearGradient>
  );
}

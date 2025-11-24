/* eslint-disable react-native/no-inline-styles */
// frontend/components/WeeklyResults/WeeklyResults.tsx

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Card from '@/components/Card/Card';
import { styles } from './styles';
import { useHomeDashboard } from '../../contexts/useHomeDashboard';

export default function WeeklyResults() {
  const { stats, loading } = useHomeDashboard();

  if (loading && !stats) {
    return (
      <Card style={styles.card}>
        <Text style={styles.title}>Resultado Semanal</Text>
        <ActivityIndicator style={{ marginTop: 12 }} />
      </Card>
    );
  }

  const diasAtivos = stats?.diasAtivos ?? 0;
  const humorMedio =
    typeof stats?.humorMedio === 'number' ? stats.humorMedio.toFixed(1) : '--';

  const totalAtividades = stats?.totalExercicios ?? 0;
  const trilhasFeitas = stats?.totalTrilhas ?? 0;

  const results = [
    { label: 'Dias Ativos', value: `${diasAtivos}/7` },
    { label: 'Humor Médio', value: humorMedio },
    { label: 'Atividades Feitas', value: `${totalAtividades}` },
    { label: 'Trilhas Feitas', value: `${trilhasFeitas}` },
  ];

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Resultado Semanal</Text>

      <View style={styles.row}>
        {results.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

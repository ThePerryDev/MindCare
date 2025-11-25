/* eslint-disable react-native/no-inline-styles */
// frontend/components/WeeklyResults/WeeklyResults.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Card from '@/components/Card/Card';
import { styles } from './styles';
import { useHomeDashboard } from '../../contexts/useHomeDashboard';
import dayjs from 'dayjs';
import { listarFeelings, FeelingDTO } from '@/services/feelingHistory';
import { feelingToValue, FeelingLabel } from '@/constants/feelingsScale';

export default function WeeklyResults() {
  const { stats, loading } = useHomeDashboard();

  // 🔹 Vamos buscar os feelings (entrada+saída) dos últimos 7 dias,
  // igual na tela de Perfil
  const [feelings, setFeelings] = useState<FeelingDTO[]>([]);
  const [loadingFeelings, setLoadingFeelings] = useState(false);

  useEffect(() => {
    const fetchFeelings = async () => {
      try {
        setLoadingFeelings(true);

        const today = dayjs();
        const inicio = today.subtract(6, 'day').format('YYYY-MM-DD');
        const fim = today.format('YYYY-MM-DD');

        const data = await listarFeelings({ inicio, fim });

        // ordena do mais antigo para o mais novo (mesma lógica do Perfil)
        const ordered = [...data].sort((a, b) => a.day.localeCompare(b.day));
        setFeelings(ordered);
      } catch (err) {
        console.error('🔴 [WeeklyResults] Erro ao carregar feelings:', err);
      } finally {
        setLoadingFeelings(false);
      }
    };

    void fetchFeelings();
  }, []);

  // 🔹 Calcula Dias Ativos e Humor Médio exatamente como na tela Perfil:
  // - activeDays = quantidade de dias com registro (ordered.length)
  // - averageMood = média dos valores de ENTRADA + SAÍDA
  const { activeDays, averageMood } = useMemo(() => {
    if (!feelings.length) {
      return { activeDays: 0, averageMood: 0 };
    }

    const activeDays = feelings.length;
    const numericValues: number[] = [];

    feelings.forEach(f => {
      const entrada = feelingToValue[f.sentimento_de_entrada as FeelingLabel];
      const saida = feelingToValue[f.sentimento_de_saida as FeelingLabel];

      if (typeof entrada === 'number') numericValues.push(entrada);
      if (typeof saida === 'number') numericValues.push(saida);
    });

    const averageMood =
      numericValues.length > 0
        ? numericValues.reduce((sum, v) => sum + v, 0) / numericValues.length
        : 0;

    return { activeDays, averageMood };
  }, [feelings]);

  const loadingOverall = loading || loadingFeelings;
  const hasAnyData = feelings.length > 0 || !!stats;

  // Valores de atividades e trilhas continuam vindo do /trails/stats
  const totalAtividades = stats?.totalExercicios ?? 0;
  const trilhasFeitas = stats?.totalTrilhas ?? 0;

  // Label igual Perfil: X/7 (últimos 7 dias)
  const diasAtivosLabel = `${activeDays}/7`;
  const humorMedioLabel = feelings.length > 0 ? averageMood.toFixed(1) : '--';

  const results = [
    { label: 'Dias Ativos', value: diasAtivosLabel },
    { label: 'Humor Médio', value: humorMedioLabel },
    { label: 'Atividades Feitas', value: `${totalAtividades}` },
    { label: 'Trilhas Feitas', value: `${trilhasFeitas}` },
  ];

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Resultado Semanal</Text>

      {loadingOverall && (
        <ActivityIndicator style={{ marginTop: 8, marginBottom: 8 }} />
      )}

      {!loadingOverall && !hasAnyData && (
        <Text style={styles.label}>Ainda não há dados para este período.</Text>
      )}

      {hasAnyData && (
        <View style={styles.row}>
          {results.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

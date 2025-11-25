import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Card from '@/components/Card/Card';
import { styles } from './styles';
import { useHomeDashboard } from '../../contexts/useHomeDashboard';
import { useRouter } from 'expo-router';

export default function ContinueImproving() {
  const router = useRouter();
  const { nextExercise, loading } = useHomeDashboard();

  const { trackLabel, exerciseLabel, disabled } = useMemo(() => {
    if (loading) {
      return {
        trackLabel: 'Carregando...',
        exerciseLabel: '',
        disabled: true,
      };
    }

    if (!nextExercise) {
      return {
        trackLabel: 'Nenhuma trilha recente',
        exerciseLabel: 'Inicie uma trilha para continuar',
        disabled: true,
      };
    }

    if (nextExercise.finished || !nextExercise.nextExercise) {
      return {
        trackLabel: `Trilha: ${nextExercise.trail.nome}`,
        exerciseLabel: 'Trilha concluída! Escolha outra para continuar.',
        disabled: false,
      };
    }

    return {
      trackLabel: `Trilha: ${nextExercise.trail.nome}`,
      exerciseLabel: `Próximo exercício: ${nextExercise.nextExercise.step.titulo}`,
      disabled: false,
    };
  }, [loading, nextExercise]);

  const handlePress = () => {
    if (disabled) return;

    // TODO: abrir diretamente na tela do exercício (rota específica)
    router.push('/trails');
  };

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Continue Melhorando</Text>

      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.trackLabel}>{trackLabel}</Text>
          {exerciseLabel ? (
            <Text style={styles.exerciseLabel}>{exerciseLabel}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.playButton}
          disabled={disabled}
          onPress={handlePress}
        >
          <LinearGradient
            colors={['#4776E6', '#8E54E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.playGradient}
          >
            <Ionicons name='play' size={22} color='#fff' />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

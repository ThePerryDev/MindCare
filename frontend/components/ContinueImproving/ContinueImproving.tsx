import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Card from '@/components/Card/Card';
import { styles } from './styles';

export default function ContinueImproving() {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Continue Melhorando</Text>

      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.trackLabel}>Trilha: Alívio de Estresse</Text>
          <Text style={styles.exerciseLabel}>Exercício de Respiração</Text>
        </View>

        <TouchableOpacity style={styles.playButton}>
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

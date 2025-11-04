import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Button from '@/components/Button/Button';
import styles from './styles';
import WeeklyResults from '@/components/WeeklyResults/WeeklyResults';
import ContinueImproving from '@/components/ContinueImproving/ContinueImproving';
import Navbar from '@/components/Navbar/Navbar';
import { useAuth } from '@/hooks/useAuth';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Primeiro nome
  const firstName = useMemo(() => {
    if (!user?.fullName) return 'Usuário';
    return user.fullName.split(' ')[0];
  }, [user]);

  // Saudação de acordo com horário
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  return (
    <LinearGradient
      colors={['#F4EFFF', '#D6F0F0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.greeting}>
          {greeting}, {firstName}!
        </Text>

        <View style={styles.buttonWrapper}>
          <Button onPress={() => router.push('/mood')}>
            <Text>Como está se sentindo hoje?</Text>
          </Button>
        </View>

        <WeeklyResults />
        <ContinueImproving />
        <Navbar />
      </SafeAreaView>
    </LinearGradient>
  );
}

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Button from '@/components/Button/Button';
import styles from './styles';
import WeeklyResults from '@/components/WeeklyResults/WeeklyResults';
import ContinueImproving from '@/components/ContinueImproving/ContinueImproving';
import Navbar from '@/components/Navbar/Navbar';

export default function HomeScreen() {
  const router = useRouter();

  const handleMoodPress = () => {
    router.push('/mood');
  };

  return (
    <LinearGradient
      colors={['#F4EFFF', '#D6F0F0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.greeting}>Boa noite, Robson!</Text>

        <View style={styles.buttonWrapper}>
          <Button onPress={handleMoodPress}>
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

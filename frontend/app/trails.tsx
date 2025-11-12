import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, StyleSheet } from 'react-native';
import Navbar from '@/components/Navbar/Navbar';

export default function Trails() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Trilhas (em breve)</Text>
      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

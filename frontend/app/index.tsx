// frontend/app/index.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import MoodScreen from './screens/MoodScreen/MoodScreen'

export default function App() {
  return (
    <SafeAreaProvider>
      <MoodScreen />
    </SafeAreaProvider>
  );
}

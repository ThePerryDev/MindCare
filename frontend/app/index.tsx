// frontend/app/index.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './screens/SplashScreen/SplashScreen';
import { AuthProvider } from '@/contexts/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SplashScreen />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

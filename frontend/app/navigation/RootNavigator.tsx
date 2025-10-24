// app/navigation/RootNavigator.tsx
import React from 'react';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import LoadingScreen from '../screens/LoadingScreen/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return user ? <AppStack /> : <AuthStack />
}

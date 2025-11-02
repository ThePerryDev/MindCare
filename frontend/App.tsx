// App.tsx (raiz do projeto Expo)
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Slot } from 'expo-router';

export default function App() {
  return (
    <AuthProvider>
      {/* Slot = onde o expo-router vai renderizar as páginas */}
      <Slot />
    </AuthProvider>
  );
}

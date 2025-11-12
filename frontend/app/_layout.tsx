// app/_layout.tsx
import { Slot } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { RegisterFlowProvider } from '@/contexts/RegisterFlowContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <AuthProvider>
          <RegisterFlowProvider>
            <Slot />
          </RegisterFlowProvider>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'transparent', flex: 1 },
});

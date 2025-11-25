// app/_layout.tsx
import { Slot } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { RegisterFlowProvider } from '@/contexts/RegisterFlowContext';
import { HomeDashboardProvider } from '@/contexts/HomeDashboardContext';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

// Define como as notificações serão exibidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    })();
  }, []);

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
            <HomeDashboardProvider>
              <Slot />
            </HomeDashboardProvider>
          </RegisterFlowProvider>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'transparent', flex: 1 },
});

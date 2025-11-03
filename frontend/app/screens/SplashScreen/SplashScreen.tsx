import { Image, View } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import styles from './styles';
import logoMindcare from '../../../assets/images/logo_mindcare.png';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/screens/LoginScreen/LoginScreen');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image source={logoMindcare} style={styles.image} />
    </View>
  );
}

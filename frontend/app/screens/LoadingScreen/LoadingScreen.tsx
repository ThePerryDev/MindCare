/* eslint-disable @typescript-eslint/no-redeclare */
import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import AnimatedLoader from '@/components/AnimatedLoader/AnimatedLoader.native';
import loadingAnim from '../../../assets/animations/loading.json';

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(
        '/screens/CadastroScreen/CadastroFinalizadoScreen/CadastroFinalizadoScreen'
      );
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <AnimatedLoader source={loadingAnim} style={styles.loader} />

      <MaskedView maskElement={<Text style={styles.title}>Carregando...</Text>}>
        <LinearGradient
          colors={['#4776E6', '#8E54E9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.title, styles.invisible]}>Carregando...</Text>
        </LinearGradient>
      </MaskedView>
    </View>
  );
}

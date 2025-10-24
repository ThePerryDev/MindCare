/* global setTimeout, clearTimeout */
import { Image, View, Text } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { styles } from './styles';
import platypus from '../../../../assets/images/Platypus.png';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

export default function CadastroFinalizadoScreen() {
  const title = 'Cadastro Finalizado com sucesso';
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/screens/LoginScreen/LoginScreen');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <MaskedView maskElement={<Text style={styles.title}>{title}</Text>}>
        <LinearGradient
          colors={['#4776E6', '#8E54E9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.title, styles.invisible]}>{title}</Text>
        </LinearGradient>
      </MaskedView>
      <Image source={platypus} style={styles.image} />
    </View>
  );
}

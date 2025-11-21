import React from 'react';
import { View, Image, Text } from 'react-native';
import { styles } from './styles';
import logoMindcare from '../../assets/images/logo_mindcare.png';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export default function ForgotPasswordCodeIntro() {
  const title = 'Esqueceu sua senha?';

  return (
    <View style={styles.container}>
      <Image source={logoMindcare} style={styles.logo} resizeMode='contain' />
      <MaskedView maskElement={<Text style={styles.title}>{title}</Text>}>
        <LinearGradient
          colors={['#4776E6', '#8E54E9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.title, styles.invisible]}>{title}</Text>
        </LinearGradient>
      </MaskedView>
      <Text style={styles.subtitle}>
        Para definir sua nova senha será necessário que digite seu e-mail e
        confirme seu código de verificação.
      </Text>
    </View>
  );
}

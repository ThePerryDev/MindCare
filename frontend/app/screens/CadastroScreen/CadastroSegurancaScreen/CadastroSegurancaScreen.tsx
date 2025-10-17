import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import Input from '../../../../components/Input/Input';
import Button from '../../../../components/Button/Button';
import logoMindcare from '../../../../assets/images/logo_mindcare.png';
import ReturnButton from '@/components/Return_Button/Return_Button';
import StepProgress from '@/components/StepProgress/StepProgress';
import { useRouter } from 'expo-router';
import { styles } from './styles';

export default function CadastroSegurancaScreen() {
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [step] = React.useState<1 | 2 | 3>(2);
  const router = useRouter();

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      setIsPasswordFocused(false);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const kavBehavior =
    Platform.OS === 'ios'
      ? keyboardVisible
        ? 'padding'
        : undefined
      : keyboardVisible
        ? 'height'
        : undefined;

  const showLogo = !(keyboardVisible && isPasswordFocused);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={kavBehavior}
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={[
              styles.contentBase,
              keyboardVisible ? styles.contentTop : styles.contentCenter,
              keyboardVisible ? styles.padSmall : styles.padLarge,
            ]}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            {showLogo && (
              <Image
                source={logoMindcare}
                style={[styles.image, keyboardVisible && styles.imageSmall]}
              />
            )}
            <StepProgress currentStep={step} />
            <Input
              label='Senha'
              placeholder='Digite sua senha'
              value={password}
              onChangeText={setPassword}
            />
            <Input
              label='Confirmar Senha'
              placeholder='Digite novamente sua senha'
              value={confirmpassword}
              onChangeText={setConfirmPassword}
            />
            <ReturnButton
              onPress={() =>
                router.push(
                  '/screens/CadastroScreen/CadastroDadosPessoaisScreen/CadastroDadosPessoaisScreen'
                )
              }
            >
              <Text>Voltar</Text>
            </ReturnButton>
            <Button
              onPress={() =>
                router.push(
                  '/screens/CadastroScreen/CadastroConfirmacaoScreen/CadastroConfirmacaoScreen'
                )
              }
            >
              <Text>Próximo</Text>
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

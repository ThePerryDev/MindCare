import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  InteractionManager,
  Alert,
} from 'react-native';
import Button from '../../../../components/Button/Button';
import ReturnButton from '@/components/Return_Button/Return_Button';
import StepProgress from '@/components/StepProgress/StepProgress';
import { useRouter } from 'expo-router';
import styles from './styles';
import CreateAccountIntro from '@/components/CreateAccountIntro/CreateAccountIntro';
import PasswordRequirements from '@/components/PasswordRequirements/PasswordRequirements';
import PasswordInput from '@/components/PasswordInput/PasswordInput';
import { useRegisterFlow } from '@/contexts/RegisterFlowContext';

function validatePassword(pwd: string) {
  // Regra sugerida: mínimo 6, ao menos 1 letra e 1 número
  return /[A-Za-z]/.test(pwd) && /\d/.test(pwd) && pwd.length >= 6;
}

export default function CadastroSegurancaScreen() {
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const [kbHeight, setKbHeight] = useState(0);
  const [step] = React.useState<1 | 2 | 3>(2);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setStep2 } = useRegisterFlow();

  useEffect(() => {
    const onShow = Keyboard.addListener('keyboardDidShow', e => {
      setKbHeight((e.endCoordinates?.height ?? 0) + 16);
    });
    const onHide = Keyboard.addListener('keyboardDidHide', () => {
      setKbHeight(0);
    });
    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  const kavBehavior = Platform.OS === 'ios' ? 'padding' : 'height';

  const handleConfirmFocus = () => {
    InteractionManager.runAfterInteractions(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  };

  const handleNext = () => {
    if (!password || !confirmpassword) {
      Alert.alert('Atenção', 'Preencha a senha e a confirmação.');
      return;
    }
    if (password !== confirmpassword) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert(
        'Atenção',
        'Senha fraca. Use letras, números e 6+ caracteres.'
      );
      return;
    }

    // Persiste a etapa 2 no contexto
    setStep2({ password, confirmPassword: confirmpassword });

    router.replace(
      '/screens/CadastroScreen/CadastroConfirmacaoScreen/CadastroConfirmacaoScreen'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={kavBehavior}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={[
              styles.contentBase,
              { paddingBottom: kbHeight + 24 },
            ]}
            keyboardShouldPersistTaps='handled'
            keyboardDismissMode='on-drag'
            automaticallyAdjustKeyboardInsets
            showsVerticalScrollIndicator={false}
          >
            <CreateAccountIntro />
            <StepProgress currentStep={step} />

            <PasswordInput
              label='Senha'
              placeholder='Digite sua senha'
              value={password}
              onChangeText={setPassword}
              returnKeyType='next'
            />

            <PasswordRequirements password={password} />

            <PasswordInput
              label='Confirmar Senha'
              placeholder='Digite novamente sua senha'
              value={confirmpassword}
              onChangeText={setConfirmPassword}
              onFocus={handleConfirmFocus}
              returnKeyType='done'
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

            <Button onPress={handleNext}>
              <Text>Próximo</Text>
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
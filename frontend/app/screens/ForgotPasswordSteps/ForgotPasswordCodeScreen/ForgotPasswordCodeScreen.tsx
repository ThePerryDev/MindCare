import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import ReturnButton from '@/components/Return_Button/Return_Button';
import { api } from '@/services/api';
import { AxiosError } from 'axios';
import styles from './styles';
import ForgotPasswordCodeIntro from '@/components/ForgotPasswordCodeIntro/ForgotPasswordCodeIntro';

/* -------------------- VALIDATORS -------------------- */

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidCode(v: string) {
  return /^\d{6}$/.test(v);
}

/* -------------------- COMPONENT -------------------- */

export default function ForgotPasswordCodeScreen() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );
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

  /* -------------------- Solicitar Código -------------------- */

  const handleRequestCode = async () => {
    const emailNorm = email.trim().toLowerCase();

    if (!emailNorm) {
      Alert.alert('Atenção', 'Preencha o e-mail.');
      return;
    }

    if (!isValidEmail(emailNorm)) {
      Alert.alert('Atenção', 'E-mail inválido.');
      return;
    }

    try {
      await api.post('/auth/forgot-password/request-code', {
        email: emailNorm,
      });

      setCodeRequested(true);

      Alert.alert(
        'Código enviado',
        'Enviamos um código de verificação para o número cadastrado. Digite o código abaixo e toque em "Próximo".'
      );
    } catch (error: unknown) {
      console.log('[EsqueceuSenha] erro ao solicitar código:', error);
      let msg = 'Erro ao solicitar código de verificação.';

      if (error instanceof AxiosError) {
        msg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }

      Alert.alert('Erro', msg);
    }
  };

  /* -------------------- Validar Código -------------------- */

  const handleVerifyCode = async () => {
    const emailNorm = email.trim().toLowerCase();

    if (!emailNorm) {
      Alert.alert('Atenção', 'Preencha o e-mail.');
      return;
    }

    if (!isValidEmail(emailNorm)) {
      Alert.alert('Atenção', 'E-mail inválido.');
      return;
    }

    if (!codeRequested) {
      Alert.alert(
        'Atenção',
        'Primeiro solicite o código de verificação antes de prosseguir.'
      );
      return;
    }

    if (!code.trim()) {
      Alert.alert(
        'Atenção',
        'Digite o código de verificação que você recebeu.'
      );
      return;
    }

    if (!isValidCode(code.trim())) {
      Alert.alert(
        'Atenção',
        'Código inválido. Digite os 6 dígitos numéricos enviados.'
      );
      return;
    }

    try {
      await api.post('/auth/forgot-password/verify-code', {
        email: emailNorm,
        code: code.trim(),
      });

      // Envia email e code para a tela de nova senha
      router.replace(
        `/screens/ForgotPasswordSteps/ForgotPasswordScreen/NewPasswordScreen?email=${encodeURIComponent(
          emailNorm
        )}&code=${encodeURIComponent(code.trim())}`
      );
    } catch (error: unknown) {
      console.log('[EsqueceuSenha] erro ao verificar código:', error);
      let msg = 'Erro ao verificar código de verificação.';

      if (error instanceof AxiosError) {
        msg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }

      Alert.alert('Erro', msg);
    }
  };

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
            <ForgotPasswordCodeIntro />

            <Input
              label='E-mail'
              placeholder='Digite seu e-mail'
              value={email}
              onChangeText={setEmail}
              autoCapitalize='none'
              keyboardType='email-address'
              returnKeyType='next'
            />

            <Button onPress={handleRequestCode}>
              <Text>Solicitar Código</Text>
            </Button>

            <Input
              label='Código de Verificação'
              placeholder='Digite seu código de verificação'
              value={code}
              onChangeText={setCode}
              keyboardType='number-pad'
              maxLength={6}
              returnKeyType='done'
            />

            <ReturnButton onPress={() => router.push('/')}>
              <Text>Voltar</Text>
            </ReturnButton>

            <Button onPress={handleVerifyCode}>
              <Text>Próximo</Text>
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

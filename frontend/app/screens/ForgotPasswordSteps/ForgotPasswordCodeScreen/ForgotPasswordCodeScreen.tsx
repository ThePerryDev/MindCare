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
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import ReturnButton from '@/components/Return_Button/Return_Button';
import { api } from '@/services/api';
import { AxiosError } from 'axios';
import styles from './styles';

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

  const handleNext = async () => {
    const emailNorm = email.trim().toLowerCase();

    if (!emailNorm) {
      Alert.alert('Atenção', 'Preencha o e-mail.');
      return;
    }

    if (!isValidEmail(emailNorm)) {
      Alert.alert('Atenção', 'E-mail inválido.');
      return;
    }

    // Primeiro clique: solicita o envio do código via SMS
    if (!codeRequested) {
      try {
        await api.post('/auth/forgot-password/request-code', {
          email: emailNorm,
        });
        setCodeRequested(true);
        Alert.alert(
          'Código enviado',
          'Enviamos um código de verificação por SMS para o número cadastrado. Digite o código abaixo e toque em "Próximo" novamente.'
        );
      } catch (error: unknown) {
        console.log('[EsqueceuSenha] erro ao solicitar código:', error);
        let msg = '[EsqueceuSenha] erro ao solicitar código:';
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
      return;
    }

    // Depois que o código já foi solicitado, o botão passa a validar o código
    if (!code.trim()) {
      Alert.alert(
        'Atenção',
        'Digite o código de verificação que você recebeu por SMS.'
      );
      return;
    }

    if (!isValidCode(code.trim())) {
      Alert.alert(
        'Atenção',
        'Código inválido. Digite os 6 dígitos numéricos recebidos por SMS.'
      );
      return;
    }

    try {
      await api.post('/auth/forgot-password/verify-code', {
        email: emailNorm,
        code: code.trim(),
      });

      // Se deu certo, navega para a tela de nova senha
      router.push({
        pathname:
          '/screens/EsqueceuSenhaScreen/EsqueceuSenhaNovaSenhaScreen/EsqueceuSenhaNovaSenhaScreen',
        params: { email: emailNorm, code: code.trim() },
      });
    } catch (error: unknown) {
      console.log('[EsqueceuSenha] erro ao verificar código:', error);
      let msg = '[EsqueceuSenha] erro ao verificar código:';

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
            {/* Header da tela */}
            <View style={styles.header}>
              <Text style={styles.title}>Esqueceu sua senha?</Text>
              <Text style={styles.subtitle}>
                Para definir sua nova senha será necessário que digite seu
                e-mail e confirme seu código de verificação.
              </Text>
            </View>

            <Input
              label='E-mail'
              placeholder='Digite seu e-mail'
              value={email}
              onChangeText={setEmail}
              autoCapitalize='none'
              keyboardType='email-address'
              returnKeyType='next'
            />

            <Input
              label='Código de Verificação'
              placeholder='Digite seu código de verificação'
              value={code}
              onChangeText={setCode}
              keyboardType='number-pad'
              maxLength={6}
              returnKeyType='done'
            />

            <ReturnButton onPress={() => router.back()}>
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

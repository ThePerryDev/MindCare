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
  View,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import Button from '@/components/Button/Button';
import ReturnButton from '@/components/Return_Button/Return_Button';
import PasswordRequirements from '@/components/PasswordRequirements/PasswordRequirements';
import PasswordInput from '@/components/PasswordInput/PasswordInput';
import { api } from '@/services/api';

import styles from './styles';
import { AxiosError } from 'axios';

/* -------------------- VALIDAÇÃO DE SENHA -------------------- */
/**
 * Acompanha os requisitos visuais:
 * - Pelo menos 8 caracteres
 * - Uma letra maiúscula
 * - Uma letra minúscula
 * - Pelo menos um número
 * - Pelo menos um caracter especial
 */
function validatePassword(pwd: string) {
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
  const hasLength = pwd.length >= 8;
  return hasUpper && hasLower && hasNumber && hasSpecial && hasLength;
}

/* -------------------- COMPONENT -------------------- */

export default function NewForgotPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  const scrollRef = useRef<ScrollView>(null);
  const [kbHeight, setKbHeight] = useState(0);

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; code?: string }>();

  const email = (params.email || '').toString();
  const code = (params.code || '').toString();

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

  const handleNext = async () => {
    if (!email || !code) {
      Alert.alert(
        'Erro',
        'Dados de verificação ausentes. Volte e refaça o processo de recuperação de senha.'
      );
      router.back();
      return;
    }

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
        'Senha fraca. Use pelo menos 8 caracteres, incluindo letra maiúscula, letra minúscula, número e caracter especial.'
      );
      return;
    }

    try {
      await api.post('/auth/forgot-password/reset', {
        email,
        code,
        newPassword: password,
        confirmPassword: confirmpassword,
      });

      Alert.alert('Sucesso', 'Senha atualizada com sucesso.', [
        {
          text: 'OK',
          onPress: () => router.replace('/'),
        },
      ]);
    } catch (error: unknown) {
      console.log('[EsqueceuSenha] erro ao redefinir senha:', error);
      let msg = '[EsqueceuSenha] erro ao redefinir senha:';

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
            {/* Header da tela */}
            <View style={styles.header}>
              <Text style={styles.title}>Esqueceu sua senha?</Text>
              <Text style={styles.subtitle}>Digite sua nova senha</Text>
            </View>

            <PasswordInput
              label='Senha'
              placeholder='Digite sua senha'
              value={password}
              onChangeText={setPassword}
              returnKeyType='next'
            />

            <PasswordRequirements password={password} />

            <PasswordInput
              label='Confirmar senha'
              placeholder='Digite novamente sua senha'
              value={confirmpassword}
              onChangeText={setConfirmPassword}
              onFocus={handleConfirmFocus}
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

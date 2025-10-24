import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  Image,
  Pressable,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import styles from './styles';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import logoMindcare from '../../../assets/images/logo_mindcare.png';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

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

            <Input
              label='E-mail'
              placeholder='Digite seu e-mail'
              value={email}
              onChangeText={setEmail}
            />

            <Input
              label='Senha'
              placeholder='Digite sua senha'
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />

            <Button
              onPress={() => router.push('/screens/HomeScreen/HomeScreen')}
            >
              <Text>Login</Text>
            </Button>

            <Pressable onPress={() => router.push('/')}>
              <Text style={styles.linkForgot}>Esqueceu sua senha?</Text>
            </Pressable>

            <View style={styles.registerContainer}>
              <Text style={styles.textRegister}>Não tem uma conta? </Text>
              <Pressable
                onPress={() =>
                  router.push(
                    '/screens/CadastroScreen/CadastroDadosPessoaisScreen/CadastroDadosPessoaisScreen'
                  )
                }
              >
                <Text style={styles.linkRegister}>Cadastre-se</Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

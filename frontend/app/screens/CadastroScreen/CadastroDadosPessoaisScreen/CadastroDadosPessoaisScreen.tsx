import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import Input from '../../../../components/Input/Input';
import Button from '../../../../components/Button/Button';
import ReturnButton from '@/components/Return_Button/Return_Button';
import StepProgress from '@/components/StepProgress/StepProgress';
import { useRouter } from 'expo-router';
import styles from './styles';
import CreateAccountIntro from '@/components/CreateAccountIntro/CreateAccountIntro';

export default function CadastroDadosPessoaisScreen() {
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [birthday, setBirthday] = useState('');
  const [userheight, setUserHeight] = useState('');
  const [userweight, setUserWeight] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [step] = React.useState<1 | 2 | 3>(1);
  const router = useRouter();

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
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
            <CreateAccountIntro />
            <StepProgress currentStep={step} />
            <Input
              label='Nome Completo'
              placeholder='Digite seu nome completo'
              value={fullname}
              onChangeText={setFullName}
            />
            <Input
              label='E-mail'
              placeholder='Digite seu e-mail'
              value={email}
              onChangeText={setEmail}
            />

            <Input
              label='Telefone'
              placeholder='(99)99999-9999'
              value={phonenumber}
              onChangeText={setPhoneNumber}
            />
            <Input
              label='Data de Nascimento'
              placeholder='01/01/2025'
              value={birthday}
              onChangeText={setBirthday}
            />
            <Input
              label='Altura'
              placeholder='Digite sua altura'
              value={userheight}
              onChangeText={setUserHeight}
            />
            <Input
              label='Peso'
              placeholder='Digite seu peso'
              value={userweight}
              onChangeText={setUserWeight}
            />
            <ReturnButton onPress={() => router.push('/')}>
              <Text>Voltar</Text>
            </ReturnButton>
            <Button
              onPress={() =>
                router.push(
                  '/screens/CadastroScreen/CadastroSegurancaScreen/CadastroSegurancaScreen'
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

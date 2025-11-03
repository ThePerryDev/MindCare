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
import Input from '../../../../components/Input/Input';
import Button from '../../../../components/Button/Button';
import ReturnButton from '@/components/Return_Button/Return_Button';
import StepProgress from '@/components/StepProgress/StepProgress';
import { useRouter } from 'expo-router';
import styles from './styles';
import CreateAccountIntro from '@/components/CreateAccountIntro/CreateAccountIntro';
import { useRegisterFlow } from '@/contexts/RegisterFlowContext';

/* -------------------- VALIDATORS -------------------- */

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function isValidPhoneBR(v: string) {
  return /^\(\d{2}\)\d{4,5}-\d{4}$/.test(v);
}
function isValidDateBR(v: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(v)) return false;
  const [dd, mm, yyyy] = v.split('/').map(n => parseInt(n, 10));
  const d = new Date(yyyy, mm - 1, dd);
  return (
    d.getFullYear() === yyyy && d.getMonth() === mm - 1 && d.getDate() === dd
  );
}

/* -------------------- MASKS -------------------- */

function maskPhoneBR(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)})${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)})${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

function maskDateBR(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** Altura: aceita vírgula/ponto, 1 dígito antes da vírgula (0–2), até 2 decimais.
 *  Se não houver vírgula e houver 3 dígitos (ex.: "175"), autoformata para "1,75".
 */
function maskHeight(v: string) {
  let s = v.replace(/[^\d.,]/g, '');
  if (!s) return '';

  // normaliza ponto -> vírgula
  s = s.replace(/\./g, ',');

  // mantém apenas a primeira vírgula
  const firstComma = s.indexOf(',');
  if (firstComma !== -1) {
    s = s.slice(0, firstComma + 1) + s.slice(firstComma + 1).replace(/,/g, '');
  }

  if (s.startsWith(',')) s = '0' + s; // ",75" -> "0,75"

  if (s.includes(',')) {
    const [rawInt, rawDec = ''] = s.split(',');
    let intPart = rawInt.replace(/\D/g, '');
    let decPart = rawDec.replace(/\D/g, '');

    if (intPart.length === 0) intPart = '0';
    if (intPart.length > 1) intPart = intPart[0]; // apenas 1 dígito
    if (parseInt(intPart, 10) > 2) intPart = '2';

    decPart = decPart.slice(0, 2);
    return decPart.length ? `${intPart},${decPart}` : intPart; // permite ficar sem decimal enquanto digita
  } else {
    // sem vírgula: permitir até 3 dígitos
    const digits = s.replace(/\D/g, '').slice(0, 3);
    if (digits.length === 3) {
      // autoformata "175" -> "1,75"
      return `${digits[0]},${digits.slice(1)}`;
    }
    // com 1 ou 2 dígitos, mantém como está (exibe "1" ou "17"); o parse cuida depois
    return digits;
  }
}

/** Peso: até 3 casas decimais, vírgula/ponto (exibe vírgula). */
function maskWeight(v: string) {
  let clean = v.replace(/[^\d.,]/g, '');
  clean = clean.replace(/\./g, ',');
  const firstComma = clean.indexOf(',');
  if (firstComma !== -1) {
    clean =
      clean.slice(0, firstComma + 1) +
      clean.slice(firstComma + 1).replace(/,/g, '');
  }
  let [intPart, decPart = ''] = clean.split(',');
  intPart = intPart.replace(/\D/g, '').slice(0, 3); // 0..700
  decPart = decPart.replace(/\D/g, '').slice(0, 3);
  return decPart.length ? `${intPart},${decPart}` : intPart;
}

/* -------------------- PARSERS -------------------- */

function parseHeight(height: string) {
  const normalized = height.replace(',', '.');
  const num = parseFloat(normalized);
  if (Number.isNaN(num)) return null;
  // >3 -> interpretamos como centímetros; <=3 -> metros
  return num > 3 ? Math.round(num) : Math.round(num * 100);
}

function parseWeight(weight: string) {
  const normalized = weight.replace(',', '.');
  const n = parseFloat(normalized);
  if (Number.isNaN(n)) return null;
  return n > 700 ? 700 : n;
}

/* -------------------- COMPONENT -------------------- */

export default function CadastroDadosPessoaisScreen() {
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [birthday, setBirthday] = useState('');
  const [userheight, setUserHeight] = useState('');
  const [userweight, setUserWeight] = useState('');

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [step] = useState<1 | 2 | 3>(1);
  const router = useRouter();
  const { setStep1 } = useRegisterFlow();

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

  const handleNext = () => {
    if (
      !fullname.trim() ||
      !email.trim() ||
      !phonenumber.trim() ||
      !birthday.trim() ||
      !userheight.trim() ||
      !userweight.trim()
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    const emailNorm = email.trim().toLowerCase();
    if (!isValidEmail(emailNorm)) {
      Alert.alert('Atenção', 'E-mail inválido.');
      return;
    }

    if (!isValidPhoneBR(phonenumber.trim())) {
      Alert.alert(
        'Atenção',
        'Telefone inválido. Use o formato (99)99999-9999.'
      );
      return;
    }

    if (!isValidDateBR(birthday.trim())) {
      Alert.alert('Atenção', 'Data inválida. Use o formato dd/mm/aaaa.');
      return;
    }

    const h = parseHeight(userheight);
    const w = parseWeight(userweight);
    if (h == null || w == null) {
      Alert.alert('Atenção', 'Altura/Peso inválidos.');
      return;
    }

    setStep1({
      fullName: fullname.trim(),
      email: emailNorm,
      phone: phonenumber.trim(),
      birthdate: birthday.trim(), // dd/mm/aaaa (converteremos na Loading)
      height: String(h), // cm
      weight: String(w), // kg
    });

    router.push(
      '/screens/CadastroScreen/CadastroSegurancaScreen/CadastroSegurancaScreen'
    );
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
            <CreateAccountIntro />
            <StepProgress currentStep={step} />

            <Input
              label='Nome Completo'
              placeholder='Digite seu nome completo'
              value={fullname}
              onChangeText={setFullName}
              autoCapitalize='words'
              returnKeyType='next'
            />

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
              label='Telefone'
              placeholder='(99)99999-9999'
              value={phonenumber}
              onChangeText={(t: string) => setPhoneNumber(maskPhoneBR(t))}
              keyboardType='number-pad'
              maxLength={14}
              returnKeyType='next'
            />

            <Input
              label='Data de Nascimento'
              placeholder='dd/mm/aaaa'
              value={birthday}
              onChangeText={(t: string) => setBirthday(maskDateBR(t))}
              keyboardType='number-pad'
              maxLength={10}
              returnKeyType='next'
            />

            <Input
              label='Altura (m)'
              placeholder='1,75'
              value={userheight}
              onChangeText={(t: string) => setUserHeight(maskHeight(t))}
              keyboardType='decimal-pad'
              maxLength={4} // "1,75" tem 4 chars
              returnKeyType='next'
            />

            <Input
              label='Peso (kg)'
              placeholder='70,123'
              value={userweight}
              onChangeText={(t: string) => setUserWeight(maskWeight(t))}
              keyboardType='decimal-pad'
              maxLength={7} // ex.: "700,000"
              returnKeyType='done'
            />

            <ReturnButton onPress={() => router.push('/')}>
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

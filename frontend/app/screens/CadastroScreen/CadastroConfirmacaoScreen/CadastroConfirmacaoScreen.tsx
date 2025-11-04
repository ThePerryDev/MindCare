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
import Button from '../../../../components/Button/Button';
import ReturnButton from '@/components/Return_Button/Return_Button';
import StepProgress from '@/components/StepProgress/StepProgress';
import { useRouter } from 'expo-router';
import CreateAccountIntro from '@/components/CreateAccountIntro/CreateAccountIntro';
import ConsentCard from '@/components/ConsentCard/ConsentCard';
import TermsOfUse from '@/components/TermsOfUse/TermsOfUse';
import PrivacyPolicy from '@/components/PrivacyPolicy/PrivacyPolicy';
import PersonalDataLGPD from '@/components/PersonalDataLGPD/PersonalDataLGPD';
import styles from './styles';
import { useRegisterFlow } from '@/contexts/RegisterFlowContext';

function toIsoFromBRDate(dmy: string) {
  const [dd, mm, yyyy] = dmy.split('/');
  if (!dd || !mm || !yyyy) return '';
  return `${yyyy}-${mm}-${dd}`;
}

export default function CadastroConfirmacaoScreen() {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeLgpd, setAgreeLgpd] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const [step] = React.useState<1 | 2 | 3>(3);

  const [showTerms, setShowTerms] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [showLGPD, setShowLGPD] = useState(false);

  const router = useRouter();
  const { data } = useRegisterFlow();

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

  function handleFinish() {
    // precisa aceitar Termos e LGPD
    if (!agreeTerms || !agreeLgpd) {
      Alert.alert(
        'Atenção',
        'Você precisa aceitar os Termos de Uso e o Consentimento de Dados (LGPD).'
      );
      return;
    }

    // checagem mínima de integridade antes de navegar para a Loading
    if (
      !data.fullName ||
      !data.email ||
      !data.phone ||
      !data.birthdate ||
      !data.height ||
      !data.weight ||
      !data.password ||
      !data.confirmPassword
    ) {
      Alert.alert(
        'Dados incompletos',
        'Volte e preencha todas as etapas do cadastro.'
      );
      return;
    }

    if (!toIsoFromBRDate(String(data.birthdate))) {
      Alert.alert('Data inválida', 'A data deve estar no formato dd/mm/aaaa.');
      return;
    }

    // Tudo ok -> LoadingScreen fará o envio ao backend
    router.replace('/screens/LoadingScreen/LoadingScreen');
  }

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

            <ConsentCard
              checked={agreeTerms}
              onToggle={() => setAgreeTerms(v => !v)}
              prefix='Concordo com os '
              link1Label='Termos de Uso'
              onPressLink1={() => setShowTerms(true)}
              middle=' e '
              link2Label='Política de Privacidade'
              onPressLink2={() => setShowPolicy(true)}
              suffix=' do MindCare.'
            />
            <TermsOfUse
              visible={showTerms}
              onClose={() => setShowTerms(false)}
            />
            <PrivacyPolicy
              visible={showPolicy}
              onClose={() => setShowPolicy(false)}
            />

            <ConsentCard
              checked={agreeLgpd}
              onToggle={() => setAgreeLgpd(v => !v)}
              prefix='Autorizo o '
              link1Label='tratamento dos meus dados pessoais '
              onPressLink1={() => setShowLGPD(true)}
              suffix='conforme a LGPD.'
            />
            <PersonalDataLGPD
              visible={showLGPD}
              onClose={() => setShowLGPD(false)}
            />

            <ReturnButton
              onPress={() =>
                router.push(
                  '/screens/CadastroScreen/CadastroSegurancaScreen/CadastroSegurancaScreen'
                )
              }
            >
              <Text>Voltar</Text>
            </ReturnButton>

            <Button onPress={handleFinish}>
              <Text>Finalizar Cadastro</Text>
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

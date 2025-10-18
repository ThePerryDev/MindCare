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
import Button from '../../../../components/Button/Button';
import ReturnButton from '@/components/Return_Button/Return_Button';
import StepProgress from '@/components/StepProgress/StepProgress';
import { useRouter } from 'expo-router';
import { styles } from './styles';
import CreateAccountIntro from '@/components/CreateAccountIntro/CreateAccountIntro';
import ConsentCard from '@/components/ConsentCard/ConsentCard';

export default function CadastroConfirmacaoScreen() {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeLgpd, setAgreeLgpd] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [step] = React.useState<1 | 2 | 3>(3);
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
            <ConsentCard
              checked={agreeTerms}
              onToggle={() => setAgreeTerms(v => !v)}
              prefix='Concordo com os '
              link1Label='Termos de Uso'
              onPressLink1={() => {
                /* abrir tela/Linking.openURL(...) */
              }}
              middle=' e '
              link2Label='Política de Privacidade'
              onPressLink2={() => {
                /* abrir tela/Linking.openURL(...) */
              }}
              suffix=' do MindCare.'
            />
            <ConsentCard
              checked={agreeLgpd}
              onToggle={() => setAgreeLgpd(v => !v)}
              prefix='Autorizo o tratamento dos meus dados pessoais conforme a '
              link1Label='LGPD'
              onPressLink1={() => {
                /* abrir tela/Linking.openURL(...) */
              }}
              suffix='.'
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

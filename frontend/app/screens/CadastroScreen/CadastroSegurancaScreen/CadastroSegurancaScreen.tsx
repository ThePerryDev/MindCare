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
  InteractionManager, // +++
} from 'react-native';
import Button from '../../../../components/Button/Button';
import ReturnButton from '@/components/Return_Button/Return_Button';
import StepProgress from '@/components/StepProgress/StepProgress';
import { useRouter } from 'expo-router';
import styles from './styles';
import CreateAccountIntro from '@/components/CreateAccountIntro/CreateAccountIntro';
import PasswordRequirements from '@/components/PasswordRequirements/PasswordRequirements';
import PasswordInput from '@/components/PasswordInput/PasswordInput';

export default function CadastroSegurancaScreen() {
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const [kbHeight, setKbHeight] = useState(0);
  const [step] = React.useState<1 | 2 | 3>(2);
  const insets = useSafeAreaInsets(); // +++
  const router = useRouter();

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

  // sem parâmetros (não usamos o evento) e sem setTimeout
  const handleConfirmFocus = () => {
    // aguarda o teclado/animações e rola até o fim
    InteractionManager.runAfterInteractions(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
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
            automaticallyAdjustKeyboardInsets={true}
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

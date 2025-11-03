import { View, Text } from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import AnimatedLoader from '@/components/AnimatedLoader/AnimatedLoader.native';
import loadingAnim from '../../../assets/animations/loading.json';
import { useRegisterFlow } from '@/contexts/RegisterFlowContext';
import { useAuth } from '@/hooks/useAuth';

function toIsoFromBRDate(dmy: string) {
  const [dd, mm, yyyy] = dmy.split('/');
  if (!dd || !mm || !yyyy) return '';
  return `${yyyy}-${mm}-${dd}`;
}

export default function LoadingScreen() {
  const router = useRouter();
  const { data, reset } = useRegisterFlow();
  const { register } = useAuth();

  // 🔒 Evita execução dupla do efeito (React 18 StrictMode) e reexecuções
  const hasSubmittedRef = useRef(false);
  const unmountedRef = useRef(false);

  useEffect(() => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    (async () => {
      try {
        // Proteção: se alguém cair aqui sem ter vindo do fluxo correto,
        // apenas redireciona de volta para Dados Pessoais, sem alert.
        const required =
          data.fullName &&
          data.email &&
          data.phone &&
          data.birthdate &&
          data.height &&
          data.weight &&
          data.password &&
          data.confirmPassword;

        if (!required) {
          if (!unmountedRef.current) {
            router.replace(
              '/screens/CadastroScreen/CadastroDadosPessoaisScreen/CadastroDadosPessoaisScreen'
            );
          }
          return;
        }

        const birthISO = toIsoFromBRDate(String(data.birthdate));
        if (!birthISO) {
          if (!unmountedRef.current) {
            router.replace(
              '/screens/CadastroScreen/CadastroConfirmacaoScreen/CadastroConfirmacaoScreen'
            );
          }
          return;
        }

        const payload = {
          fullName: String(data.fullName),
          email: String(data.email).toLowerCase(),
          phone: String(data.phone),
          birthdate: birthISO,
          height: Number(data.height),
          weight: Number(data.weight),
          password: String(data.password),
          confirmPassword: String(data.confirmPassword),
        };

        // 📤 Envia só uma vez
        await register(payload);

        // limpa o fluxo depois do sucesso
        reset();

        if (!unmountedRef.current) {
          router.replace(
            '/screens/CadastroScreen/CadastroFinalizadoScreen/CadastroFinalizadoScreen'
          );
        }
      } catch {
        // Se der erro, volta para a confirmação para o usuário revisar
        if (!unmountedRef.current) {
          router.replace(
            '/screens/CadastroScreen/CadastroConfirmacaoScreen/CadastroConfirmacaoScreen'
          );
        }
      }
    })();

    return () => {
      unmountedRef.current = true;
    };
    // ⛔️ deps vazias de propósito: não reexecutar ao mudar `data` ou `auth`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedLoader source={loadingAnim} style={styles.loader} />

      <MaskedView maskElement={<Text style={styles.title}>Carregando...</Text>}>
        <LinearGradient
          colors={['#4776E6', '#8E54E9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.title, styles.invisible]}>Carregando...</Text>
        </LinearGradient>
      </MaskedView>
    </View>
  );
}

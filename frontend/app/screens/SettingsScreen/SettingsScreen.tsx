import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  ScrollView,
  Modal,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router'; // ❌ removido: não é usado
import SectionCard from '@/components/SectionCard/SectionCard';
import RowItem from '@/components/RowItem/RowItem';
import Button from '@/components/Button/Button';
import EditFieldModal from '@/components/EditFieldModal/EditFieldModal';
import EditPasswordModal from '@/components/EditPasswordModal/EditPasswordModal';
import TermsOfUse from '@/components/TermsOfUse/TermsOfUse';
import PrivacyPolicy from '@/components/PrivacyPolicy/PrivacyPolicy';
import PersonalDataLGPD from '@/components/PersonalDataLGPD/PersonalDataLGPD';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal/ConfirmDeleteModal';
import { styles } from './styles';
import { theme } from '@/styles/theme';
import Navbar from '@/components/Navbar/Navbar';
import { useAuth } from '@/hooks/useAuth';

/** Util: extrai mensagem de erro sem usar `any` */
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    // casos de erro vindo da API (Axios) como { message: "..." }
    if (err && typeof err === 'object' && 'message' in err) {
      const m = (err as { message?: unknown }).message;
      if (typeof m === 'string') return m;
    }
  } catch {
    /* empty */
  }
  return '';
}

/** Modal simples interno só para placeholder de Licenças */
function InfoModal({
  visible,
  title,
  message,
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) {
  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.infoBackdrop} onPress={onClose} />
      <View style={styles.infoSheet}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoText}>{message}</Text>
        <Button onPress={onClose}>
          <Text>Fechar</Text>
        </Button>
      </View>
    </Modal>
  );
}

type ModalState =
  | { key: null }
  | {
      key:
        | 'username'
        | 'email'
        | 'height'
        | 'weight'
        | 'password'
        | 'terms'
        | 'privacy'
        | 'lgpd'
        | 'licenses'
        | 'delete';
    };

export default function SettingsScreen() {
  // const router = useRouter(); // ❌ removido: não é usado
  const { user, logout, updateProfile, deleteAccount } = useAuth();

  const [modal, setModal] = useState<ModalState>({ key: null });
  const [loggingOut, setLoggingOut] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // valores exibidos vindos do backend
  const username = useMemo(() => user?.fullName ?? '—', [user]);
  const email = useMemo(() => user?.email ?? '—', [user]);
  const height = useMemo(
    () => (user?.height != null ? String(user.height) : '—'),
    [user]
  );
  const weight = useMemo(
    () => (user?.weight != null ? String(user.weight) : '—'),
    [user]
  );

  const open = (key: Exclude<ModalState['key'], null>) => setModal({ key });
  const close = () => setModal({ key: null });

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.bg}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Configurações</Text>

          {/* Informações do Perfil */}
          <SectionCard title='Informações do Perfil'>
            <RowItem
              label='Nome de Usuário'
              value={username}
              icon='pencil'
              variant='edit'
              onPress={() => open('username')}
            />
            <RowItem
              label='Email'
              value={email}
              icon='pencil'
              variant='edit'
              onPress={() => open('email')}
            />
            <RowItem
              label='Altura'
              value={height}
              icon='pencil'
              variant='edit'
              onPress={() => open('height')}
            />
            <RowItem
              label='Peso'
              value={weight}
              icon='pencil'
              variant='edit'
              onPress={() => open('weight')}
            />
            <RowItem
              label='Senha'
              value='Modifique sua senha'
              icon='pencil'
              variant='edit'
              onPress={() => open('password')}
              muted
            />
          </SectionCard>

          {/* Sobre */}
          <SectionCard title='Sobre'>
            <RowItem label='Versão do App' value='MindCare v1.0.0' />
            <RowItem
              label='Termos de Uso'
              value='Leia nossos termos de uso'
              icon='text-search-variant'
              variant='link'
              onPress={() => open('terms')}
              muted
            />
            <RowItem
              label='Política de Privacidade'
              value='Leia nossas políticas de privacidade'
              icon='text-search-variant'
              variant='link'
              onPress={() => open('privacy')}
              muted
            />
            <RowItem
              label='Tratamento de Dados Pessoais'
              value='Leia nossos termos de consentimento'
              icon='text-search-variant'
              variant='link'
              onPress={() => open('lgpd')}
              muted
            />
          </SectionCard>

          {/* Zona de Perigo */}
          <SectionCard title='Zona de Perigo' tone='danger'>
            <RowItem
              label='Excluir Conta'
              value='Exclui permanentemente sua conta'
              icon='close-circle-outline'
              variant='danger'
              onPress={() => open('delete')}
              muted
            />
          </SectionCard>

          <View style={styles.footer}>
            <Button
              onPress={async () => {
                try {
                  setLoggingOut(true);
                  await logout();
                } catch {
                  Alert.alert(
                    'Erro',
                    'Não foi possível sair. Tente novamente.'
                  );
                } finally {
                  setLoggingOut(false);
                }
              }}
              disabled={loggingOut}
            >
              {loggingOut ? <ActivityIndicator /> : <Text>Logout</Text>}
            </Button>
          </View>

          {saving && (
            <View style={styles.savingIndicator}>
              <ActivityIndicator />
            </View>
          )}
        </ScrollView>

        {/* ---- MODAIS DE EDIÇÃO ---- */}
        {/* Nome */}
        <EditFieldModal
          visible={modal.key === 'username'}
          title='Nome de Usuário'
          label='Nome de Usuário'
          placeholder='Digite o novo nome de usuário'
          value={user?.fullName ?? ''}
          onClose={close}
          onSubmit={async (val: string) => {
            try {
              setSaving(true);
              await updateProfile({ fullName: val });
              Alert.alert('Sucesso', 'Nome atualizado!');
            } catch (err: unknown) {
              const msg =
                getErrorMessage(err) || 'Não foi possível atualizar o nome.';
              Alert.alert('Erro', msg);
            } finally {
              setSaving(false);
              close();
            }
          }}
        />

        {/* Email */}
        <EditFieldModal
          visible={modal.key === 'email'}
          title='Email'
          label='Email'
          placeholder='Digite o novo email'
          keyboardType='email-address'
          value={user?.email ?? ''}
          onClose={close}
          onSubmit={async (val: string) => {
            try {
              setSaving(true);
              await updateProfile({ email: val });
              Alert.alert(
                'Sucesso',
                'Email atualizado! Você pode precisar entrar novamente.'
              );
            } catch (err: unknown) {
              const msg =
                getErrorMessage(err) || 'Não foi possível atualizar o email.';
              Alert.alert('Erro', msg);
            } finally {
              setSaving(false);
              close();
            }
          }}
        />

        {/* Altura */}
        <EditFieldModal
          visible={modal.key === 'height'}
          title='Altura'
          label='Altura'
          placeholder='Digite a nova altura (ex.: 1.75)'
          keyboardType='decimal-pad'
          value={user?.height != null ? String(user.height) : ''}
          onClose={close}
          onSubmit={async (val: string) => {
            try {
              setSaving(true);
              const parsed = Number(String(val).replace(',', '.'));
              await updateProfile({
                height: Number.isFinite(parsed) ? parsed : undefined,
              });
              Alert.alert('Sucesso', 'Altura atualizada!');
            } catch (err: unknown) {
              const msg =
                getErrorMessage(err) || 'Não foi possível atualizar a altura.';
              Alert.alert('Erro', msg);
            } finally {
              setSaving(false);
              close();
            }
          }}
        />

        {/* Peso */}
        <EditFieldModal
          visible={modal.key === 'weight'}
          title='Peso'
          label='Peso'
          placeholder='Digite o novo peso (ex.: 70.5)'
          keyboardType='decimal-pad'
          value={user?.weight != null ? String(user.weight) : ''}
          onClose={close}
          onSubmit={async (val: string) => {
            try {
              setSaving(true);
              const parsed = Number(String(val).replace(',', '.'));
              await updateProfile({
                weight: Number.isFinite(parsed) ? parsed : undefined,
              });
              Alert.alert('Sucesso', 'Peso atualizado!');
            } catch (err: unknown) {
              const msg =
                getErrorMessage(err) || 'Não foi possível atualizar o peso.';
              Alert.alert('Erro', msg);
            } finally {
              setSaving(false);
              close();
            }
          }}
        />

        {/* Senha */}
        <EditPasswordModal
          visible={modal.key === 'password'}
          onClose={close}
          onSubmit={async (pwd: string, confirmPwd: string) => {
            try {
              setSaving(true);
              await updateProfile({
                password: pwd,
                confirmPassword: confirmPwd,
              });
              Alert.alert('Sucesso', 'Senha atualizada!');
            } catch (err: unknown) {
              const msg =
                getErrorMessage(err) || 'Não foi possível atualizar a senha.';
              Alert.alert('Erro', msg);
            } finally {
              setSaving(false);
              close();
            }
          }}
        />

        {/* ---- POPUPS REAIS ---- */}
        <TermsOfUse visible={modal.key === 'terms'} onClose={close} />
        <PrivacyPolicy visible={modal.key === 'privacy'} onClose={close} />
        <PersonalDataLGPD visible={modal.key === 'lgpd'} onClose={close} />

        {/* ---- PLACEHOLDER LICENÇAS ---- */}
        <InfoModal
          visible={modal.key === 'licenses'}
          title='Licenças'
          message='Aqui você exibirá as bibliotecas e recursos utilizados.'
          onClose={close}
        />

        {/* ---- CONFIRMAÇÃO DE EXCLUSÃO ---- */}
        <ConfirmDeleteModal
          visible={modal.key === 'delete'}
          onClose={close}
          onConfirm={async () => {
            try {
              setDeleting(true);
              await deleteAccount(); // já redireciona para Login no contexto
            } catch (err: unknown) {
              const msg =
                getErrorMessage(err) || 'Não foi possível excluir a conta.';
              Alert.alert('Erro', msg);
              setDeleting(false);
            } finally {
              close();
            }
          }}
          loading={deleting}
        />
      </LinearGradient>
      <Navbar />
    </SafeAreaView>
  );
}

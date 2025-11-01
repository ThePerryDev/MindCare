import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import SectionCard from '@/components/SectionCard/SectionCard';
import RowItem from '@/components/RowItem/RowItem';
import Button from '@/components/Button/Button';
import EditFieldModal from '@/components/EditFieldModal/EditFieldModal';
import EditPasswordModal from '@/components/EditPasswordModal/EditPasswordModal';
import { styles } from './styles';
import { theme } from '@/styles/theme';

/** Modal simples interno só para placeholders de Termos/Licenças/Excluir */
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
        <Button onPress={onClose}>Fechar</Button>
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
        | 'licenses'
        | 'delete';
    };

export default function SettingsScreen() {
  const router = useRouter();

  // estados de exibição
  const [modal, setModal] = useState<ModalState>({ key: null });

  // estados de dados (placeholders locais até integrar API)
  const [username, setUsername] = useState('Robinson');
  const [email, setEmail] = useState('usuario@email.com');
  const [height, setHeight] = useState('1.75m');
  const [weight, setWeight] = useState('70kg');

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
              icon='edit-2'
              variant='edit'
              onPress={() => open('username')}
            />
            <RowItem
              label='Email'
              value={email}
              icon='edit-2'
              variant='edit'
              onPress={() => open('email')}
            />
            <RowItem
              label='Altura'
              value={height}
              icon='edit-2'
              variant='edit'
              onPress={() => open('height')}
            />
            <RowItem
              label='Peso'
              value={weight}
              icon='edit-2'
              variant='edit'
              onPress={() => open('weight')}
            />
            <RowItem
              label='Senha'
              value='Modifique sua senha'
              icon='edit-2'
              variant='edit'
              onPress={() => open('password')}
              muted
            />
          </SectionCard>

          {/* Sobre */}
          <SectionCard title='Sobre'>
            <RowItem label='Versão do App' value='MindCare v1.0.0' disabled />
            <RowItem
              label='Termos de Uso'
              value='Leia nossos termos de uso'
              icon='search'
              variant='link'
              onPress={() => open('terms')}
              muted
            />
            <RowItem
              label='Licenças'
              value='Bibliotecas e recursos utilizados'
              icon='search'
              variant='link'
              onPress={() => open('licenses')}
              muted
            />
          </SectionCard>

          {/* Zona de Perigo */}
          <SectionCard title='Zona de Perigo' tone='danger'>
            <RowItem
              label='Excluir Conta'
              value='Exclui permanentemente sua conta'
              icon='x-circle'
              variant='danger'
              onPress={() => open('delete')}
              muted
            />
          </SectionCard>

          <View style={styles.footer}>
            <Button
              onPress={() => router.replace('/screens/LoginScreen/LoginScreen')}
            >
              <Text>Logout</Text>
            </Button>
          </View>
        </ScrollView>

        {/* ---- MODAIS ---- */}
        <EditFieldModal
          visible={modal.key === 'username'}
          title='Nome de Usuário'
          label='Nome de Usuário'
          placeholder='Digite o novo nome de usuário'
          value={username}
          onClose={close}
          onSubmit={val => {
            setUsername(val);
            close();
          }}
        />

        <EditFieldModal
          visible={modal.key === 'email'}
          title='Email'
          label='Email'
          placeholder='Digite o novo email'
          keyboardType='email-address'
          value={email}
          onClose={close}
          onSubmit={val => {
            setEmail(val);
            close();
          }}
        />

        <EditFieldModal
          visible={modal.key === 'height'}
          title='Altura'
          label='Altura'
          placeholder='Digite a nova altura'
          keyboardType='decimal-pad'
          value={height}
          onClose={close}
          onSubmit={val => {
            setHeight(val);
            close();
          }}
        />

        <EditFieldModal
          visible={modal.key === 'weight'}
          title='Peso'
          label='Peso'
          placeholder='Digite o novo peso'
          keyboardType='decimal-pad'
          value={weight}
          onClose={close}
          onSubmit={val => {
            setWeight(val);
            close();
          }}
        />

        <EditPasswordModal
          visible={modal.key === 'password'}
          onClose={close}
          onSubmit={pwd => {
            // TODO: integrar mudança de senha
            close();
          }}
        />

        {/* Placeholders de info */}
        <InfoModal
          visible={modal.key === 'terms'}
          title='Termos de Uso'
          message='Aqui você exibirá os Termos de Uso (conteúdo real em breve).'
          onClose={close}
        />
        <InfoModal
          visible={modal.key === 'licenses'}
          title='Licenças'
          message='Aqui você exibirá as bibliotecas e recursos utilizados.'
          onClose={close}
        />
        <InfoModal
          visible={modal.key === 'delete'}
          title='Excluir conta'
          message='Confirmação de exclusão de conta (fluxo a implementar).'
          onClose={close}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

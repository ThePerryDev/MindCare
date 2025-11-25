// frontend/components/TermsOfUse/TermsOfUse.tsx

import React from 'react';
import { Modal, View, Text, ScrollView, Pressable } from 'react-native';
import CloseButton from '../CloseButton/CloseButton';
import { styles } from './styles';

interface TermsOfUseProps {
  visible: boolean;
  onClose: () => void;
}

export default function TermsOfUse({ visible, onClose }: TermsOfUseProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouchable} onPress={onClose} />

        <View style={styles.card} pointerEvents='box-none'>
          <View style={styles.header}>
            <Text style={styles.title}>Termos de Uso – MindCare</Text>
            <CloseButton onPress={onClose} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator
          >
            <Text style={styles.sectionTitle}>1. Aceitação dos Termos</Text>
            <Text style={styles.paragraph}>
              Ao usar o MindCare, você confirma que leu, entendeu e concorda com
              estes Termos de Uso. Caso não concorde, por favor não utilize o
              aplicativo.
            </Text>

            <Text style={styles.sectionTitle}>2. Objetivo do MindCare</Text>
            <Text style={styles.paragraph}>
              O MindCare oferece micro-hábitos de bem-estar de 5–10 minutos,
              check-ins de humor e sugestões de atividades personalizadas.
              Atenção: o app não substitui tratamento médico ou psicológico
              profissional.
            </Text>

            <Text style={styles.sectionTitle}>3. Conta do Usuário</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                {'\u2022'} Você deve fornecer informações corretas ao criar sua
                conta.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} É sua responsabilidade manter a senha em sigilo.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Contas podem ser suspensas em caso de uso indevido ou
                violação destes termos.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>4. Uso do Aplicativo</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                {'\u2022'} Não é permitido uso para fins ilegais.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Não faça upload de conteúdos ofensivos ou que
                infrinjam direitos de terceiros.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} O app pode exibir notificações para lembrar você de
                suas atividades.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>5. Direitos de Propriedade</Text>
            <Text style={styles.paragraph}>
              Todo o conteúdo, design e funcionalidades do MindCare são
              protegidos por direitos autorais e não podem ser copiados ou
              distribuídos sem permissão.
            </Text>

            <Text style={styles.sectionTitle}>6. Alterações nos Termos</Text>
            <Text style={styles.paragraph}>
              Podemos atualizar estes Termos de Uso periodicamente.
              Notificaremos você sobre mudanças relevantes dentro do aplicativo.
            </Text>

            <Text style={styles.sectionTitle}>7. Contato</Text>
            <Text style={styles.paragraph}>
              Em caso de dúvidas, entre em contato: suporte@mindcare.app
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

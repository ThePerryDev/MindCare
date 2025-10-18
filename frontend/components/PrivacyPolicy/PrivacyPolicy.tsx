import React from 'react';
import { Modal, View, Text, ScrollView, Pressable } from 'react-native';
import CloseButton from '../CloseButton/CloseButton';
import { styles } from './styles';

interface PrivacyPolicyProps {
  visible: boolean;
  onClose: () => void;
}

export default function PrivacyPolicy({
  visible,
  onClose,
}: PrivacyPolicyProps) {
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
            <Text style={styles.title}>Política de Privacidade – MindCare</Text>
            <CloseButton onPress={onClose} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator
          >
            <Text style={styles.sectionTitle}>1. Coleta de Dados</Text>
            <Text style={styles.paragraph}>
              O MindCare coleta apenas dados mínimos para funcionamento:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                {'\u2022'} Emojis e textos de humor (opcional).
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Dados de uso (quais atividades você conclui).
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} E-mail para cadastro.
              </Text>
            </View>
            <Text style={styles.paragraph}>
              Não coletamos dados sensíveis além do que você decidir registrar
              voluntariamente.
            </Text>

            <Text style={styles.sectionTitle}>2. Uso dos Dados</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                {'\u2022'} Personalizar recomendações e trilhas.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Gerar métricas de progresso (streaks e gráficos).
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Melhorar o desempenho do app de forma agregada.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>
              3. Compartilhamento de Dados
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                {'\u2022'} Não vendemos seus dados.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Compartilhamos apenas dados anonimizados para fins
                estatísticos e de melhoria do serviço.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>
              4. Armazenamento e Segurança
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                {'\u2022'} Seus dados são criptografados e armazenados em
                servidores seguros.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Você pode solicitar exclusão de conta e dados a
                qualquer momento.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>
              5. Direitos do Usuário (LGPD)
            </Text>
            <Text style={styles.paragraph}>Você tem direito de:</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                {'\u2022'} Acessar, corrigir ou excluir seus dados.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Revogar consentimento para uso dos dados.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Solicitar portabilidade das informações.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>
              6. Cookies e Tecnologias Semelhantes
            </Text>
            <Text style={styles.paragraph}>
              Utilizamos apenas cookies essenciais para manter sua sessão ativa.
            </Text>

            <Text style={styles.sectionTitle}>7. Contato de Privacidade</Text>
            <Text style={styles.paragraph}>
              Envie solicitações para: privacidade@mindcare.app
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

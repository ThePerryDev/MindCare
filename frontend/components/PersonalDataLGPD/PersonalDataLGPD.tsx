import React from 'react';
import { Modal, View, Text, ScrollView, Pressable } from 'react-native';
import CloseButton from '../CloseButton/CloseButton';
import { styles } from './styles';

interface PersonalDataLGPDProps {
  visible: boolean;
  onClose: () => void;
}

export default function PersonalDataLGPD({
  visible,
  onClose,
}: PersonalDataLGPDProps) {
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
            <Text style={styles.title}>
              Consentimento de Tratamento de Dados Pessoais (LGPD)
            </Text>
            <CloseButton onPress={onClose} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator
          >
            <Text style={styles.sectionTitle}>1. Finalidade do Tratamento</Text>
            <Text style={styles.paragraph}>
              O MindCare utiliza os seus dados pessoais exclusivamente para:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                {'\u2022'} Criar e gerenciar sua conta no aplicativo.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Registrar seu humor e progresso para fornecer
                recomendações personalizadas.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Melhorar o funcionamento e a experiência do
                aplicativo por meio de análises agregadas.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>2. Dados Coletados</Text>
            <Text style={styles.paragraph}>Podemos coletar:</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                {'\u2022'} Dados cadastrais: e-mail, nome (se informado).
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Dados de uso: trilhas acessadas, dias de uso,
                streaks.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Dados opcionais: check-ins de humor (texto ou emoji).
              </Text>
            </View>

            <Text style={styles.sectionTitle}>3. Base Legal</Text>
            <Text style={styles.paragraph}>
              O tratamento é realizado com base no seu consentimento explícito,
              conforme Art. 7º, I da LGPD.
            </Text>
            <Text style={styles.paragraph}>
              Você pode revogar esse consentimento a qualquer momento pelas
              configurações do app ou enviando um e-mail para{' '}
              privacidade@mindcare.app.
            </Text>

            <Text style={styles.sectionTitle}>
              4. Armazenamento e Segurança
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                {'\u2022'} Seus dados são armazenados em servidores seguros e
                criptografados.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Apenas pessoal autorizado tem acesso a eles.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Seus dados são mantidos apenas enquanto você utilizar
                o serviço ou até sua exclusão.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>5. Direitos do Titular</Text>
            <Text style={styles.paragraph}>
              De acordo com a LGPD, você tem direito a:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                {'\u2022'} Acessar seus dados pessoais.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Corrigir ou atualizar dados incorretos.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Solicitar exclusão ou portabilidade dos dados.
              </Text>
              <Text style={styles.bulletItem}>
                {'\u2022'} Obter informações sobre o compartilhamento (quando
                houver).
              </Text>
            </View>

            <Text style={styles.sectionTitle}>6. Exclusão de Dados</Text>
            <Text style={styles.paragraph}>
              Você pode solicitar a exclusão total de seus dados a qualquer
              momento. Após exclusão, não manteremos cópias identificáveis.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

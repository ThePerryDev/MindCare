/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Pressable,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import robsonImg from '../../../assets/images/robson.png';
import { styles, INPUT_HEIGHT, CHIPS_HEIGHT, INPUT_BOTTOM_GAP } from './styles';
import { classifyEmotion } from '@/services/emotionService';
import Button from '@/components/Button/Button';
import { MoodLabel } from '@/interfaces/feeling.interface';

// ------------------
// Tipagens
// ------------------
interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;

  // Metadados opcionais (preenchidos só pro bot)
  emotion?: string;
  emotionConfidence?: number;
  isCrisis?: boolean;
  crisisConfidence?: number;
}

// ------------------
// Mapa de empatia (usando os 4 sentimentos atuais)
// ------------------
const EMPATHY_TEXT_BY_MOOD: Record<MoodLabel, string> = {
  Ansiedade:
    'Entendo que você esteja se sentindo ansioso(a). Vamos com calma, estou aqui pra te ajudar a organizar esses pensamentos. Você consegue me contar um pouco do que está deixando você assim? 💜',
  Estresse:
    'Puxa, parece que você está bem sobrecarregado(a). Respira fundo comigo. Me conta um pouco do que anda tirando sua paz, para vermos como posso te ajudar. 💙',
  Felicidade:
    'Que bom saber que você está se sentindo feliz! 😄 Quero te ajudar a cuidar desse bem-estar também. Me conta: o que deixou seu dia melhor hoje?',
  Tristeza:
    'Sinto muito que você esteja se sentindo triste. Não é fácil passar por isso, mas você não está sozinho(a). Se puder, me conta um pouco do que aconteceu. 💙',
};

// ------------------
// Componente principal
// ------------------
export default function ChatBotScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Captura o humor vindo da tela anterior (MoodScreen / CheckOutMoodScreen)
  const { mood, emoji } = useLocalSearchParams<{
    mood?: MoodLabel;
    emoji?: string;
  }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);

  const [showEmotionCard, setShowEmotionCard] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  // Scroll automático para o final
  const scrollToEnd = useCallback(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, []);

  // Listener de teclado
  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      setTimeout(scrollToEnd, 80);
    });
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [scrollToEnd]);

  // Função para adicionar mensagens
  const append = useCallback(
    (message: Message): void => {
      setMessages(prev => [...prev, message]);
      setTimeout(scrollToEnd, 80);
    },
    [scrollToEnd]
  );

  // Mensagens iniciais — reage ao humor recebido (entrada ou saída)
  useEffect(() => {
    const base: Message[] = [
      {
        id: '1',
        text: 'Olá! Sou o MindBot, seu assistente de bem-estar. 💬',
        sender: 'bot',
        timestamp: new Date(),
      },
    ];

    if (mood) {
      const lowerMood = mood.toLowerCase();

      // 2) Bot reconhece o sentimento informado
      base.push({
        id: '2',
        text: `${emoji ?? ''} Entendi, você está se sentindo ${lowerMood}.`,
        sender: 'bot',
        timestamp: new Date(),
      });

      // 3) Mensagem empática + convite pra explicar melhor
      const empathy =
        EMPATHY_TEXT_BY_MOOD[mood] ||
        'Obrigado por compartilhar como você está se sentindo. Se puder, me conta um pouco mais sobre o que está acontecendo.';

      base.push({
        id: '3',
        text: empathy,
        sender: 'bot',
        timestamp: new Date(),
      });
    }

    setMessages(base);
  }, [mood, emoji]);

  // Envio de mensagens manuais (primeira mensagem livre vai para a API)
  const handleSend = useCallback(async (): Promise<void> => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    // 1) Mensagem do usuário
    const userMsg: Message = {
      id: Date.now().toString(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    append(userMsg);
    setInputText('');

    try {
      // 2) Chama a API de classificação de emoções (FastAPI)
      const res = await classifyEmotion(trimmed);

      // 3) Monte a mensagem do bot com texto + metadados
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: res.mensagem_para_usuario,
        sender: 'bot',
        timestamp: new Date(),
        emotion: res.emocao,
        emotionConfidence: res.confianca_emocao,
        isCrisis: res.risco_crise,
        crisisConfidence: res.confianca_crise,
      };

      append(botMsg);
    } catch (error) {
      console.error('Erro ao chamar a API de emoções:', error);
      // fallback amigável em caso de erro na API
      append({
        id: (Date.now() + 2).toString(),
        text:
          'Desculpe, tive um problema para analisar sua mensagem agora. ' +
          'Você pode tentar novamente em instantes?',
        sender: 'bot',
        timestamp: new Date(),
      });
    }
  }, [inputText, append]);

  // Padding inferior dinâmico
  const contentBottomPad = isKeyboardVisible
    ? INPUT_HEIGHT + 16
    : INPUT_HEIGHT + CHIPS_HEIGHT + 32 + INPUT_BOTTOM_GAP;

  // ------------------
  // Render
  // ------------------
  return (
    <SafeAreaView style={styles.background} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* (pode virar botão de voltar futuramente, por enquanto só está aí) */}
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          activeOpacity={0.9}
        >
          <Text style={styles.sendButtonIcon}>➤</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>MindBot</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>

        <View style={styles.headerRight}>
          <Image
            source={robsonImg}
            style={styles.headerAvatar}
            resizeMode='cover'
          />
        </View>
      </View>

      {/* CONTEÚDO */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top - 60}
      >
        <View style={styles.chatContainer}>
          {/* MENSAGENS */}
          <ScrollView
            ref={scrollRef}
            style={styles.messagesContainer}
            contentContainerStyle={[
              styles.messagesContent,
              { paddingBottom: contentBottomPad },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            onContentSizeChange={scrollToEnd}
          >
            {messages.map(message => {
              const isUser = message.sender === 'user';
              return (
                <View
                  key={message.id}
                  style={[
                    styles.row,
                    isUser ? styles.rowRight : styles.rowLeft,
                  ]}
                >
                  {!isUser && (
                    <View style={styles.botAvatarSmall}>
                      <Image
                        source={robsonImg}
                        style={styles.headerAvatar}
                        resizeMode='cover'
                      />
                    </View>
                  )}

                  <View
                    style={[
                      styles.bubble,
                      isUser ? styles.userBubble : styles.botBubble,
                    ]}
                  >
                    <Text style={isUser ? styles.userText : styles.botText}>
                      {message.text}
                    </Text>

                    {/* Metadados só para mensagens do bot */}
                    {!isUser &&
                      (message.emotion || message.isCrisis !== undefined) && (
                        <Text style={styles.metaInfoText}>
                          {`[emoção: ${message.emotion ?? 'n/a'} | crise: ${
                            message.isCrisis ? 'SIM' : 'não'
                          }]`}
                        </Text>
                      )}

                    {/* Botão de "Trilha Sugerida" para emoções conhecidas */}
                    {!isUser &&
                      [
                        'felicidade',
                        'tristeza',
                        'ansiedade',
                        'estresse',
                      ].includes(message.emotion ?? '') && (
                        <Button
                          onPress={() => {
                            setSelectedEmotion(message.emotion ?? null);
                            setShowEmotionCard(true);
                          }}
                        >
                          <Text>Trilha Sugerida</Text>
                        </Button>
                      )}
                  </View>

                  {isUser && (
                    <View style={styles.userAvatarSmall}>
                      <Text style={styles.userAvatarSmallIcon}>R</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Modal com emoção detectada (futuro: sugerir trilha específica) */}
          {showEmotionCard && (
            <Modal
              transparent
              visible={showEmotionCard}
              animationType='fade'
              onRequestClose={() => setShowEmotionCard(false)}
            >
              {/* Área de fundo para fechar o modal ao tocar */}
              <Pressable
                style={styles.infoBackdrop}
                onPress={() => setShowEmotionCard(false)}
              />

              <View style={[styles.infoSheet, styles.sessionModalCard]}>
                <View style={styles.sessionTopRow}>
                  <Text style={styles.sessionDayText}>Emoção detectada</Text>

                  <TouchableOpacity
                    onPress={() => setShowEmotionCard(false)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <View style={styles.modalCloseIcon}>
                      <MaterialCommunityIcons
                        name='close'
                        size={18}
                        color='#7B6AFB'
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.sessionDivider} />

                <View style={styles.sessionHeaderCenter}>
                  <LinearGradient
                    colors={['#6C4FF6', '#9A4DFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sessionIconCircle}
                  >
                    <Text style={styles.sessionIconText}>
                      {selectedEmotion?.charAt(0).toUpperCase()}
                    </Text>
                  </LinearGradient>

                  <Text style={styles.sessionTitle}>{selectedEmotion}</Text>

                  <Text style={styles.sessionDescription}>
                    Em breve iremos sugerir trilhas com base em como você está
                    se sentindo 💜
                  </Text>
                </View>

                <View style={{ marginTop: 20 }}>
                  <TouchableOpacity
                    onPress={() => setShowEmotionCard(false)}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.sessionCompleteButton}
                    >
                      <Text style={styles.sessionCompleteButtonText}>
                        Fechar
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          {/* CHIPS */}
          {!isKeyboardVisible && (
            <View style={styles.chipsBar}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickRepliesContent}
                keyboardShouldPersistTaps='handled'
              >
                <TouchableOpacity
                  style={styles.quickReply}
                  onPress={() => router.push('/trails')}
                >
                  <Text style={styles.quickReplyText}>Ver trilhas</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickReply}
                  onPress={() => router.push('/trails')}
                >
                  <Text style={styles.quickReplyText}>Como funciona?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickReply}
                  onPress={() => router.push('/trails')}
                >
                  <Text style={styles.quickReplyText}>Preciso de ajuda</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}

          {/* INPUT */}
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder='Digite sua mensagem...'
                placeholderTextColor='#94A3B8'
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                onFocus={() => setKeyboardVisible(true)}
                onBlur={() => setKeyboardVisible(false)}
              />
            </View>

            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              activeOpacity={0.9}
            >
              <Text style={styles.sendButtonIcon}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

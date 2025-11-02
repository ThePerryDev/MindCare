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
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styles, INPUT_HEIGHT, CHIPS_HEIGHT, INPUT_BOTTOM_GAP } from './styles';
import robsonImg from '../../../assets/images/robson.png';

// ------------------
// Tipagens
// ------------------
interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

type MoodLabel =
  | 'Muito Feliz'
  | 'Irritado'
  | 'Neutro'
  | 'Triste'
  | 'Muito Triste';

// ------------------
// Mapa de empatia
// ------------------
const EMPATHY_TEXT_BY_MOOD: Record<MoodLabel, string> = {
  'Muito Feliz':
    'Que bom saber que você está se sentindo feliz! Vamos aproveitar essa energia positiva hoje! 💫',
  Irritado:
    'Entendo que você esteja irritado. Respira fundo comigo — posso te ajudar com algo para aliviar isso?',
  Neutro:
    'Tudo bem, um dia neutro também é um bom dia. Que tal explorar algo leve para melhorar seu humor?',
  Triste:
    'Sinto muito que esteja se sentindo triste. Estou aqui pra te ajudar a aliviar isso um pouquinho. 💙',
  'Muito Triste':
    'Sei que é difícil se sentir assim. Você não está sozinha. Vamos dar um pequeno passo juntos agora. ❤️',
};

// ------------------
// Componente principal
// ------------------
export default function ChatBotScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Captura o humor vindo da tela anterior (MoodScreen)
  const { mood, emoji } = useLocalSearchParams<{
    mood?: MoodLabel;
    emoji?: string;
  }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);

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

  // Mensagens iniciais — reage ao humor recebido
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        text: 'Olá! Sou o MindBot, seu assistente de bem-estar. 💬',
        sender: 'bot',
        timestamp: new Date(),
      },
    ];

    if (mood) {
      initialMessages.push({
        id: '2',
        text: `${emoji ?? ''} Entendi, você está se sentindo ${mood.toLowerCase()}.`,
        sender: 'user',
        timestamp: new Date(),
      });

      initialMessages.push({
        id: '3',
        text: EMPATHY_TEXT_BY_MOOD[mood],
        sender: 'bot',
        timestamp: new Date(),
      });
    }

    setMessages(initialMessages);
  }, [mood, emoji]);

  // Envio de mensagens manuais
  const handleSend = useCallback((): void => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    append(userMsg);
    setInputText('');

    setTimeout(() => {
      append({
        id: (Date.now() + 1).toString(),
        text: 'Posso te sugerir uma trilha breve agora mesmo. Quer ver?',
        sender: 'bot',
        timestamp: new Date(),
      });
    }, 600);
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name='chevron-back' size={24} color='#4C46B6' />
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

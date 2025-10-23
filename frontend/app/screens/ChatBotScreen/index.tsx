/* global setTimeout */
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import robsonImg from '../../../assets/images/robson.png';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export default function ChatBotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o MindBot, seu assistente de bem-estar. Como você está se sentindo hoje?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);

  const quickReplies = useRef<string[]>([
    'Ver trilhas',
    'Como funciona?',
    'Preciso de Ajuda',
    'Obrigado',
  ]).current;

  const scrollToEnd = useCallback(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, []);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      setTimeout(scrollToEnd, 100);
    });

    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [scrollToEnd]);

  const append = useCallback(
    (message: Message): void => {
      setMessages(prev => [...prev, message]);
      setTimeout(scrollToEnd, 100);
    },
    [scrollToEnd]
  );

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
        text: 'Entendi! Posso te sugerir uma trilha breve para aliviar agora mesmo. Quer ver?',
        sender: 'bot',
        timestamp: new Date(),
      });
    }, 600);
  }, [inputText, append]);

  const handleQuickReply = useCallback(
    (reply: string): void => {
      append({
        id: Date.now().toString(),
        text: reply,
        sender: 'user',
        timestamp: new Date(),
      });
    },
    [append]
  );

  // ✅ remove inline style warning
  const contentContainerStyle = [
    styles.messagesContent,
    { paddingBottom: isKeyboardVisible ? 20 : 80 },
  ];

  return (
    <SafeAreaView style={styles.background} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
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
        keyboardVerticalOffset={-50}
      >
        <View style={styles.chatContainer}>
          <ScrollView
            ref={scrollRef}
            style={styles.messagesContainer}
            contentContainerStyle={contentContainerStyle}
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

          {/* INPUT AREA */}
          <View style={styles.inputArea}>
            <View style={styles.quickRepliesContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickRepliesContent}
                keyboardShouldPersistTaps='handled'
              >
                {quickReplies.map(label => (
                  <TouchableOpacity
                    key={label}
                    style={styles.quickReply}
                    onPress={() => handleQuickReply(label)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.quickReplyText}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* global setTimeout */
import React, { useEffect, useRef, useState } from 'react';
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
    {
      id: '2',
      text: 'Oi! Estou me sentindo um pouco ansioso hoje..',
      sender: 'user',
      timestamp: new Date(),
    },
    {
      id: '3',
      text: 'Entendo que você está se sentindo ansioso. A ansiedade pode ser desafiadora, mas você não está sozinha. Vamos trabalhar juntos para encontrar estratégias que te ajudem.',
      sender: 'bot',
      timestamp: new Date(),
    },
    {
      id: '4',
      text: 'Baseado no que você compartilhou, tenho algumas trilhas que podem te ajudar. Gostaria de ver as recomendações? ✨',
      sender: 'bot',
      timestamp: new Date(),
    },
    {
      id: '5',
      text: 'Sim, por favor! Preciso de ajuda para lidar com isso.',
      sender: 'user',
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const quickReplies = [
    'Ver trilhas',
    'Como funciona?',
    'Preciso de Ajuda',
    'Obrigado',
  ];
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    });
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const append = (m: Message) => {
    setMessages(prev => [...prev, m]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    append({
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    });
    setInputText('');

    setTimeout(() => {
      append({
        id: (Date.now() + 1).toString(),
        text: 'Entendi! Posso te sugerir uma trilha breve para aliviar agora mesmo. Quer ver?',
        sender: 'bot',
        timestamp: new Date(),
      });
    }, 600);
  };

  const handleQuickReply = (reply: string) => {
    append({
      id: Date.now().toString(),
      text: reply,
      sender: 'user',
      timestamp: new Date(),
    });
  };

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
        keyboardVerticalOffset={Platform.OS === 'ios' ? -50 : -50}
      >
        <View style={styles.chatContainer}>
          {/* MENSAGENS */}
          <ScrollView
            ref={scrollRef}
            style={styles.messagesContainer}
            contentContainerStyle={[
              styles.messagesContent,
              { paddingBottom: isKeyboardVisible ? 20 : 80 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({ animated: true })
            }
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
                      <Text style={styles.botAvatarSmallIcon}>
                        <View style={styles.headerRight}>
                          <Image
                            source={robsonImg}
                            style={styles.headerAvatar}
                            resizeMode='cover'
                          />
                        </View>
                      </Text>
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

          {/* ÁREA DE INPUT FIXA */}
          <View style={styles.inputArea}>
            {/* QUICK REPLIES */}
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

        {!isKeyboardVisible}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

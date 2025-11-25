// frontend/app/ChatBotScreen/index.tsx
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
import dayjs from 'dayjs';

import robsonImg from '../../../assets/images/robson.png';
import { styles, INPUT_HEIGHT, CHIPS_HEIGHT, INPUT_BOTTOM_GAP } from './styles';
import { classifyEmotion } from '@/services/emotionService';
import Button from '@/components/Button/Button';
import { MoodLabel } from '@/interfaces/feeling.interface';
import {
  ITrail,
  IRecommendedTrailsResponse,
} from '@/interfaces/trail.interface';
import { fetchRecommendedTrailsByFeeling } from '@/services/trail';
import { registrarSentimentoBot } from '@/services/feelingBot';

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
// Mapa emoção (API) -> MoodLabel / FeelingValue
// A API costuma mandar em minúsculas: 'ansiedade', 'tristeza', 'felicidade', 'estresse'
// ------------------
const EMOTION_TO_MOOD_LABEL: Record<string, MoodLabel> = {
  ansiedade: 'Ansiedade',
  estresse: 'Estresse',
  stress: 'Estresse',
  felicidade: 'Felicidade',
  alegria: 'Felicidade',
  tristeza: 'Tristeza',
  triste: 'Tristeza',
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

  // Estado do modal de recomendação de trilhas
  const [showEmotionCard, setShowEmotionCard] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [mappedFeeling, setMappedFeeling] = useState<MoodLabel | null>(null);
  const [recommendedTrails, setRecommendedTrails] = useState<ITrail[]>([]);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(
    null
  );

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

      // Bot reconhece o sentimento informado
      base.push({
        id: '2',
        text: `${emoji ?? ''} Entendi, você está se sentindo ${lowerMood}.`,
        sender: 'bot',
        timestamp: new Date(),
      });

      // Mensagem empática + convite pra explicar melhor
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

      // 2.1) Registra o sentimento do BOT no backend (FeelingBotModel)
      try {
        const today = dayjs().format('YYYY-MM-DD');

        await registrarSentimentoBot({
          day: today,
          sentimento: res.emocao,
          // opcional, só para exibição amigável futura
          label: dayjs().format('DD/MM/YYYY'),
        });
      } catch (err) {
        console.error(
          '⚠️ [ChatBot] Falha ao registrar sentimento do bot:',
          err
        );
      }

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

  // Abre o modal e carrega trilhas recomendadas a partir da emoção detectada
  const handleOpenRecommendation = useCallback(
    async (emotionRaw?: string | null) => {
      if (!emotionRaw) return;

      const key = emotionRaw.toLowerCase();
      const feeling = EMOTION_TO_MOOD_LABEL[key] ?? null;

      console.log('🟣 [ChatBot] Abrindo recomendação para emoção:', {
        emotionRaw,
        key,
        feeling,
      });

      setSelectedEmotion(emotionRaw);
      setMappedFeeling(feeling);
      setShowEmotionCard(true);
      setRecommendedTrails([]);
      setRecommendationError(null);

      // Se não temos mapeamento ainda, apenas mostra um texto genérico
      if (!feeling) {
        setRecommendationError(
          'Ainda não sei sugerir trilhas específicas para essa emoção, mas você pode explorar todas na tela de Trilhas. 💜'
        );
        return;
      }

      try {
        setLoadingRecommendation(true);
        const resp: IRecommendedTrailsResponse =
          await fetchRecommendedTrailsByFeeling(feeling);

        setRecommendedTrails(resp.recommended ?? []);
      } catch (err) {
        console.error('🔴 [ChatBot] Erro ao buscar trilhas recomendadas:', err);
        setRecommendationError(
          'Tive um problema para buscar trilhas recomendadas agora. Tente novamente em instantes.'
        );
      } finally {
        setLoadingRecommendation(false);
      }
    },
    []
  );

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
        {/* por enquanto botão de "enviar" reaproveitado aqui */}
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
              const emotionKey = (message.emotion ?? '').toLowerCase();
              const isKnownEmotion = [
                'felicidade',
                'tristeza',
                'ansiedade',
                'estresse',
              ].includes(emotionKey);

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
                    {!isUser && isKnownEmotion && (
                      <View style={{ marginTop: 8 }}>
                        <Button
                          onPress={() =>
                            handleOpenRecommendation(message.emotion)
                          }
                        >
                          <Text>Trilha sugerida para esse momento</Text>
                        </Button>
                      </View>
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

          {/* Modal com emoção detectada + trilhas recomendadas */}
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
                      {(mappedFeeling ?? selectedEmotion ?? '?')
                        .charAt(0)
                        .toUpperCase()}
                    </Text>
                  </LinearGradient>

                  <Text style={styles.sessionTitle}>
                    {mappedFeeling
                      ? `Trilhas para ${mappedFeeling}`
                      : selectedEmotion}
                  </Text>

                  <Text style={styles.sessionDescription}>
                    {mappedFeeling
                      ? 'Encontrei algumas trilhas que podem ajudar você com esse sentimento. 💜'
                      : 'Ainda não sei mapear essa emoção diretamente para uma trilha específica, mas você pode explorar as trilhas disponíveis.'}
                  </Text>
                </View>

                {/* Conteúdo: estados de carregamento / erro / lista */}
                <View style={{ marginTop: 16 }}>
                  {loadingRecommendation && (
                    <Text style={styles.sessionDescription}>
                      Carregando trilhas recomendadas...
                    </Text>
                  )}

                  {!loadingRecommendation && recommendationError && (
                    <Text
                      style={[styles.sessionDescription, { color: '#DC2626' }]}
                    >
                      {recommendationError}
                    </Text>
                  )}

                  {!loadingRecommendation &&
                    !recommendationError &&
                    mappedFeeling &&
                    recommendedTrails.length === 0 && (
                      <Text style={styles.sessionDescription}>
                        Ainda não há trilhas específicas cadastradas para esse
                        sentimento, mas você pode explorar todas na tela de
                        Trilhas. 💜
                      </Text>
                    )}

                  {!loadingRecommendation &&
                    !recommendationError &&
                    recommendedTrails.length > 0 && (
                      <View>
                        {recommendedTrails.map(trail => (
                          <View
                            key={trail.id}
                            style={{
                              paddingVertical: 10,
                              paddingHorizontal: 12,
                              borderRadius: 12,
                              backgroundColor: '#F5F3FF',
                              marginBottom: 8,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: 'System',
                                fontWeight: '600',
                                color: '#312E81',
                                fontSize: 15,
                                marginBottom: 4,
                              }}
                            >
                              {trail.nome}
                            </Text>

                            {trail.descricao ? (
                              <Text
                                style={{
                                  color: '#4B5563',
                                  fontSize: 13,
                                  marginBottom: 8,
                                }}
                              >
                                {trail.descricao}
                              </Text>
                            ) : null}

                            {mappedFeeling && (
                              <Text
                                style={{
                                  color: '#6D28D9',
                                  fontSize: 12,
                                  marginBottom: 8,
                                }}
                              >
                                Focada em {mappedFeeling}
                              </Text>
                            )}

                            {/* Botão para abrir a tela de trilhas já no detalhe */}
                            <TouchableOpacity
                              activeOpacity={0.9}
                              onPress={() => {
                                setShowEmotionCard(false);
                                router.push({
                                  pathname: '/trails',
                                  params: {
                                    trailId: String(trail.trailId),
                                  },
                                });
                              }}
                              style={{
                                paddingVertical: 8,
                                borderRadius: 999,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#6D28D9',
                              }}
                            >
                              <Text
                                style={{
                                  color: '#F9FAFB',
                                  fontWeight: '600',
                                  fontSize: 13,
                                }}
                              >
                                Ver detalhes da trilha
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                </View>

                {/* Botões de ação gerais */}
                <View style={{ marginTop: 20 }}>
                  {/* Ver trilha recomendada */}
                  <TouchableOpacity
                    onPress={() => {
                      if (selectedEmotion) {
                        router.push({
                          pathname: '/trails',
                          params: {
                            emotion: selectedEmotion, // ex.: 'tristeza', 'ansiedade'...
                            autoStart: '1',
                          },
                        });
                        setShowEmotionCard(false);
                      }
                    }}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.sessionCompleteButton}
                    >
                      <Text style={styles.sessionCompleteButtonText}>
                        Ver trilha recomendada
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Ver todas as trilhas */}
                  <TouchableOpacity
                    onPress={() => {
                      router.push('/trails');
                      setShowEmotionCard(false);
                    }}
                    activeOpacity={0.9}
                    style={styles.sessionSecondaryButton}
                  >
                    <Text style={styles.sessionSecondaryButtonText}>
                      Ver todas as trilhas
                    </Text>
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

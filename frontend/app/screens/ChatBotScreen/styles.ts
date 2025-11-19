import { StyleSheet } from 'react-native';

export const INPUT_HEIGHT = 56;
export const CHIPS_HEIGHT = 44;

// ⬇ folga fixa para “subir” o input mesmo SEM teclado
export const INPUT_BOTTOM_GAP = 40;

export const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },

  background: {
    backgroundColor: '#F4EFFF',
    flex: 1,
  },

  botAvatarSmall: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 18,
    height: 32,
    justifyContent: 'center',
    marginRight: 8,
    overflow: 'hidden',
    width: 32,
  },

  botAvatarSmallIcon: { fontSize: 16 },

  botBubble: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 4,
  },

  botText: {
    color: '#0F172A',
    fontSize: 14.5,
    lineHeight: 20,
  },

  bubble: {
    borderRadius: 16,
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  chatContainer: {
    backgroundColor: 'transparent',
    flex: 1,
  },

  chipsBar: {
    backgroundColor: '#F4EFFF',
    height: CHIPS_HEIGHT,
    paddingHorizontal: 12,
  },

  flex: { flex: 1 },

  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 30,
  },

  headerAvatar: {
    borderRadius: 18,
    height: '100%',
    width: '100%',
  },

  headerCenter: { alignItems: 'center' },

  headerRight: {
    borderRadius: 18,
    height: 36,
    overflow: 'hidden',
    width: 36,
  },

  headerStatus: {
    color: '#6C63FF',
    fontSize: 12,
    fontWeight: '500',
  },

  headerTitle: {
    color: '#4C46B6',
    fontSize: 18,
    fontWeight: '700',
  },

  input: {
    color: '#0F172A',
    fontSize: 14.5,
    maxHeight: 110,
  },

  inputRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 10,
    marginBottom: INPUT_BOTTOM_GAP, // ✅ agora vem antes de paddingTop
    paddingHorizontal: 12,
    paddingTop: 8,
  },

  inputWrapper: {
    backgroundColor: '#FFF',
    borderColor: '#E2E8F0',
    borderRadius: 24,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: INPUT_HEIGHT,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  messagesContent: {
    gap: 10,
    paddingTop: 10,
  },

  metaInfoText: {
    color: '#6B7280',
    fontSize: 10,
    marginTop: 4,
  },

  quickRepliesContent: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },

  quickReply: {
    backgroundColor: '#D6F0F0',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  quickReplyText: {
    color: '#4C46B6',
    fontSize: 13,
    fontWeight: '600',
  },

  row: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },

  rowLeft: { justifyContent: 'flex-start' },

  rowRight: { justifyContent: 'flex-end' },

  sendButton: {
    alignItems: 'center',
    backgroundColor: '#4C46B6',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },

  sendButtonIcon: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },

  userAvatarSmall: {
    alignItems: 'center',
    backgroundColor: '#4C46B6',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    marginLeft: 8,
    width: 32,
  },

  userAvatarSmallIcon: {
    color: '#FFF',
    fontWeight: '700',
  },

  userBubble: {
    backgroundColor: '#4C46B6',
    borderTopRightRadius: 4,
  },

  userText: {
    color: '#FFF',
    fontSize: 14.5,
    lineHeight: 20,
  },
});

export default styles;

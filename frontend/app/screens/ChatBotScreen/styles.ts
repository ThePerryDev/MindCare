import { theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const INPUT_HEIGHT = 56;
export const CHIPS_HEIGHT = 44;

// ⬇ folga fixa para “subir” o input mesmo SEM teclado
export const INPUT_BOTTOM_GAP = 40;

export const styles = StyleSheet.create({
  activityModalBullet: {
    backgroundColor: '#6C4FF6',
    borderRadius: 3,
    height: 6,
    marginRight: 8,
    marginTop: 6,
    width: 6,
  },

  activityModalCard: {
    paddingHorizontal: 20,
    paddingVertical: 22,
  },

  activityModalDescription: {
    color: '#6C6A8A',
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    marginBottom: 8,
  },

  activityModalDivider: {
    backgroundColor: '#EEE9FF',
    height: 1,
    marginBottom: 12,
  },

  activityModalSectionTitle: {
    color: '#4C46B6',
    fontFamily: theme.fonts.semi,
    fontSize: 14,
    marginBottom: 6,
    marginTop: 6,
  },

  activityModalSubtitle: {
    color: '#8C8CA3',
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    marginBottom: 10,
  },

  activityModalTipRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 4,
  },

  activityModalTipText: {
    color: '#4F4F70',
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 13,
  },

  activityModalTitle: {
    color: '#2C2C4E',
    fontFamily: theme.fonts.semi,
    fontSize: 17,
  },

  activityModalTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

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

  bg: { flex: 1 },

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

  completionButton: {
    backgroundColor: '#6C4FF6',
    borderRadius: 999,
    marginTop: 8,
    paddingHorizontal: 32,
    paddingVertical: 10,
  },

  completionButtonText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.semi,
    fontSize: 15,
    textAlign: 'center',
  },

  completionContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  completionGradient: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 72,
    paddingHorizontal: 24,
  },

  completionImage: {
    height: 220,
    marginBottom: 32,
    resizeMode: 'contain',
    width: 220,
  },

  completionSafe: {
    backgroundColor: 'transparent',
    flex: 1,
  },

  completionSubtitle: {
    color: '#7A5DF5',
    fontFamily: theme.fonts.semi,
    fontSize: 16,
    marginBottom: 24,
    marginHorizontal: 16,
    textAlign: 'center',
  },

  completionTitle: {
    color: '#7745D8',
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },

  content: {
    padding: 20,
    paddingBottom: 70,
  },

  durationText: {
    color: '#8C8CA3',
    fontFamily: theme.fonts.regular,
    fontSize: 12,
  },

  flex: { flex: 1 },

  footer: { marginTop: 14 },

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
  infoBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  infoSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    elevation: 8,
    left: 16,
    padding: 16,
    position: 'absolute',
    right: 16,
    shadowColor: '#5B6BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    top: '18%',
  },
  infoText: {
    color: '#4C46B6',
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    textAlign: 'center',
  },
  infoTitle: {
    color: '#4C46B6',
    fontFamily: theme.fonts.semi,
    fontSize: 18,
    textAlign: 'center',
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
  levelBadge: {
    backgroundColor: '#E0F8EA',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  levelBadgeText: {
    color: '#22A35B',
    fontFamily: theme.fonts.semi,
    fontSize: 11,
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
  modalActionButton: {
    alignItems: 'center',
    borderRadius: 999,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  modalActionButtonText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.semi,
    fontSize: 15,
  },
  modalActionWrapper: {
    marginTop: 18,
  },
  modalActivityTitle: {
    color: '#4C46B6',
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    marginBottom: 8,
  },
  modalBenefitCheck: {
    color: '#1BAA5C',
    fontSize: 16,
    marginRight: 6,
    marginTop: 1,
  },
  modalBenefitRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 4,
  },
  modalBenefitText: {
    color: '#4F4F70',
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
  },
  modalBenefitsTitle: {
    color: '#4C46B6',
    fontFamily: theme.fonts.semi,
    fontSize: 14,
    marginBottom: 8,
  },
  modalCard: {
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  modalCloseIcon: {
    alignItems: 'center',
    borderColor: '#E0D8FF',
    borderRadius: 14,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  modalDescription: {
    color: '#6C6A8A',
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    marginBottom: 16,
  },
  modalDivider: {
    backgroundColor: '#EEE9FF',
    height: 1,
    marginBottom: 16,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  modalText: {
    color: '#4C46B6',
    fontFamily: theme.fonts.regular,
    fontSize: 14,
  },
  modalTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTrackTitle: {
    color: '#2C2C4E',
    fontFamily: theme.fonts.semi,
    fontSize: 16,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#6C4FF6',
    borderRadius: 999,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  primaryButtonCompleted: {
    backgroundColor: '#18C37D',
  },
  primaryButtonDisabled: {
    backgroundColor: '#D1D4DE',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.semi,
    fontSize: 14,
  },
  primaryButtonTextDisabled: {
    color: '#F5F5F7',
  },
  progressLabel: {
    color: '#4F4F70',
    fontFamily: theme.fonts.regular,
    fontSize: 13,
  },
  progressPercent: {
    color: '#4F4F70',
    fontFamily: theme.fonts.semi,
    fontSize: 13,
  },
  progressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  safe: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  savingIndicator: {
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDDFF0',
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  secondaryButtonDisabled: {
    backgroundColor: '#F3F4FA',
  },
  secondaryButtonText: {
    color: '#4C46B6',
    fontFamily: theme.fonts.semi,
    fontSize: 14,
  },
  secondaryButtonTextDisabled: {
    color: '#B0B4C5',
  },
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
  sessionActivityCard: {
    backgroundColor: '#F7F5FF',
    borderRadius: 14,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sessionActivityIcon: {
    backgroundColor: '#7D8CFF',
    borderRadius: 12,
    height: 32,
    marginRight: 10,
    width: 32,
  },
  sessionActivityLeft: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  sessionActivitySubtitle: {
    color: '#7A7A99',
    fontFamily: theme.fonts.regular,
    fontSize: 12,
  },
  sessionActivityTextBlock: {
    flex: 1,
  },
  sessionActivityTitle: {
    color: '#2C2C4E',
    fontFamily: theme.fonts.semi,
    fontSize: 14,
    marginBottom: 2,
  },
  sessionCompleteButton: {
    alignItems: 'center',
    borderRadius: 999,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  sessionCompleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sessionCompleteWrapper: {
    alignItems: 'center',
    marginTop: 16,
  },
  sessionControlButton: {
    alignItems: 'center',
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  sessionControlsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 32,
    justifyContent: 'center',
  },
  sessionDayText: {
    color: '#2C2C4E',
    fontFamily: theme.fonts.semi,
    fontSize: 16,
  },
  sessionDescription: {
    color: '#6C6A8A',
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    textAlign: 'center',
  },
  sessionDivider: {
    backgroundColor: '#EEE9FF',
    height: 1,
    marginBottom: 20,
  },
  sessionDurationText: {
    color: '#8C8CA3',
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    marginBottom: 8,
  },
  sessionHeaderCenter: {
    alignItems: 'center',
    marginBottom: 18,
  },
  sessionIconCircle: {
    alignItems: 'center',
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    marginBottom: 12,
    width: 56,
  },
  sessionIconText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.bold,
    fontSize: 18,
  },
  sessionModalCard: {
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  sessionProgressBarFill: {
    backgroundColor: '#6C4FF6',
    borderRadius: 999,
    height: '100%',
  },
  sessionProgressBarTrack: {
    backgroundColor: '#E6E6F2',
    borderRadius: 999,
    height: 4,
    marginBottom: 18,
    overflow: 'hidden',
    width: '100%',
  },
  sessionSecondaryButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 999,
    marginTop: 12,
    paddingVertical: 12,
  },
  sessionSecondaryButtonText: {
    color: '#6C4FF6',
    fontSize: 15,
    fontWeight: '600',
  },
  sessionSectionTitle: {
    color: '#2C2C4E',
    fontFamily: theme.fonts.semi,
    fontSize: 15,
    marginBottom: 10,
  },
  sessionStatusLabel: {
    color: '#4C46B6',
    fontFamily: theme.fonts.semi,
    fontSize: 13,
  },
  sessionStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginTop: 16,
  },
  sessionStatusTime: {
    color: '#4C46B6',
    fontFamily: theme.fonts.semi,
    fontSize: 13,
  },
  sessionTitle: {
    color: '#2C2C4E',
    fontFamily: theme.fonts.semi,
    fontSize: 18,
    marginBottom: 4,
  },
  sessionTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  step: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  stepCompleted: {
    backgroundColor: '#18C37D',
  },
  stepCurrent: {
    backgroundColor: '#F6A623',
  },
  stepLocked: {
    backgroundColor: '#E2E4EC',
  },
  stepText: {
    color: '#8C8CA3',
    fontFamily: theme.fonts.semi,
    fontSize: 13,
  },
  stepTextCompleted: {
    color: '#FFFFFF',
  },
  stepTextCurrent: {
    color: '#FFFFFF',
  },
  stepTextLocked: {
    color: '#B0B4C5',
  },
  stepsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    color: '#4C46B6',
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  trackActions: {
    flexDirection: 'row',
    gap: 12,
  },
  trackCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
  },
  trackHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  trackHeaderText: {
    flex: 1,
  },
  trackIcon: {
    backgroundColor: '#7D8CFF',
    borderRadius: 16,
    height: 48,
    marginRight: 12,
    width: 48,
  },
  trackMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  trackTitle: {
    color: '#2C2C4E',
    fontFamily: theme.fonts.semi,
    fontSize: 16,
    marginBottom: 4,
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

// app/screens/TrilhaScreen/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  // ===== BASE =====
  bg: { flex: 1 },
  content: {
    padding: 20,
    paddingBottom: 70,
  },
  footer: { marginTop: 14 },
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
  safe: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  savingIndicator: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    color: '#4C46B6',
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },

  // ===== HEADER TRILHAS =====
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },

  // ===== CARDS DE TRILHA =====
  trackCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  trackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trackIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: '#7D8CFF',
  },
  trackHeaderText: {
    flex: 1,
  },
  trackTitle: {
    fontFamily: theme.fonts.semi,
    fontSize: 16,
    color: '#2C2C4E',
    marginBottom: 4,
  },
  trackMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#E0F8EA',
  },
  levelBadgeText: {
    fontFamily: theme.fonts.semi,
    fontSize: 11,
    color: '#22A35B',
  },
  durationText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#8C8CA3',
  },

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  progressLabel: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#4F4F70',
  },
  progressPercent: {
    fontFamily: theme.fonts.semi,
    fontSize: 13,
    color: '#4F4F70',
  },

  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 8,
  },
  step: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontFamily: theme.fonts.semi,
    fontSize: 13,
    color: '#8C8CA3',
  },
  stepCompleted: {
    backgroundColor: '#18C37D',
  },
  stepTextCompleted: {
    color: '#FFFFFF',
  },
  stepCurrent: {
    backgroundColor: '#F6A623',
  },
  stepTextCurrent: {
    color: '#FFFFFF',
  },
  stepLocked: {
    backgroundColor: '#E2E4EC',
  },
  stepTextLocked: {
    color: '#B0B4C5',
  },

  trackActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C4FF6',
  },
  primaryButtonCompleted: {
    backgroundColor: '#18C37D',
  },
  primaryButtonDisabled: {
    backgroundColor: '#D1D4DE',
  },
  primaryButtonText: {
    fontFamily: theme.fonts.semi,
    fontSize: 14,
    color: '#FFFFFF',
  },
  primaryButtonTextDisabled: {
    color: '#F5F5F7',
  },

  secondaryButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDDFF0',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonDisabled: {
    backgroundColor: '#F3F4FA',
  },
  secondaryButtonText: {
    fontFamily: theme.fonts.semi,
    fontSize: 14,
    color: '#4C46B6',
  },
  secondaryButtonTextDisabled: {
    color: '#B0B4C5',
  },

  // ===== MODAL 1 – DETALHES =====
  modalCard: {
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  modalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTrackTitle: {
    fontFamily: theme.fonts.semi,
    fontSize: 16,
    color: '#2C2C4E',
  },
  modalCloseIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0D8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#EEE9FF',
    marginBottom: 16,
  },
  modalActivityTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: '#4C46B6',
    marginBottom: 8,
  },
  modalDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#6C6A8A',
    marginBottom: 16,
  },
  modalBenefitsTitle: {
    fontFamily: theme.fonts.semi,
    fontSize: 14,
    color: '#4C46B6',
    marginBottom: 8,
  },
  modalBenefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  modalBenefitCheck: {
    fontSize: 16,
    color: '#1BAA5C',
    marginRight: 6,
    marginTop: 1,
  },
  modalBenefitText: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#4F4F70',
  },
  modalActionWrapper: {
    marginTop: 18,
  },
  modalActionButton: {
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionButtonText: {
    fontFamily: theme.fonts.semi,
    fontSize: 15,
    color: '#FFFFFF',
  },

  // ===== MODAL 2 – SESSÃO / TIMER =====
  sessionModalCard: {
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  sessionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sessionDayText: {
    fontFamily: theme.fonts.semi,
    fontSize: 16,
    color: '#2C2C4E',
  },
  sessionDivider: {
    height: 1,
    backgroundColor: '#EEE9FF',
    marginBottom: 20,
  },
  sessionHeaderCenter: {
    alignItems: 'center',
    marginBottom: 18,
  },
  sessionIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sessionIconText: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: '#FFFFFF',
  },
  sessionTitle: {
    fontFamily: theme.fonts.semi,
    fontSize: 18,
    color: '#2C2C4E',
    marginBottom: 4,
  },
  sessionDurationText: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#8C8CA3',
    marginBottom: 8,
  },
  sessionDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#6C6A8A',
    textAlign: 'center',
  },
  sessionSectionTitle: {
    fontFamily: theme.fonts.semi,
    fontSize: 15,
    color: '#2C2C4E',
    marginBottom: 10,
  },
  sessionActivityCard: {
    borderRadius: 14,
    backgroundColor: '#F7F5FF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  sessionActivityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionActivityIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#7D8CFF',
  },
  sessionActivityTextBlock: {
    flex: 1,
  },
  sessionActivityTitle: {
    fontFamily: theme.fonts.semi,
    fontSize: 14,
    color: '#2C2C4E',
    marginBottom: 2,
  },
  sessionActivitySubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#7A7A99',
  },

  sessionStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 6,
  },
  sessionStatusLabel: {
    fontFamily: theme.fonts.semi,
    fontSize: 13,
    color: '#4C46B6',
  },
  sessionStatusTime: {
    fontFamily: theme.fonts.semi,
    fontSize: 13,
    color: '#4C46B6',
  },
  sessionProgressBarTrack: {
    width: '100%',
    height: 4,
    borderRadius: 999,
    backgroundColor: '#E6E6F2',
    overflow: 'hidden',
    marginBottom: 18,
  },
  sessionProgressBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#6C4FF6',
  },

  sessionControlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  sessionControlButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ===== MODAL 3 – DETALHES DO EXERCÍCIO =====
  activityModalCard: {
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  activityModalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  activityModalTitle: {
    fontFamily: theme.fonts.semi,
    fontSize: 17,
    color: '#2C2C4E',
  },
  activityModalSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#8C8CA3',
    marginBottom: 10,
  },
  activityModalDivider: {
    height: 1,
    backgroundColor: '#EEE9FF',
    marginBottom: 12,
  },
  activityModalSectionTitle: {
    fontFamily: theme.fonts.semi,
    fontSize: 14,
    color: '#4C46B6',
    marginBottom: 6,
    marginTop: 6,
  },
  activityModalDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#6C6A8A',
    marginBottom: 8,
  },
  activityModalTipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  activityModalBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 8,
    backgroundColor: '#6C4FF6',
  },
  activityModalTipText: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#4F4F70',
  },
  // ===== MODAL 4 – TELA DE CONCLUSÃO =====
  completionSafe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  completionGradient: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 72,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: '#7745D8',
    textAlign: 'center',
    marginBottom: 8,
  },
  completionSubtitle: {
    fontFamily: theme.fonts.semi,
    fontSize: 16,
    color: '#7A5DF5',
    textAlign: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  completionImage: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginBottom: 32,
  },
  completionButton: {
    marginTop: 8,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#6C4FF6',
  },
  completionButtonText: {
    fontFamily: theme.fonts.semi,
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  sessionCompleteWrapper: {
    marginTop: 16,
    alignItems: 'center',
  },

  sessionCompleteButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sessionCompleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

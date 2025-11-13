// app/screens/TrilhaScreen/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  // ===== BASE QUE VOCÊ ENVIOU =====
  bg: { flex: 1 },
  content: {
    padding: 20,
    paddingBottom: 70, // mais folga por causa do Navbar
  },
  footer: { marginTop: 14 },
  infoBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  infoSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 8,
    left: 16,
    padding: 16,
    position: 'absolute',
    right: 16,
    shadowColor: '#5B6BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    top: '20%',
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

  // ===== NOVOS ESTILOS PRA TELA DE TRILHAS =====
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

  // Cards de trilhas
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
    backgroundColor: '#6C4FF6', // roxinho
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
});

import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  completionBadge: {
    alignItems: 'center',
    backgroundColor: '#F2ECFF',
    borderRadius: 12,
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  completionBadgeCount: {
    color: '#4C46B6',
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },
  completionBadgeLabel: {
    color: '#6C4FF6',
    fontFamily: theme.fonts.semi,
    fontSize: 10,
  },
  durationText: {
    color: '#8C8CA3',
    fontFamily: theme.fonts.regular,
    fontSize: 12,
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
  stepSelected: {
    borderColor: '#6C4FF6',
    borderWidth: 2,
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
});

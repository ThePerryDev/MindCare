import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  activityNumber: {
    color: '#8C8CA3',
    fontFamily: theme.fonts.semi,
    fontSize: 13,
    marginBottom: 4,
  },

  activityTitle: {
    color: '#2C2C4E',
    fontFamily: theme.fonts.semi,
    fontSize: 18,
    marginBottom: 4,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  checklistCompleteButton: {
    alignItems: 'center',
    backgroundColor: '#6C4FF6',
    borderRadius: 999,
    justifyContent: 'center',
    paddingVertical: 12,
  },

  checklistCompleteButtonDisabled: {
    backgroundColor: '#D1D4DE',
  },

  checklistCompleteButtonText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.semi,
    fontSize: 15,
  },
  checklistFooter: {
    marginTop: 4,
  },
  divider: {
    backgroundColor: '#EEE9FF',
    height: 1,
    marginBottom: 16,
  },

  durationText: {
    color: '#8C8CA3',
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    marginBottom: 8,
  },

  scroll: {
    marginBottom: 12,
    maxHeight: 320, // evita o modal ficar gigante em telas menores
  },

  scrollContent: {
    paddingBottom: 4,
  },

  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    elevation: 8,
    left: 16,
    paddingHorizontal: 20,
    paddingVertical: 22,
    position: 'absolute',
    right: 16,
    shadowColor: '#5B6BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    top: '12%',
  },
});

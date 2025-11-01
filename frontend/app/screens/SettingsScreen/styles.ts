import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  footer: {
    marginTop: 14,
  },
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
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    textAlign: 'center',
  },
  infoTitle: {
    color: theme.colors.primary,
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
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
  },
  safe: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  title: {
    color: theme.colors.title,
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    marginBottom: 12,
    textAlign: 'center',
  },
});

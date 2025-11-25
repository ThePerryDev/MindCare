// frontend/app/screens/TrilhaScreen/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    marginRight: 8,
    width: 32,
  },

  bg: {
    flex: 1,
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

  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },

  safe: {
    backgroundColor: 'transparent',
    flex: 1,
  },

  title: {
    color: '#4C46B6',
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
});

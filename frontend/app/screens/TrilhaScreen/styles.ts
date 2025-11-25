import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
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
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '100%',
  },

  headerRight: {
    height: 24,
    width: 24,
  },

  headerTitle: {
    color: '#4C46B6',
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  listContent: {
    paddingBottom: 100,
    paddingHorizontal: 20,
  },

  safe: {
    backgroundColor: 'transparent',
    flex: 1,
  },

  // legado – pode remover se não estiver usando
  title: {
    alignContent: 'center',
    alignSelf: 'center',
    color: '#4C46B6',
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
});

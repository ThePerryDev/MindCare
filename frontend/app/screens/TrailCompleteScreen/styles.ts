import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  buttonPrimary: {
    backgroundColor: '#6C4FF6',
    borderRadius: 999,
    paddingHorizontal: 32,
    paddingVertical: 10,
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.semi,
    fontSize: 15,
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  gradient: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 72,
    paddingHorizontal: 24,
  },
  image: {
    height: 220,
    marginBottom: 32,
    resizeMode: 'contain',
    width: 220,
  },
  safe: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  subtitle: {
    color: '#7A5DF5',
    fontFamily: theme.fonts.semi,
    fontSize: 16,
    marginBottom: 24,
    marginHorizontal: 16,
    textAlign: 'center',
  },
  title: {
    color: '#7745D8',
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
});

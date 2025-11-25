import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  buttonWrapper: {
    marginBottom: 4,
    width: '100%',
  },

  content: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },

  gradient: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
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
    fontWeight: 'bold',
    marginBottom: 24,
    marginHorizontal: 16,
    textAlign: 'center',
  },

  title: {
    color: '#7745D8',
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

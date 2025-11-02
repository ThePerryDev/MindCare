import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  body: {
    gap: 6,
  },
  container: {
    borderRadius: 16,
    elevation: 2,
    marginTop: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  divider: {
    backgroundColor: 'transparent',
    height: 1,
    marginBottom: 8,
  },
  title: {
    fontFamily: theme.fonts.semi,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export const getTone = (tone: 'default' | 'danger') => {
  if (tone === 'danger') {
    return {
      container: {
        backgroundColor: '#FCECEC',
        borderWidth: 1,
        borderColor: '#F5BDBD',
      },
      title: { color: '#4C46B6' },
    };
  }
  return {
    container: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#EEF0FF',
    },
    title: { color: '#4C46B6' },
  };
};

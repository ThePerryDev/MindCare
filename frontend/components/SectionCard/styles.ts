import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  title: {
    textAlign: 'center',
    fontFamily: theme.fonts.semi,
    fontSize: 16,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8F0',
    marginBottom: 8,
  },
  body: {
    gap: 6,
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
      title: { color: '#7A1F1F' },
    };
  }
  return {
    container: {
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderWidth: 1,
      borderColor: '#EEF0FF',
    },
    title: { color: theme.colors.primary },
  };
};

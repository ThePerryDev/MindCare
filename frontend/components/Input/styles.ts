import { theme } from '../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 14,
    height: 50,
    paddingHorizontal: 12,
  },
  label: {
    color: '#2D3748',
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    marginBottom: 6,
  },
});

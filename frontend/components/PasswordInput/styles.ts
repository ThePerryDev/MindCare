import { theme } from '../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    right: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 14,
    height: 50,
    paddingHorizontal: 12,
    paddingRight: 40, // espaço pro ícone
  },
  inputContainer: {
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    color: '#1E1E1E',
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    marginBottom: 6,
  },
});

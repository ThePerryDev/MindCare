import { theme } from '../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  gradient: {
    alignItems: 'center',
    borderRadius: 20,
    height: 50,
    justifyContent: 'center',
  },
  pressable: {
    borderRadius: 20,
    marginVertical: 10,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.semi,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import { theme } from '../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  gradient: {
    alignItems: 'center',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
  },
  pressable: {
    borderRadius: 20,
    marginVertical: 12,
    overflow: 'hidden',
  },
  text: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.semi,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

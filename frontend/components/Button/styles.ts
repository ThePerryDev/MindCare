import { theme } from '../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  pressable: {
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 12,
  },
  gradient: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: theme.fonts.semi,
  },
});

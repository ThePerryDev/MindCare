import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  gradient: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  link: {
    color: '#EAE6FF', // tom mais claro para “links”
    fontFamily: theme.fonts.semi,
    fontSize: 14,
    lineHeight: 18,
    textDecorationLine: 'underline',
  },
  pressable: {
    borderRadius: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.96,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  text: {
    color: 'rgba(255,255,255,0.95)',
    flexShrink: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    lineHeight: 18,
  },
});

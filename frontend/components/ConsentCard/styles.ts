import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  cardcontainer: {
    alignContent: 'center',
    backgroundColor: 'rgba(108, 99, 255, 0.05)',
    borderColor: 'rgba(108, 99, 255, 0.10)',
    borderRadius: 16,
    borderWidth: 1,
    height: 70,
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 5,
    padding: 12,
  },
  link: {
    color: '#8E54E9',
    fontFamily: theme.fonts.semi,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18,
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
    color: '#656B6F',
    flexShrink: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    lineHeight: 18,
  },
});

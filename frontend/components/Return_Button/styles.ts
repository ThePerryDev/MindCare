import { theme } from '../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 20,
    borderStyle: 'solid',
    borderWidth: 2,
    height: 50,
    justifyContent: 'center',
    marginVertical: 12,
    overflow: 'hidden',
  },
  text: {
    color: '#757575',
    fontFamily: theme.fonts.semi,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

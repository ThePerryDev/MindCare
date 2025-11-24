import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  dayText: {
    color: '#2C2C4E',
    fontFamily: theme.fonts.semi,
    fontSize: 16,
  },
});

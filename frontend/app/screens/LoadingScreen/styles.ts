import { theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 60,
  },
  invisible: {
    opacity: 0,
  },
  loader: {
    height: 50,
    marginBottom: 12,
    width: 50,
  },
  title: {
    color: '#7B61FF',
    fontFamily: theme.fonts.semi,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

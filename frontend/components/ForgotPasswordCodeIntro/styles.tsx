import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
    paddingHorizontal: 24,
  },
  invisible: {
    opacity: 0, // mostra só o gradiente “dentro” do texto
  },
  logo: {
    height: 125,
    marginBottom: 5,
    width: 125,
  },
  subtitle: {
    color: '#1E1E1E',
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    fontWeight: 'regular',
    lineHeight: 20,
    textAlign: 'center',
  },
  title: {
    color: '#7B61FF',
    fontFamily: theme.fonts.semi,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
});

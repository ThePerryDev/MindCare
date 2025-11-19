// frontend/app/screens/EsqueceuSenhaScreen/EsqueceuSenhaCodigoScreen/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

const styles = StyleSheet.create({
  contentBase: {
    paddingHorizontal: 35,
  },
  contentCenter: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  contentTop: {
    justifyContent: 'flex-start',
    paddingTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  kav: {
    flex: 1,
  },
  padLarge: {
    paddingBottom: 0,
  },
  padSmall: {
    paddingBottom: 0,
  },
  safeArea: {
    backgroundColor: 'transparent',
    flex: 1,
  },

  scroll: {
    flex: 1,
  },
  subtitle: {
    color: '#555',
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    textAlign: 'center',
  },
  title: {
    color: '#8F4FE7',
    fontFamily: theme.fonts.semi,
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default styles;

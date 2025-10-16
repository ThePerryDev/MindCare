import { theme } from '../../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  image: {
    alignSelf: 'center',
    height: 251,
    marginBottom: 24,
    resizeMode: 'contain',
    width: 251,
  },
  imageSmall: {
    height: 120,
    marginBottom: 16,
    width: 120,
  },
  kav: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  linkForgot: {
    color: '#9B7EFF',
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  linkRegister: {
    color: '#9B7EFF',
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    fontWeight: 'bold',
  },
  padLarge: {
    paddingBottom: 0,
  },
  padSmall: {
    paddingBottom: 0,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  safeArea: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  textRegister: {
    color: '#555',
    fontFamily: theme.fonts.regular,
    fontSize: 14,
  },
});

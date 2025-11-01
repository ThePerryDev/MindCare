import { theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 60,
  },
  image: {
    alignSelf: 'center',
    height: 300,
    resizeMode: 'contain',
    width: 300,
  },
  invisible: {
    opacity: 0,
  },
  title: {
    color: '#7B61FF',
    fontFamily: theme.fonts.semi,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
});

export default styles;

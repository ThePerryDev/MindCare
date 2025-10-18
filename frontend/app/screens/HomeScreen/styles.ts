import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4C46B6',
    marginBottom: 20,
  },
  buttonWrapper: {
    width: '100%', // ocupa toda a largura do container
    marginBottom: 20, // espaço embaixo do botão
  },
});

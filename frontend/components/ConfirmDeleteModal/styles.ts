import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 8,
    left: 16,
    padding: 20,
    position: 'absolute',
    right: 16,
    shadowColor: '#5B6BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    top: '22%',
  },
  dangerButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#D63C3C', // botão sólido vermelho
    borderRadius: 20,
    height: 50,
    justifyContent: 'center',
  },
  dangerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 18,
  },
  message: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
    textAlign: 'center',
  },
  title: {
    color: '#D63C3C',
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 35,
    textAlign: 'center',
  },
});

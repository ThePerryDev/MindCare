import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  gradient: {
    borderRadius: 16,
  },
  shadow: {
    borderRadius: 16,
    padding: 16, // 👈 padding aqui para espaçamento interno

    // sombra no Android
    elevation: 8,
    shadowColor: '#6C63FF',

    // sombra no iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

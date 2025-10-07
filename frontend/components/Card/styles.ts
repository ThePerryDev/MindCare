import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  shadow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,

    // sombra no Android
    elevation: 8,

    padding: 30,

    shadowColor: '#6C63FF',

    // sombra no iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

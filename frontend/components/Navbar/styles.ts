import { StyleSheet } from 'react-native';

export const NAVBAR_HEIGHT = 40;

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 50,
    height: NAVBAR_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 25,
    // sombra suave e flutuante
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
    zIndex: 50,
  },
});

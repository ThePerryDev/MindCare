import { StyleSheet } from 'react-native';

export const NAVBAR_HEIGHT = 60;

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    bottom: 50,
    elevation: 8,
    flexDirection: 'row',
    height: NAVBAR_HEIGHT,
    justifyContent: 'space-around',
    left: 20,
    paddingHorizontal: 25,
    position: 'absolute',
    right: 20,
    // sombra suave e flutuante
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 50,
  },
});

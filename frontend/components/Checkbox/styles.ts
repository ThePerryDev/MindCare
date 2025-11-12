import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    borderWidth: 2,
    justifyContent: 'center',
  },
  circleChecked: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  circleUnchecked: {
    backgroundColor: 'transparent',
    borderColor: '#6C63FF',
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});

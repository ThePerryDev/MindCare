import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  iconBtn: {
    alignItems: 'center',
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  label: {
    color: '#343A40',
    fontFamily: theme.fonts.semi,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  left: {
    flex: 1,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: '#EDEDF5',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 12,
  },
  value: {
    color: '#6C757D',
    fontFamily: theme.fonts.regular,
    fontSize: 13,
  },
  valueMuted: {
    color: '#6C757D',
  },
});

export const variants = {
  edit: {
    btn: { backgroundColor: 'transparent' },
    iconColor: '#4C46B6',
  },
  link: {
    btn: { backgroundColor: 'transparent' },
    iconColor: '#4C46B6',
  },
  danger: {
    btn: { backgroundColor: 'transparent' },
    iconColor: '#D93838',
  },
};

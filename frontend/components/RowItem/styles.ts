import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDF5',
  },
  left: { flex: 1 },
  label: {
    fontFamily: theme.fonts.semi,
    fontSize: 14,
    color: theme.colors.title,
    marginBottom: 3,
  },
  value: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.text,
  },
  valueMuted: { color: theme.colors.textMuted },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const variants = {
  edit: {
    btn: { backgroundColor: '#EFF2FF' },
    iconColor: theme.colors.primary,
  },
  link: {
    btn: { backgroundColor: '#EFF2FF' },
    iconColor: theme.colors.primary,
  },
  danger: {
    btn: { backgroundColor: '#FDEBEB' },
    iconColor: '#D93838',
  },
};

import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  bullet: {
    backgroundColor: '#6C4FF6',
    borderRadius: 3,
    height: 6,
    marginRight: 8,
    marginTop: 6,
    width: 6,
  },
  description: {
    color: '#6C6A8A',
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#4C46B6',
    fontFamily: theme.fonts.semi,
    fontSize: 14,
    marginBottom: 6,
    marginTop: 6,
  },
  tipRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 4,
  },
  tipText: {
    color: '#4F4F70',
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 13,
  },
});

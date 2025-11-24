import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#7B5CFF',
    borderRadius: 999,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.semi,
    fontSize: 15,
  },
  actionWrapper: {
    marginTop: 18,
  },
  activityTitle: {
    color: '#4C46B6',
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    marginBottom: 8,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  benefitCheck: {
    color: '#1BAA5C',
    fontSize: 16,
    marginRight: 6,
    marginTop: 1,
  },
  benefitRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 4,
  },
  benefitText: {
    color: '#4F4F70',
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
  },
  benefitsTitle: {
    color: '#4C46B6',
    fontFamily: theme.fonts.semi,
    fontSize: 14,
    marginBottom: 8,
  },
  description: {
    color: '#6C6A8A',
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    marginBottom: 16,
  },
  divider: {
    backgroundColor: '#EEE9FF',
    height: 1,
    marginBottom: 16,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    elevation: 8,
    left: 16,
    paddingHorizontal: 20,
    paddingVertical: 22,
    position: 'absolute',
    right: 16,
    shadowColor: '#5B6BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    top: '18%',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  trailTitle: {
    color: '#2C2C4E',
    fontFamily: theme.fonts.semi,
    fontSize: 16,
  },
});

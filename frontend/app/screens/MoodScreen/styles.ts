import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backArrow: {
    color: '#6B4FE3',
    fontSize: 28,
    width: 24,
  },
  cardBase: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 110,
    width: 180,
  },
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingHorizontal: 20,
  },
  emoji: {
    fontSize: 34,
  },
  feedbackText: {
    color: '#5B4AE6',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 18,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 12,
    paddingTop: 8,
  },
  label: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
  },
  moodInner: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  pageTitle: {
    color: '#5B4AE6',
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  selectedEmoji: {
    color: '#FFFFFF',
    fontSize: 36,
  },
  selectedGradient: {
    backgroundColor: '#8E54E9',
    borderRadius: 24,
    flex: 1,
  },
  selectedLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  selectedShadowWrapper: {
    alignSelf: 'center',
    borderRadius: 24,
    elevation: 8,
    height: 110,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    width: 180,
  },
});

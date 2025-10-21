import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 12,
  },
  backArrow: {
    fontSize: 28,
    color: '#6B4FE3',
    width: 24,
  },
  pageTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#5B4AE6',
  },
  list: {
    marginTop: 12,
    gap: 16,
    alignItems: 'center',
  },
  cardBase: {
    width: 180,
    height: 110,
    borderRadius: 24,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
  },
  moodInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 34,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  selectedShadowWrapper: {
    width: 180,
    height: 110,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    alignSelf: 'center',
  },
  selectedGradient: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: '#8E54E9',
  },
  selectedEmoji: {
    fontSize: 36,
    color: '#FFFFFF',
  },
  selectedLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  feedbackText: {
    textAlign: 'center',
    marginTop: 18,
    fontSize: 14,
    fontWeight: '700',
    color: '#5B4AE6',
  },
});

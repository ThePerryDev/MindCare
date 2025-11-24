import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  buttonDisabled: {
    opacity: 0.5,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonPressedLight: {
    opacity: 0.9,
  },

  completeButton: {
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 999,
    elevation: 2,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  completeButtonText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.semi,
    fontSize: 15,
  },

  container: {
    marginTop: 16,
    width: '100%',
  },

  controlsRow: {
    alignItems: 'center',
    columnGap: 16,
    flexDirection: 'row',
  },

  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  playPauseButton: {
    alignItems: 'center',
    backgroundColor: '#6C4FF6',
    borderRadius: 26,
    elevation: 3,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },

  progressFill: {
    backgroundColor: '#6C4FF6',
    borderRadius: 999,
    height: '100%',
  },

  progressTrack: {
    backgroundColor: '#E6E6F2',
    borderRadius: 999,
    height: 5,
    marginBottom: 18,
    overflow: 'hidden',
    width: '100%',
  },

  statusLabel: {
    color: '#4C46B6',
    fontFamily: theme.fonts.semi,
    fontSize: 13,
  },

  timeText: {
    color: '#4C46B6',
    fontFamily: theme.fonts.semi,
    fontSize: 13,
  },
});

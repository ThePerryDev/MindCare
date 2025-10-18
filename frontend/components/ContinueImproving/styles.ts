import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  title: {
    color: '#4C46B6',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {},
  trackLabel: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  exerciseLabel: {
    color: '#777',
    fontSize: 13,
    marginTop: 2,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  playGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    padding: 20,
    width: '100%',
  },
  exerciseLabel: {
    color: '#777',
    fontSize: 13,
    marginTop: 2,
  },
  playButton: {
    borderRadius: 25,
    height: 50,
    overflow: 'hidden',
    width: 50,
  },
  playGradient: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {},
  title: {
    color: '#4C46B6',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  trackLabel: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
});

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    padding: 20,
    width: '100%',
  },
  itemContainer: {
    alignItems: 'center',
    marginVertical: 8,
    width: '48%',
  },
  label: {
    color: '#666',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  title: {
    color: '#4C46B6',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  value: {
    color: '#4C46B6',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
});

import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  // Modal base (mesmo visual do EditField)
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  close: {
    alignItems: 'center',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  // Body
  form: {
    marginTop: 4,
  },
  // Header
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  headerSpacer: {
    height: 28,
    width: 28,
  },
  headerTitle: {
    color: '#4C46B6',
    flex: 1,
    fontFamily: theme.fonts.semi,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hint: {
    color: '#D93838',
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    marginTop: -4,
    textAlign: 'center',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 8,
    left: 16,
    padding: 16,
    position: 'absolute',
    right: 16,
    shadowColor: '#5B6BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    top: '12%',
  },
});

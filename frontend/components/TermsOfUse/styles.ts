import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(10, 10, 20, 0.45)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  bulletItem: {
    color: '#1E1E1E',
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  bulletList: {
    gap: 6,
    marginBottom: 2,
  },
  card: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 6,
    maxHeight: '90%',
    maxWidth: 420,
    paddingBottom: 20,
    paddingHorizontal: 25,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    width: '100%',
  },
  content: {
    paddingBottom: 4,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  paragraph: {
    color: '#333',
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  scroll: {
    marginTop: 8,
  },
  sectionTitle: {
    color: '#1E1E1E',
    fontFamily: theme.fonts.semi,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 12,
  },
  title: {
    color: '#1E1E1E',
    flex: 1,
    fontFamily: theme.fonts.semi,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

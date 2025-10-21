import { Platform, StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

const CIRCLE = 22;
const GLYPH_SIZE = 14; // tamanho do símbolo
const NUDGE = Platform.select({ ios: -0.5, android: -1 });

export const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginBottom: 24,
    marginTop: 0,
  },
  glyphWrap: {
    alignItems: 'center',
    height: CIRCLE,
    justifyContent: 'center',
    width: CIRCLE,
  },
  iconGlyph: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.semi,
    fontSize: GLYPH_SIZE,
    includeFontPadding: false,
    lineHeight: GLYPH_SIZE,
    textAlign: 'center',
    top: NUDGE,
  },
  iconGradient: {
    alignItems: 'center',
    borderRadius: CIRCLE / 2,
    height: CIRCLE,
    justifyContent: 'center',
    marginRight: 10,
    width: CIRCLE,
  },
  iconPlaceholder: {
    borderRadius: CIRCLE / 2,
    height: CIRCLE,
    marginRight: 10,
    width: CIRCLE,
  },
  placeholderGlyph: {
    color: '#656B6F',
    fontFamily: theme.fonts.semi,
    fontSize: 16,
    includeFontPadding: false,
    lineHeight: 18,
    textAlign: 'center',
    top: NUDGE,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    color: '#656B6F',
    fontFamily: theme.fonts.regular,
    fontSize: 14,
  },
  textStarted: {
    color: '#2B2B2B',
  },
});

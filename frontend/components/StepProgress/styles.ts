import { StyleSheet } from 'react-native';

const DOT_SIZE = 32;
const STEP_SLOT = 80; // largura reservada para cada dot/label

export const styles = StyleSheet.create({
  // ----- BARRAS -----
  barActive: {
    borderRadius: 999,
    height: 4,
    left: 0,
    position: 'absolute',
  },
  barContainer: {
    flex: 1,
    height: 4,
    justifyContent: 'center',
    marginHorizontal: 8,
    position: 'relative',
  },
  barInactive: {
    backgroundColor: '#E9E9EE',
    borderRadius: 999,
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
  },

  // ----- DOTS -----
  dot: {
    alignItems: 'center',
    borderRadius: DOT_SIZE / 2,
    height: DOT_SIZE,
    justifyContent: 'center',
    width: DOT_SIZE,
  },
  dotActive: {},
  dotCheck: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dotCompleted: {
    backgroundColor: '#7D6BFF',
    borderColor: '#7D6BFF',
    borderWidth: 2,
  },
  dotNumber: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dotNumberMuted: {
    color: '#1E1E1E',
    fontWeight: '700',
  },
  dotUpcoming: {
    backgroundColor: '#E9E9EE',
  },

  // ----- LABELS -----
  label: {
    fontSize: 12,
  },
  labelActive: {
    color: '#4C46B6',
    fontWeight: '700',
  },
  labelCompleted: {
    color: '#B9B9C8',
    fontWeight: '700',
  },
  labelSlot: {
    alignItems: 'center',
    width: STEP_SLOT,
  },
  labelUpcoming: {
    color: '#656B6F',
    fontWeight: '600',
  },

  // Linha superior (pontos + barras), alinhadas pelo centro dos pontos
  rowDots: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  // Linha inferior (apenas labels), cada label centralizada abaixo do dot
  rowLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 4,
  },

  wrapper: {
    marginBottom: 20,
    width: '100%',
  },
});

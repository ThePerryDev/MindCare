require('react-native-gesture-handler/jestSetup');

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock do react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock do Expo
jest.mock('expo-font');
jest.mock('expo-asset');

// Silenciar warnings desnecessários
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock do react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Configurar timeout para testes
jest.setTimeout(10000);

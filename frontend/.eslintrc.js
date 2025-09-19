module.exports = {
  extends: [
    'expo',
    '@react-native-community',
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-native'],
  root: true,
  env: {
    'react-native/react-native': true,
    jest: true,
  },
  rules: {
    // Regras personalizadas
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/prop-types': 'off',
    'react/display-name': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.expo/',
    'web-build/',
  ],
};


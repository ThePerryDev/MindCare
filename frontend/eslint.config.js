import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,

  // Config principal (TS / React / RN)
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      prettier,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...reactNative.configs.all.rules,
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'react-native/no-color-literals': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // Arquivos de configuração Node.js — reconhecer module/require
  {
    files: ['babel.config.js', 'jest.config.js', 'react-native.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        module: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    },
  },

  // Jest setup (reconhecer jest/requires)
  {
    files: ['jest.setup.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        jest: 'readonly',
        require: 'readonly',
        module: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    },
  },

  prettierConfig,
];

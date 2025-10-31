import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  js.configs.recommended,

  // Principal (TS / React / RN)
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser, // window, console, etc.
        ...globals.es2021,
        // ...globals.node,   // ative se usar globais Node na pasta src
        __DEV__: 'readonly', // global do React Native
      },
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
      // Se quiser bloquear console em prod, troque por ["warn", { allow: ["warn", "error"] }]
      'no-console': 'off',
      // ✅ permite redeclarar nomes iguais a globais nativas (ex.: setTimeout)
      'no-redeclare': ['error', { builtinGlobals: false }],
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // Arquivos de config Node.js — reconhecer module/require
  {
    files: ['babel.config.js', 'jest.config.js', 'react-native.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.node,
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

  // Jest setup
  {
    files: ['jest.setup.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.node,
        ...globals.jest,
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

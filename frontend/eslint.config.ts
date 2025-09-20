import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import tsParser from '@typescript-eslint/parser'

export default defineConfig([
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: globals.browser,
    },
    rules: {
      'no-trailing-spaces': 'error',
      indent: ['error', 2, { SwitchCase: 1 }],
      quotes: ['error', 'single'],
      'object-curly-spacing': ['error', 'always'],
      semi: ['error', 'never'],
      'linebreak-style': ['error', 'unix'],
      'no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_'
      }],
      'react/react-in-jsx-scope': 'off',
    },
    'settings': {
      'react': {
        'version': 'detect'
      }
    }
  },
])

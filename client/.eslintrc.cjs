/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

const nodePath = require('node:path')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // '@vue/eslint-config-airbnb',
    // '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  plugins: ['@typescript-eslint/parser', 'vitest'],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
      extends: ['plugin:playwright/recommended'],
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'import/no-relative-parent-imports': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'no-console': 0,
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            // using gitignore syntax
            group: [
              'app',
              'config',
              'database',
              'entities',
              'modules',
              'repositories',
              'trpc',
              'utils',
            ].flatMap(path => [`@server/${path}`, `@flashwords/server/src/${path}`]),
            message: 'Please only import from @server/shared or @flashwords/server/src/shared.',
          },
        ],
      },
    ],
  },
  settings: {
    // to make our custom @ alias resolvable by ESLint import rules
    'import/resolver': {
      [require.resolve('eslint-import-resolver-node')]: {},
      [require.resolve('eslint-import-resolver-custom-alias')]: {
        alias: {
          '@': `${nodePath.resolve(__dirname, './src')}`,
        },
        extensions: ['.mjs', '.js', '.jsx', '.json', '.node', '.ts', '.tsx'],
      },
    },
  },
}

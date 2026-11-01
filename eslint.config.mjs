// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import eslint from '@eslint/js';
import headerPlugin from '@tony.ganchev/eslint-plugin-header';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPrettier from 'eslint-plugin-prettier/recommended';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    'lib',
    'pages/dist',
    'global-styles/lib',
    'collection-hooks/lib',
    'src/internal/generated',
    'src/icon/generated',
    'src/index.ts',
    'src/test-utils/dom/index.ts',
    'test-results',
  ]),
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  reactHooksPlugin.configs.flat['recommended-latest'],
  eslintPrettier,
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    plugins: {
      header: headerPlugin,
      'simple-import-sort': simpleImportSortPlugin,
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
      '@typescript-eslint/no-namespace': 'off',
      'header/header': [
        'error',
        {
          header: {
            commentType: 'line',
            lines: [' Copyright Christopher Johnson. All Rights Reserved.', ' SPDX-License-Identifier: Apache-2.0'],
          },
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^react$', '^react', '^node:', '^@?\\w'],
            ['^~'],
            ['^\\.'],
            ['^.+\\.css\\.js$', '^.+\\.s?css$'],
          ],
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['gulpfile.js', 'build-tools/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: [
      '**/*.mjs',
      'playwright.config.ts',
      'test/browser/**',
      'src/**/__tests__/**',
      'global-styles/src/**/__tests__/**',
      'collection-hooks/src/**/__tests__/**',
      'charts/src/**/__tests__/**',
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // Playwright fixtures hand their value to a callback named `use`, which is not the React hook.
    files: ['test/browser/**'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  }
);

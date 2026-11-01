// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));

// The built charts import the library through its package names, as a consumer's code would.
const resolve = {
  alias: [
    { find: /^@ordinate-ui\/components\//, replacement: `${path.join(root, 'lib/components')}/` },
    { find: /^@ordinate-ui\/design-tokens$/, replacement: path.join(root, 'lib/design-tokens/index.js') },
  ],
};

// Component tests run against the built output in lib/components, like the published package.
// Server-rendering tests run without a DOM, so components that touch `window` while rendering fail them.
export default defineConfig({
  test: {
    projects: [
      {
        resolve,
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: [
            'src/**/__tests__/**/*.test.{ts,tsx}',
            'global-styles/src/**/__tests__/**/*.test.ts',
            'collection-hooks/src/**/__tests__/**/*.test.{ts,tsx}',
            'charts/src/**/__tests__/**/*.test.{ts,tsx}',
          ],
          exclude: ['**/*.ssr.test.tsx'],
          setupFiles: ['./src/__tests__/setup.ts'],
        },
      },
      {
        resolve,
        test: {
          name: 'ssr',
          environment: 'node',
          include: ['src/**/__tests__/**/*.ssr.test.tsx', 'charts/src/**/__tests__/**/*.ssr.test.tsx'],
        },
      },
    ],
  },
});

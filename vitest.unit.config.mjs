// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { defineConfig } from 'vitest/config';

// Component tests run against the built output in lib/components, like the published package.
// Server-rendering tests run without a DOM, so components that touch `window` while rendering fail them.
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: [
            'src/**/__tests__/**/*.test.{ts,tsx}',
            'global-styles/src/**/__tests__/**/*.test.ts',
            'collection-hooks/src/**/__tests__/**/*.test.{ts,tsx}',
          ],
          exclude: ['**/*.ssr.test.tsx'],
          setupFiles: ['./src/__tests__/setup.ts'],
        },
      },
      {
        test: {
          name: 'ssr',
          environment: 'node',
          include: ['src/**/__tests__/**/*.ssr.test.tsx'],
        },
      },
    ],
  },
});

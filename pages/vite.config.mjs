// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));

// Pages import the built components from lib/components, so run `gulp watch` alongside this server.
export default defineConfig({
  root,
  plugins: [react()],
  resolve: {
    alias: {
      '~components': path.resolve(root, '../lib/components'),
      '~global-styles': path.resolve(root, '../global-styles/src'),
      '~collection-hooks': path.resolve(root, '../collection-hooks/src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

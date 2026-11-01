// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));

// Pages import the built components from lib/components and the built charts from lib/charts, so run
// `gulp watch` alongside this server. The charts import the library by its package names, which resolve
// to the same built files, so pages and charts share one copy of every component.
export default defineConfig({
  root,
  plugins: [react()],
  resolve: {
    alias: [
      { find: '~components', replacement: path.resolve(root, '../lib/components') },
      { find: '~charts', replacement: path.resolve(root, '../lib/charts') },
      { find: '~global-styles', replacement: path.resolve(root, '../global-styles/src') },
      { find: '~collection-hooks', replacement: path.resolve(root, '../collection-hooks/src') },
      { find: /^@ordinate-ui\/components\//, replacement: `${path.resolve(root, '../lib/components')}/` },
      { find: /^@ordinate-ui\/design-tokens$/, replacement: path.resolve(root, '../lib/design-tokens/index.js') },
    ],
  },
  server: {
    fs: {
      // A git worktree may link node_modules to another checkout; fonts load from wherever it points.
      allow: [path.resolve(root, '..'), fs.realpathSync(path.resolve(root, '../node_modules'))],
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

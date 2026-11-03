// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, '..');
const lib = path.join(repo, 'lib');

// The site imports every package by the name an application uses, so the code shown beside each
// example is the code that runs. Those names resolve to this checkout: the built components and
// charts in lib/, and the sources of the two small workspaces.
const packageAliases = [
  { find: /^@ordinate\/components\//, replacement: `${path.join(lib, 'components')}/` },
  { find: /^@ordinate\/charts\//, replacement: `${path.join(lib, 'charts')}/` },
  { find: /^@ordinate\/design-tokens$/, replacement: path.join(lib, 'design-tokens/index.js') },
  { find: /^@ordinate\/global-styles$/, replacement: path.join(repo, 'global-styles/src/index.ts') },
  { find: /^@ordinate\/global-styles\//, replacement: `${path.join(repo, 'global-styles/src')}/` },
  { find: /^@ordinate\/collection-hooks$/, replacement: path.join(repo, 'collection-hooks/src/index.ts') },
];

function readVersion(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8')).version;
}

export default defineConfig({
  root,
  // Relative URLs, so the built site works from any folder: a local server, a subpath, or file://.
  base: './',
  plugins: [react()],
  resolve: { alias: packageAliases },
  define: {
    __ORDINATE_VERSION__: JSON.stringify(readVersion(path.join(repo, 'package.json'))),
    __ORDINATE_BUILT__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  server: {
    port: 4180,
    fs: { allow: [repo, fs.realpathSync(path.join(repo, 'node_modules'))] },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssTarget: ['chrome120', 'firefox120', 'safari17'],
    chunkSizeWarningLimit: 4096,
  },
});

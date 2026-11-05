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

// The pattern pages show the whole-page examples from pages/examples, which import through the dev
// pages' own aliases.
const devPageAliases = [
  { find: '~components', replacement: path.join(lib, 'components') },
  { find: '~charts', replacement: path.join(lib, 'charts') },
  { find: '~global-styles', replacement: path.join(repo, 'global-styles/src') },
  { find: '~collection-hooks', replacement: path.join(repo, 'collection-hooks/src') },
];

const rootManifest = JSON.parse(fs.readFileSync(path.join(repo, 'package.json'), 'utf8'));
const codeEditorPackages = Object.keys(rootManifest.dependencies).filter(name => /^@(codemirror|lezer)\//.test(name));

function readVersion(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8')).version;
}

const version = readVersion(path.join(repo, 'package.json'));

// Writes routes.json beside the built site: its version and every page, so `ordinate-docs table`
// can open a page by name without loading the site. Pages are found the way the site finds them.
function routesManifest() {
  const content = path.join(root, 'src/content');
  const list = (dir, test) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).filter(test) : []);
  return {
    name: 'ordinate-docs-routes',
    apply: 'build',
    generateBundle() {
      const components = list(path.join(content, 'components'), entry =>
        fs.existsSync(path.join(content, 'components', entry.name, 'index.tsx'))
      ).map(entry => entry.name);
      const guides = [
        ['guides', 'start'],
        ['foundations', 'foundations'],
        ['packages', 'packages'],
        ['patterns', 'patterns'],
      ].flatMap(([folder, section]) =>
        list(path.join(content, folder), entry => entry.isFile() && entry.name.endsWith('.tsx')).map(
          entry => `/${section}/${entry.name.replace(/\.tsx$/, '')}`
        )
      );
      this.emitFile({
        type: 'asset',
        fileName: 'routes.json',
        source: `${JSON.stringify({ version, components: components.sort(), guides }, null, 2)}\n`,
      });
    },
  };
}

export default defineConfig({
  root,
  // Relative URLs, so the built site works from whatever folder or path it is served at.
  base: './',
  plugins: [react(), routesManifest()],
  resolve: { alias: [...packageAliases, ...devPageAliases] },
  define: {
    __ORDINATE_VERSION__: JSON.stringify(version),
    __ORDINATE_BUILT__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  // The code editor loads CodeMirror and its languages on first use. Listing them here bundles them
  // when the dev server starts, so the first page with an editor does not reload the server.
  optimizeDeps: { include: codeEditorPackages },
  server: {
    port: 4180,
    fs: { allow: [repo, fs.realpathSync(path.join(repo, 'node_modules'))] },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Browsers with light-dark(). An older target makes the minifier lower light-dark() into variables
    // resolved once on the page, and a mode set on part of the page (applyMode with an element,
    // StyleScope's mode) stops changing its colors.
    cssTarget: ['chrome123', 'firefox120', 'safari17.5'],
    chunkSizeWarningLimit: 4096,
  },
});

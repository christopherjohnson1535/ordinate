// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fs = require('node:fs/promises');
const path = require('node:path');
const { rootDir, task } = require('../utils');
const { createProgram, documentComponent } = require('../utils/documenter');

const srcDir = path.join(rootDir, 'src');
const outDir = path.join(rootDir, 'lib/components-definitions');

// The same folders generate-index-file.js exports as components.
const nonComponents = new Set(['internal', 'i18n']);

async function exists(file) {
  return fs
    .access(file)
    .then(() => true)
    .catch(() => false);
}

async function listComponents() {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  const candidates = entries.filter(
    entry => entry.isDirectory() && !nonComponents.has(entry.name) && !entry.name.startsWith('__')
  );
  const withIndex = await Promise.all(
    candidates.map(async entry => ((await exists(path.join(srcDir, entry.name, 'index.tsx'))) ? entry.name : null))
  );
  return withIndex.filter(Boolean).sort();
}

module.exports = task('docs', async () => {
  const folders = await listComponents();
  const program = createProgram(folders);
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });
  await Promise.all(
    folders.map(folder =>
      fs.writeFile(
        path.join(outDir, `${folder}.json`),
        `${JSON.stringify(documentComponent(program, folder), null, 2)}\n`
      )
    )
  );
});

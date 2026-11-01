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

async function writeDefinition(program, folder) {
  const definition = documentComponent(program, folder);
  if (!definition) {
    // The API test reports the missing definition; the rest of the build carries on.
    console.warn(`docs: src/${folder}/interfaces.ts declares no props interface, skipping it.`);
    return;
  }
  await fs.writeFile(path.join(outDir, `${folder}.json`), `${JSON.stringify(definition, null, 2)}\n`);
}

module.exports = task('docs', async () => {
  const folders = await listComponents();
  const program = createProgram(folders);
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });
  await Promise.all(folders.map(folder => writeDefinition(program, folder)));
});

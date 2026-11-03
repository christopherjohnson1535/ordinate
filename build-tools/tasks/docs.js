// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fs = require('node:fs/promises');
const path = require('node:path');
const { rootDir, task } = require('../utils');
const { chartsSource, componentsSource, createProgram, documentComponent } = require('../utils/documenter');

// The same folders generate-index-file.js exports as components.
const nonComponents = new Set(['internal', 'i18n', 'test-utils']);

// Each package with components, and where its definitions go.
const packages = [
  { label: 'src', source: componentsSource, outDir: path.join(rootDir, 'lib/components-definitions') },
  { label: 'charts/src', source: chartsSource, outDir: path.join(rootDir, 'lib/charts-definitions') },
];

async function exists(file) {
  return fs
    .access(file)
    .then(() => true)
    .catch(() => false);
}

async function listComponents(srcDir) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  const candidates = entries.filter(
    entry => entry.isDirectory() && !nonComponents.has(entry.name) && !entry.name.startsWith('__')
  );
  const withIndex = await Promise.all(
    candidates.map(async entry => ((await exists(path.join(srcDir, entry.name, 'index.tsx'))) ? entry.name : null))
  );
  return withIndex.filter(Boolean).sort();
}

async function documentPackage({ label, source, outDir }) {
  const folders = await listComponents(source.srcDir);
  const program = createProgram(folders, source);
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });
  await Promise.all(
    folders.map(async folder => {
      const definition = documentComponent(program, folder, source);
      if (!definition) {
        // The API test reports the missing definition; the rest of the build carries on.
        console.warn(`docs: ${label}/${folder}/interfaces.ts declares no props interface, skipping it.`);
        return;
      }
      await fs.writeFile(path.join(outDir, `${folder}.json`), `${JSON.stringify(definition, null, 2)}\n`);
    })
  );
}

module.exports = task('docs', async () => {
  await Promise.all(packages.map(documentPackage));
});

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fs = require('node:fs/promises');
const path = require('node:path');
const { rootDir, task } = require('../utils');

const outDir = path.join(rootDir, 'lib/components');
const copiedFiles = ['LICENSE', 'NOTICE', 'README.md'];

module.exports = task('package-json', async () => {
  const source = JSON.parse(await fs.readFile(path.join(rootDir, 'package.json'), 'utf8'));
  const manifest = {
    name: source.name,
    version: source.version,
    description: source.description,
    license: source.license,
    repository: source.repository,
    main: './index.js',
    types: './index.d.ts',
    sideEffects: ['*.css', '*.css.js', './internal/base-component/index.js'],
    dependencies: source.dependencies,
    peerDependencies: source.peerDependencies,
  };
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  await Promise.all(copiedFiles.map(file => fs.copyFile(path.join(rootDir, file), path.join(outDir, file))));
});

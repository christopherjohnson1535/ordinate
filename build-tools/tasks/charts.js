// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { parallel, series } = require('gulp');
const { rootDir, task, tsc } = require('../utils');
const { compileStyles } = require('../utils/styles');
const { folderExports } = require('../utils/manifest');
const { fullySpecifyImports } = require('../utils/specifiers');

const packageDir = path.join(rootDir, 'charts');
const outDir = path.join(rootDir, 'lib/charts');

// Chart styles use the public token package, exactly as a consumer's own components would.
const designTokensImporter = {
  findFileUrl(url) {
    return url === '@ordinate-ui/design-tokens'
      ? pathToFileURL(path.join(rootDir, 'lib/design-tokens/index.scss'))
      : null;
  },
};

const chartsStyles = task('charts:styles', () =>
  compileStyles({
    srcDir: path.join(packageDir, 'src'),
    outDir,
    scope: 'charts',
    importers: [designTokensImporter],
  })
);

const chartsTypescript = task('charts:typescript', async () => {
  await tsc('charts/tsconfig.json');
  await fullySpecifyImports(outDir);
});

const chartsPackageJSON = task('charts:package-json', async () => {
  const library = JSON.parse(await fs.readFile(path.join(rootDir, 'package.json'), 'utf8'));
  const source = JSON.parse(await fs.readFile(path.join(packageDir, 'package.json'), 'utf8'));
  const sibling = `^${library.version}`;
  const manifest = {
    name: source.name,
    version: source.version,
    description: source.description,
    license: source.license,
    repository: library.repository,
    type: 'module',
    main: './index.js',
    types: './index.d.ts',
    exports: folderExports(),
    sideEffects: ['*.css', '*.css.js'],
    dependencies: { ...source.dependencies, '@ordinate-ui/design-tokens': sibling },
    peerDependencies: { ...source.peerDependencies, '@ordinate-ui/components': sibling },
  };
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  await Promise.all([
    fs.copyFile(path.join(packageDir, 'README.md'), path.join(outDir, 'README.md')),
    ...['LICENSE', 'NOTICE'].map(file => fs.copyFile(path.join(rootDir, file), path.join(outDir, file))),
  ]);
});

// Runs after the components and design tokens are built: the charts compile against both.
module.exports = Object.assign(task('charts', series(parallel(chartsStyles, chartsTypescript), chartsPackageJSON)), {
  chartsStyles,
  chartsTypescript,
});

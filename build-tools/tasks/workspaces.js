// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fs = require('node:fs/promises');
const path = require('node:path');
const { rootDir, task, tsc } = require('../utils');
const { fullySpecifyImports } = require('../utils/specifiers');

// These two packages publish from their own folders, so they build into `<folder>/lib`,
// which is the only folder they ship, so the license goes in there too.
function copyLicense(libDir) {
  return Promise.all(['LICENSE', 'NOTICE'].map(file => fs.copyFile(path.join(rootDir, file), path.join(libDir, file))));
}

const globalStyles = task('global-styles', async () => {
  const dir = path.join(rootDir, 'global-styles');
  await fs.rm(path.join(dir, 'lib'), { recursive: true, force: true });
  await tsc('global-styles/tsconfig.json');
  await fs.copyFile(path.join(dir, 'src/index.css'), path.join(dir, 'lib/index.css'));
  await fullySpecifyImports(path.join(dir, 'lib'));
  await copyLicense(path.join(dir, 'lib'));
});

const collectionHooks = task('collection-hooks', async () => {
  const dir = path.join(rootDir, 'collection-hooks');
  await fs.rm(path.join(dir, 'lib'), { recursive: true, force: true });
  await tsc('collection-hooks/tsconfig.json');
  await fullySpecifyImports(path.join(dir, 'lib'));
  await copyLicense(path.join(dir, 'lib'));
});

module.exports = { globalStyles, collectionHooks };

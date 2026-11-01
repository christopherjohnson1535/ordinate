// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('node:path');
const { rootDir, task, tsc } = require('../utils');
const { fullySpecifyImports } = require('../utils/specifiers');

module.exports = task('typescript', async () => {
  await tsc('tsconfig.json');
  await fullySpecifyImports(path.join(rootDir, 'lib/components'));
});

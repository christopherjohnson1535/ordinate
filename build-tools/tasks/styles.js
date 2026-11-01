// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('node:path');
const { rootDir, task } = require('../utils');
const { compileStyles } = require('../utils/styles');

module.exports = task('styles', () =>
  compileStyles({ srcDir: path.join(rootDir, 'src'), outDir: path.join(rootDir, 'lib/components') })
);

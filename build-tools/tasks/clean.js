// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fs = require('node:fs/promises');
const path = require('node:path');
const { rootDir, task } = require('../utils');

const targets = ['lib', 'src/internal/generated', 'src/index.ts'];

module.exports = task('clean', () =>
  Promise.all(targets.map(target => fs.rm(path.join(rootDir, target), { recursive: true, force: true })))
);

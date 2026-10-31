// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { task, tsc } = require('../utils');

module.exports = task('typescript', () => tsc('tsconfig.json'));

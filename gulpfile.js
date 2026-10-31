// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { series, parallel, watch } = require('gulp');
const {
  clean,
  styleDictionary,
  generateIndexFile,
  generateIcons,
  generateTestUtils,
  styles,
  typescript,
  packageJSON,
} = require('./build-tools/tasks');

const build = series(
  clean,
  parallel(styleDictionary, generateIndexFile, generateIcons, generateTestUtils),
  parallel(styles, typescript),
  packageJSON
);

exports.clean = clean;
exports.build = build;

exports.watch = () => {
  watch(['src/**/*.{ts,tsx}', '!src/**/__tests__/**', '!src/index.ts', '!src/test-utils/dom/index.ts'], typescript);
  watch(['src/**/*.scss', '!src/internal/generated/**'], styles);
  watch(['style-dictionary/**/*.ts'], series(styleDictionary, styles));
  watch(['src/icon/icons/*.svg'], series(generateIcons, typescript));
};

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
  docs,
  charts,
  globalStyles,
  collectionHooks,
} = require('./build-tools/tasks');

const build = series(
  clean,
  parallel(styleDictionary, generateIndexFile, generateIcons, generateTestUtils),
  parallel(styles, typescript, globalStyles, collectionHooks),
  parallel(packageJSON, docs, charts)
);

exports.clean = clean;
exports.build = build;
exports.docs = docs;
exports.charts = charts;
exports['global-styles'] = globalStyles;
exports['collection-hooks'] = collectionHooks;

exports.watch = () => {
  watch(['src/**/*.{ts,tsx}', '!src/**/__tests__/**', '!src/index.ts', '!src/test-utils/dom/index.ts'], typescript);
  watch(['src/**/*.scss', '!src/internal/generated/**'], styles);
  watch(['style-dictionary/**/*.ts'], series(styleDictionary, styles));
  watch(['src/icon/icons/*.svg'], series(generateIcons, typescript));
  watch(['src/*/interfaces.ts', 'src/internal/base-component/index.ts'], docs);
  watch(['charts/src/**/*.{ts,tsx}', '!charts/src/**/__tests__/**'], charts.chartsTypescript);
  watch(['charts/src/**/*.scss'], charts.chartsStyles);
};

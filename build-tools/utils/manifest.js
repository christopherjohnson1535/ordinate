// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

function entry(file) {
  return { types: `./${file}.d.ts`, default: `./${file}.js` };
}

/**
 * The `exports` map for a package laid out one folder per module, as the components and
 * the charts are: `<package>/button` loads `button/index.js`. `files` lists the modules
 * that are single files rather than folders, such as `test-utils/dom/core`, and
 * `filePatterns` the folders whose files are entry points, such as `i18n/messages/*`.
 */
function folderExports({ files = [], filePatterns = [] } = {}) {
  return {
    '.': entry('index'),
    ...Object.fromEntries(files.map(file => [`./${file}`, entry(file)])),
    ...Object.fromEntries(filePatterns.map(pattern => [`./${pattern}`, entry(pattern)])),
    './*': entry('*/index'),
    './package.json': './package.json',
  };
}

module.exports = { folderExports };

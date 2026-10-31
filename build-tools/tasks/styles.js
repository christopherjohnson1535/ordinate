// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { createHash } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const postcss = require('postcss');
const postcssModules = require('postcss-modules');
const sass = require('sass');
const { rootDir, task } = require('../utils');

const srcDir = path.join(rootDir, 'src');
const outDir = path.join(rootDir, 'lib/components');

async function findStyleFiles() {
  const entries = await fs.readdir(srcDir, { recursive: true });
  return entries
    .filter(entry => path.basename(entry) === 'styles.scss')
    .filter(entry => !entry.split(path.sep).some(part => part.startsWith('__')))
    .map(entry => path.join(srcDir, entry));
}

function scopedName(relativeDir) {
  const prefix = relativeDir.split(path.sep).join('-');
  return name => {
    const hash = createHash('sha1').update(`${relativeDir}:${name}`).digest('base64url').slice(0, 5);
    return `ord_${prefix}_${name}_${hash}`;
  };
}

async function compileFile(file) {
  const relativeDir = path.relative(srcDir, path.dirname(file));
  const { css } = sass.compile(file, { style: 'expanded', loadPaths: [srcDir] });

  let classNames = {};
  const toScoped = scopedName(relativeDir);
  const result = await postcss([
    postcssModules({
      generateScopedName: name => toScoped(name),
      getJSON: (_, json) => {
        classNames = json;
      },
    }),
  ]).process(css, { from: file });

  const targetDir = path.join(outDir, relativeDir);
  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(path.join(targetDir, 'styles.scoped.css'), result.css);
  await fs.writeFile(
    path.join(targetDir, 'styles.css.js'),
    `import './styles.scoped.css';\nexport default ${JSON.stringify(classNames, null, 2)};\n`
  );
}

module.exports = task('styles', async () => {
  const files = await findStyleFiles();
  await Promise.all(files.map(compileFile));
});

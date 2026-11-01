// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { createHash } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const postcss = require('postcss');
const postcssModules = require('postcss-modules');
const sass = require('sass');

async function findStyleFiles(srcDir) {
  const entries = await fs.readdir(srcDir, { recursive: true });
  return entries
    .filter(entry => path.basename(entry) === 'styles.scss')
    .filter(entry => !entry.split(path.sep).some(part => part.startsWith('__')))
    .map(entry => path.join(srcDir, entry));
}

// `scope` keeps class names apart between packages that use the same folder names.
function scopedName(relativeDir, scope) {
  const prefix = [scope, ...relativeDir.split(path.sep)].filter(Boolean).join('-');
  const hashInput = scope ? `${scope}/${relativeDir}` : relativeDir;
  return name => {
    const hash = createHash('sha1').update(`${hashInput}:${name}`).digest('base64url').slice(0, 5);
    return `ord_${prefix}_${name}_${hash}`;
  };
}

async function compileFile(file, { srcDir, outDir, scope, importers }) {
  const relativeDir = path.relative(srcDir, path.dirname(file));
  const { css } = sass.compile(file, { style: 'expanded', loadPaths: [srcDir], importers });

  let classNames = {};
  const toScoped = scopedName(relativeDir, scope);
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

/**
 * Compiles every `styles.scss` under `srcDir` to a scoped stylesheet and a module that
 * exports the scoped class names, in the same folder under `outDir`.
 */
async function compileStyles({ srcDir, outDir, scope = '', importers = [] }) {
  const files = await findStyleFiles(srcDir);
  await Promise.all(files.map(file => compileFile(file, { srcDir, outDir, scope, importers })));
}

module.exports = { compileStyles };

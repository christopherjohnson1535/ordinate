// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fs = require('node:fs/promises');
const { existsSync, statSync } = require('node:fs');
const path = require('node:path');

// Matches the specifier in `from '...'`, `import '...'` and `import('...')`.
const specifierPattern = /(\bfrom\s*|\bimport\s*\(?\s*)(['"])(\.{1,2}\/[^'"]*)\2/g;

function isFile(file) {
  return existsSync(file) && statSync(file).isFile();
}

/**
 * Turns an extensionless relative specifier into the file Node's ESM loader expects:
 * `./internal` becomes `./internal.js` or `./internal/index.js`. Declaration files
 * point at the `.js` path too, which is what TypeScript's `node16` resolution wants.
 */
function fullySpecify(specifier, fromFile) {
  if (/\.(js|css|json)$/.test(specifier)) {
    return specifier;
  }
  const target = path.resolve(path.dirname(fromFile), specifier);
  const declaration = fromFile.endsWith('.d.ts');
  const asFile = declaration ? `${target}.d.ts` : `${target}.js`;
  const asIndex = path.join(target, declaration ? 'index.d.ts' : 'index.js');
  if (isFile(asFile) || (declaration && isFile(`${target}.js`))) {
    return `${specifier}.js`;
  }
  if (isFile(asIndex)) {
    return `${specifier.replace(/\/$/, '')}/index.js`;
  }
  throw new Error(`Cannot resolve '${specifier}' from ${fromFile}`);
}

/**
 * Rewrites every relative import in the built `.js` and `.d.ts` files under `dir` so
 * the package loads in Node and in bundlers that follow Node's rules, not only in
 * bundlers that guess extensions.
 */
async function fullySpecifyImports(dir) {
  const entries = await fs.readdir(dir, { recursive: true });
  const files = entries.filter(entry => /\.(js|d\.ts)$/.test(entry)).map(entry => path.join(dir, entry));
  await Promise.all(
    files.map(async file => {
      const source = await fs.readFile(file, 'utf8');
      const output = source.replace(
        specifierPattern,
        (_, keyword, quote, specifier) => `${keyword}${quote}${fullySpecify(specifier, file)}${quote}`
      );
      if (output !== source) {
        await fs.writeFile(file, output);
      }
    })
  );
}

module.exports = { fullySpecifyImports };

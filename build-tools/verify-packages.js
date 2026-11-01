// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
//
// Checks the built packages the way an application sees them after `npm install`:
// every entry loads in plain Node through the package's `exports` map, and the type
// declarations resolve under TypeScript's `node16` rules. CSS imports are stubbed, since
// applications hand those to their bundler.
//
//   node build-tools/verify-packages.js
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawnSync } = require('node:child_process');
const { rootDir } = require('./utils');

const packages = {
  '@ordinate-ui/components': path.join(rootDir, 'lib/components'),
  '@ordinate-ui/design-tokens': path.join(rootDir, 'lib/design-tokens'),
  '@ordinate-ui/charts': path.join(rootDir, 'lib/charts'),
  '@ordinate-ui/global-styles': path.join(rootDir, 'global-styles'),
  '@ordinate-ui/collection-hooks': path.join(rootDir, 'collection-hooks'),
};

const workDir = path.join(rootDir, 'node_modules/.cache/verify-packages');

function folderModules(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && fs.existsSync(path.join(dir, entry.name, 'index.js')))
    .map(entry => entry.name);
}

// Every specifier an application could import, read from each package's own exports map.
function entrySpecifiers() {
  const specifiers = [];
  for (const [name, dir] of Object.entries(packages)) {
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
    for (const key of Object.keys(manifest.exports)) {
      if (key === './package.json' || key.endsWith('.scss') || key.endsWith('.css')) {
        continue;
      }
      if (key === './*') {
        specifiers.push(...folderModules(dir).map(folder => `${name}/${folder}`));
      } else if (key.endsWith('/*')) {
        const folder = key.slice(2, -2);
        const files = fs.readdirSync(path.join(dir, folder)).filter(file => file.endsWith('.js'));
        specifiers.push(...files.map(file => `${name}/${folder}/${file.slice(0, -3)}`));
      } else {
        specifiers.push(key === '.' ? name : `${name}/${key.slice(2)}`);
      }
    }
  }
  return specifiers;
}

function prepareWorkDir() {
  fs.rmSync(workDir, { recursive: true, force: true });
  const scope = path.join(workDir, 'node_modules/@ordinate-ui');
  fs.mkdirSync(scope, { recursive: true });
  for (const [name, dir] of Object.entries(packages)) {
    fs.symlinkSync(dir, path.join(scope, name.split('/')[1]), 'dir');
  }
  // Resolves the packages from this folder, as if installed, so sibling packages find
  // each other; stubs CSS.
  fs.writeFileSync(
    path.join(workDir, 'hooks.mjs'),
    `const installed = ${JSON.stringify(pathToFileURL(path.join(workDir, 'index.mjs')).href)};
export async function resolve(specifier, context, next) {
  return next(specifier, specifier.startsWith('@ordinate-ui/') ? { ...context, parentURL: installed } : context);
}
export async function load(url, context, next) {
  return url.endsWith('.css') ? { format: 'module', source: '', shortCircuit: true } : next(url, context);
}
`
  );
  fs.writeFileSync(
    path.join(workDir, 'register.mjs'),
    "import { register } from 'node:module';\nregister('./hooks.mjs', import.meta.url);\n"
  );
}

function verifyRuntime(specifiers) {
  const script = `
const failures = [];
for (const specifier of ${JSON.stringify(specifiers)}) {
  try {
    await import(specifier);
  } catch (error) {
    failures.push(specifier + ': ' + error.message.split('\\n')[0]);
  }
}
if (failures.length) {
  console.error(failures.join('\\n'));
  process.exit(1);
}
`;
  fs.writeFileSync(path.join(workDir, 'index.mjs'), script);
  return spawnSync(process.execPath, ['--import', './register.mjs', 'index.mjs'], { cwd: workDir, stdio: 'inherit' });
}

function verifyTypes(specifiers) {
  const lines = specifiers.map((specifier, index) => `import * as m${index} from '${specifier}';\nvoid m${index};`);
  fs.writeFileSync(path.join(workDir, 'types.ts'), `${lines.join('\n')}\nexport {};\n`);
  fs.writeFileSync(
    path.join(workDir, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        module: 'node16',
        moduleResolution: 'node16',
        target: 'ES2022',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        jsx: 'react-jsx',
        strict: true,
        noEmit: true,
        skipLibCheck: false,
        // Resolve from the installed location, so one package's declarations find its siblings.
        preserveSymlinks: true,
        types: [],
        typeRoots: [path.join(rootDir, 'node_modules/@types')],
      },
      files: ['types.ts'],
    })
  );
  // `types.ts` is ESM to TypeScript only inside a `"type": "module"` package.
  fs.writeFileSync(path.join(workDir, 'package.json'), '{ "type": "module" }\n');
  return spawnSync(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', workDir], {
    cwd: workDir,
    stdio: 'inherit',
  });
}

function main() {
  for (const [name, dir] of Object.entries(packages)) {
    if (!fs.existsSync(path.join(dir, 'package.json'))) {
      console.error(`${name} is not built. Run npm run build first.`);
      process.exit(1);
    }
  }
  prepareWorkDir();
  const specifiers = entrySpecifiers();

  const runtime = verifyRuntime(specifiers);
  if (runtime.status !== 0) {
    console.error('Some entries do not load in Node.');
    process.exit(1);
  }
  const types = verifyTypes(specifiers);
  if (types.status !== 0) {
    console.error('Some type declarations do not resolve under node16.');
    process.exit(1);
  }
  process.stdout.write(`Verified ${specifiers.length} entries across ${Object.keys(packages).length} packages.\n`);
}

main();

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Writes lib/docs, the publishable @ordinate/docs package: the built documentation site and the
// `ordinate-docs` command that serves it. Run `npm run docs:package`, which builds the site first.
const fs = require('node:fs/promises');
const path = require('node:path');
const { rootDir } = require('./utils');

const siteDir = path.join(rootDir, 'docs-site');
const outDir = path.join(rootDir, 'lib/docs');

async function main() {
  const built = path.join(siteDir, 'dist');
  await fs.access(path.join(built, 'index.html')).catch(() => {
    throw new Error('docs-site/dist is missing. Run `npm run docs:build` first.');
  });

  const root = JSON.parse(await fs.readFile(path.join(rootDir, 'package.json'), 'utf8'));
  const manifest = {
    name: '@ordinate/docs',
    // The docs carry the library's version, so the docs a project installs match its components.
    version: root.version,
    description: 'The Ordinate documentation, served from your own machine.',
    license: root.license,
    repository: { ...root.repository, directory: 'docs-site' },
    type: 'module',
    bin: { 'ordinate-docs': './bin/ordinate-docs.mjs' },
    files: ['bin', 'site', 'README.md', 'LICENSE', 'NOTICE'],
    engines: { node: '>=18' },
  };

  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(path.join(outDir, 'bin'), { recursive: true });
  await fs.cp(built, path.join(outDir, 'site'), { recursive: true });
  await fs.copyFile(path.join(siteDir, 'bin/ordinate-docs.mjs'), path.join(outDir, 'bin/ordinate-docs.mjs'));
  await fs.chmod(path.join(outDir, 'bin/ordinate-docs.mjs'), 0o755);
  await fs.copyFile(path.join(siteDir, 'README.md'), path.join(outDir, 'README.md'));
  await Promise.all(['LICENSE', 'NOTICE'].map(file => fs.copyFile(path.join(rootDir, file), path.join(outDir, file))));
  await fs.writeFile(path.join(outDir, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.warn(`docs: wrote ${path.relative(rootDir, outDir)} (@ordinate/docs ${root.version})`);
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});

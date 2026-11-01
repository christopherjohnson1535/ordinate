// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
//
// Publishes every Ordinate package to npm at one version.
//
//   npm run release -- 0.2.0             # set the version, build, test, verify, publish
//   npm run release -- 0.2.0 --dry-run   # everything except the upload
//
// Run `npm login` first. npm asks for a one-time password per package if your account
// uses two-factor authentication.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { rootDir } = require('./utils');

// Manifests that carry the version. The components and design tokens take theirs from
// the root at build time; the charts take theirs from charts/package.json.
const manifests = [
  'package.json',
  'charts/package.json',
  'global-styles/package.json',
  'collection-hooks/package.json',
];

// Dependencies first, so a package never points at a sibling version that is not up yet.
const publishOrder = ['lib/design-tokens', 'lib/components', 'global-styles', 'collection-hooks', 'lib/charts'];

function run(command, args) {
  const result = spawnSync(command, args, { cwd: rootDir, stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function output(command, args) {
  return spawnSync(command, args, { cwd: rootDir, encoding: 'utf8' }).stdout.trim();
}

function setVersion(version) {
  for (const file of manifests) {
    const target = path.join(rootDir, file);
    const manifest = JSON.parse(fs.readFileSync(target, 'utf8'));
    manifest.version = version;
    fs.writeFileSync(target, `${JSON.stringify(manifest, null, 2)}\n`);
  }
  run('npm', ['install', '--package-lock-only', '--no-audit', '--no-fund']);
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const version = args.find(arg => !arg.startsWith('--'));
  if (!version || !/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
    console.error('Usage: npm run release -- <version> [--dry-run]');
    process.exit(1);
  }
  if (!dryRun && output('git', ['status', '--porcelain'])) {
    console.error('Commit or stash your changes first, so the release matches a commit.');
    process.exit(1);
  }

  setVersion(version);
  run('npm', ['run', 'build']);
  run('npm', ['test']);
  run(process.execPath, ['build-tools/verify-packages.js']);

  for (const dir of publishOrder) {
    run('npm', [
      'publish',
      `./${dir}`,
      '--access',
      'public',
      ...(version.includes('-') ? ['--tag', 'next'] : []),
      ...(dryRun ? ['--dry-run'] : []),
    ]);
  }

  if (dryRun) {
    console.warn(`\nDry run of ${version} finished. The version change is left in place; revert it with git checkout.`);
  } else {
    console.warn(
      `\nPublished ${version}. Commit and tag it:\n\n  git commit -am "chore: release ${version}"\n  git tag v${version}\n  git push --follow-tags\n`
    );
  }
}

main();

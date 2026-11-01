// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Bundles each component the way an application would import it, measures the result and
// compares it with the budgets in size-limits.json. Run `npm run build` first.
//
// Every component carries the shared token stylesheet (revisions, density and styles). It is
// measured once, as its own row, and left out of each component's size, so adding a token
// changes one budget instead of all of them.
//
//   npm run size              check every component against its budget
//   npm run size -- --update  rewrite the budgets as the current size plus headroom
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const esbuild = require('esbuild');
const { rootDir } = require('./utils');

const componentsDir = path.join(rootDir, 'lib', 'components');
const limitsFile = path.join(rootDir, 'size-limits.json');
const notEntries = new Set(['internal', 'test-utils']);
const sharedEntry = path.join(componentsDir, 'internal', 'base-component', 'index.js');
const sharedName = '(shared tokens)';
const headroom = 1.15;
const roundTo = 100;

function listEntries() {
  if (!fs.existsSync(componentsDir)) {
    throw new Error('lib/components is missing. Run `npm run build` first.');
  }
  return fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !notEntries.has(entry.name))
    .map(entry => entry.name)
    .filter(name => fs.existsSync(path.join(componentsDir, name, 'index.js')))
    .sort();
}

// JavaScript and CSS both reach the user, so a component's size is the sum of the two outputs.
async function measureEntry(entryPoint) {
  const result = await esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    minify: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    outdir: 'out',
    external: ['react', 'react/*', 'react-dom', 'react-dom/*'],
    loader: { '.woff': 'empty', '.woff2': 'empty', '.svg': 'empty' },
    logLevel: 'silent',
  });
  return result.outputFiles.reduce(
    (size, file) => ({
      minified: size.minified + file.contents.length,
      gzip: size.gzip + zlib.gzipSync(file.contents, { level: 9 }).length,
    }),
    { minified: 0, gzip: 0 }
  );
}

const measure = name => measureEntry(path.join(componentsDir, name, 'index.js'));

function withoutShared(size, shared) {
  return { minified: Math.max(size.minified - shared.minified, 0), gzip: Math.max(size.gzip - shared.gzip, 0) };
}

function budgetFor(size) {
  return Math.ceil((size * headroom) / roundTo) * roundTo;
}

function readLimits() {
  return fs.existsSync(limitsFile) ? JSON.parse(fs.readFileSync(limitsFile, 'utf8')) : {};
}

function writeLine(text) {
  process.stdout.write(`${text}\n`);
}

function formatBytes(bytes) {
  return bytes === undefined ? '-' : `${(bytes / 1024).toFixed(1)} kB`;
}

function statusFor(size, limit) {
  if (!limit) {
    return 'no budget';
  }
  const over = size.minified > limit.minified || size.gzip > limit.gzip;
  return over ? 'OVER' : 'ok';
}

function printTable(rows) {
  const header = ['Component', 'Minified', 'Budget', 'Gzipped', 'Budget', 'Status'];
  const lines = rows.map(({ name, size, limit, status }) => [
    name,
    formatBytes(size.minified),
    formatBytes(limit?.minified),
    formatBytes(size.gzip),
    formatBytes(limit?.gzip),
    status,
  ]);
  const widths = header.map((cell, column) => Math.max(cell.length, ...lines.map(line => line[column].length)));
  const pad = (cell, column) => (column === 0 ? cell.padEnd(widths[column]) : cell.padStart(widths[column]));
  const format = line => line.map(pad).join('  ');
  const rule = widths.map(width => '-'.repeat(width)).join('  ');
  writeLine([format(header), rule, ...lines.map(format)].join('\n'));
}

async function main() {
  const update = process.argv.includes('--update');
  const components = listEntries();
  const shared = await measureEntry(sharedEntry);
  const names = [sharedName, ...components];
  const sizes = [shared, ...(await Promise.all(components.map(measure))).map(size => withoutShared(size, shared))];

  if (update) {
    const limits = Object.fromEntries(
      names.map((name, index) => [
        name,
        { minified: budgetFor(sizes[index].minified), gzip: budgetFor(sizes[index].gzip) },
      ])
    );
    fs.writeFileSync(limitsFile, `${JSON.stringify(limits, null, 2)}\n`);
    writeLine(`Wrote budgets for ${names.length} components to size-limits.json.`);
    return;
  }

  const limits = readLimits();
  const rows = names.map((name, index) => {
    const limit = limits[name];
    return { name, size: sizes[index], limit, status: statusFor(sizes[index], limit) };
  });
  printTable(rows);

  const over = rows.filter(row => row.status === 'OVER');
  const missing = rows.filter(row => row.status === 'no budget');
  if (missing.length > 0) {
    console.error(`\nNo budget for: ${missing.map(row => row.name).join(', ')}. Run \`npm run size -- --update\`.`);
  }
  if (over.length > 0) {
    console.error(`\nOver budget: ${over.map(row => row.name).join(', ')}.`);
  }
  if (over.length > 0 || missing.length > 0) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});

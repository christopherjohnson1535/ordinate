// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('node:path');
const { spawn } = require('node:child_process');

const rootDir = path.resolve(__dirname, '../..');

function task(name, fn) {
  Object.defineProperty(fn, 'name', { value: name });
  return fn;
}

function exec(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: rootDir, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', code =>
      code === 0 ? resolve() : reject(new Error(`${path.basename(command)} exited with code ${code}`))
    );
  });
}

function tsc(project) {
  return exec(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', project]);
}

function toKebabCase(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function toPascalCase(name) {
  return name.replace(/(^|-)([a-z])/g, (_, __, letter) => letter.toUpperCase());
}

module.exports = { rootDir, task, exec, tsc, toKebabCase, toPascalCase };

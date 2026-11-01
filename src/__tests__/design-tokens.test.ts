// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import * as designTokens from '../../lib/design-tokens/index.js';

const require = createRequire(import.meta.url);
const { allTokenNames } =
  require('../../lib/style-dictionary/index.js') as typeof import('../../style-dictionary/index');

const packageDir = path.resolve(__dirname, '../../lib/design-tokens');
const read = (file: string) => fs.readFileSync(path.join(packageDir, file), 'utf8');
const toKebabCase = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const reference = (name: string) => `var(--ord-${toKebabCase(name)})`;

describe('@ordinate/design-tokens', () => {
  test('exports every token as a reference to its custom property, and nothing else', () => {
    expect(Object.keys(designTokens).sort()).toEqual([...allTokenNames].sort());
    const tokens = designTokens as Record<string, string>;
    const wrong = allTokenNames.filter(name => tokens[name] !== reference(name));
    expect(wrong).toEqual([]);
  });

  test('types every export', () => {
    const declarations = read('index.d.ts');
    const missing = allTokenNames.filter(
      name => !declarations.includes(`export declare const ${name}: '${reference(name)}';`)
    );
    expect(missing).toEqual([]);
  });

  test('defines the same Sass variables as the internal token namespace', () => {
    const variables = (scss: string) => [...scss.matchAll(/^\$([a-z0-9-]+): (.+);$/gm)].map(match => match.slice(1));
    const internal = fs.readFileSync(path.resolve(__dirname, '../internal/generated/styles/tokens.scss'), 'utf8');
    expect(variables(read('index.scss'))).toEqual(variables(internal));
    expect(variables(read('index.scss'))).toHaveLength(allTokenNames.length);
  });

  test('ships a manifest named and versioned after the library', () => {
    const root = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'));
    const manifest = JSON.parse(read('package.json'));
    expect(manifest).toMatchObject({
      name: '@ordinate/design-tokens',
      version: root.version,
      license: 'Apache-2.0',
      main: './index.js',
      types: './index.d.ts',
    });
  });
});

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

// The style dictionary compiles to CommonJS for the build tools, so load it with Node's own loader.
const require = createRequire(import.meta.url);
const { allTokenNames, resolveTokens, revisions } =
  require('../../lib/style-dictionary/index.js') as typeof import('../../style-dictionary/index');

const generatedCss = fs.readFileSync(
  path.resolve(__dirname, '../../lib/components/internal/base-component/styles.scoped.css'),
  'utf8'
);

const toCssVariable = (name: string) => `--ord-${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

function blockFor(revisionId: string) {
  const className = `.ord-revision-${revisionId.replace(/\./g, '-')}`;
  const match = generatedCss.split('}').find(block => block.split('{')[0].includes(className));
  if (!match) {
    throw new Error(`No CSS block for revision ${revisionId}`);
  }
  return match;
}

describe('token contract', () => {
  test('revision ids are unique calendar versions, oldest first', () => {
    const ids = revisions.map(revision => revision.id);
    ids.forEach(id => expect(id).toMatch(/^\d{4}\.\d+$/));
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))).toEqual(ids);
  });

  describe.each(revisions.map(revision => [revision.id, revision] as const))('revision %s', (id, revision) => {
    test('defines every token and nothing else', () => {
      expect(Object.keys(revision.tokens).sort()).toEqual([...allTokenNames].sort());
    });

    test('resolves every reference', () => {
      expect(() => resolveTokens(revision.tokens)).not.toThrow();
    });

    test('ships every token in the generated CSS', () => {
      const block = blockFor(id);
      const missing = allTokenNames.filter(name => !block.includes(`${toCssVariable(name)}:`));
      expect(missing).toEqual([]);
    });
  });
});

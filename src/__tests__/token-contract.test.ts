// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

// The style dictionary compiles to CommonJS for the build tools, so load it with Node's own loader.
const require = createRequire(import.meta.url);
const { allTokenNames, resolveTokens, revisions, styles } =
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

describe('density', () => {
  const compactBlock = generatedCss.split('}').find(block => block.split('{')[0].includes('.ord-compact-mode'));

  test('compact mode repoints exactly the tokens that have density values', () => {
    const densityTokens = new Set<string>();
    for (const revision of revisions) {
      for (const [name, value] of Object.entries(resolveTokens(revision.tokens))) {
        if (typeof value === 'object' && 'comfortable' in value) {
          densityTokens.add(toCssVariable(name));
        }
      }
    }
    const repointed = [...(compactBlock ?? '').matchAll(/(--ord-[a-z0-9-]+):/g)].map(match => match[1]);
    expect(repointed.sort()).toEqual([...densityTokens].sort());
    expect(densityTokens.size).toBeGreaterThan(0);
  });

  test('compact mode also applies inside nested revision subtrees', () => {
    const selector = (compactBlock ?? '').split('{')[0];
    revisions.forEach(revision => expect(selector).toContain(`.ord-revision-${revision.id.replace(/\./g, '-')}`));
  });

  test('a token cannot vary by both mode and density', () => {
    const [{ tokens }] = revisions;
    const broken = { ...tokens, spaceScaledS: '{colorTextBody}' };
    expect(() => resolveTokens(broken)).not.toThrow();
    const both = { ...tokens, colorTextBody: { light: '{spaceScaledS}', dark: '#fff' } };
    expect(() => resolveTokens(both)).toThrow(/both mode and density/);
  });
});

describe.each(styles.map(style => [style.id, style] as const))('style %s', (id, style) => {
  const block = generatedCss.split('}').find(part => part.split('{')[0].includes(`.ord-style-${id}`)) ?? '';

  test('overrides only tokens in the contract, and resolves against every revision', () => {
    Object.keys(style.overrides).forEach(name => expect(allTokenNames).toContain(name));
    revisions.forEach(revision => {
      expect(() => resolveTokens({ ...revision.tokens, ...style.overrides })).not.toThrow();
    });
  });

  test('ships every override, and reaches revision subtrees inside it', () => {
    const selector = block.split('{')[0];
    revisions.forEach(revision => expect(selector).toContain(`.ord-revision-${revision.id.replace(/\./g, '-')}`));
    Object.keys(style.overrides).forEach(name => expect(block).toContain(`${toCssVariable(name)}:`));
  });

  test('keeps references live instead of copying revision values', () => {
    expect(block).not.toMatch(/\{[a-zA-Z0-9]+\}/);
    const references = Object.values(style.overrides).filter(
      value => typeof value === 'string' && value.startsWith('{')
    );
    if (references.length) {
      expect(block).toContain('var(--ord-');
    }
  });
});

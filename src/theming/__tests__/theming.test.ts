// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { afterEach, describe, expect, test, vi } from 'vitest';

import { applyTheme, generateThemeStylesheet, Theme } from '../../../lib/components/theming';

const themeStyles = () => Array.from(document.head.querySelectorAll('style[data-ord-theme]'));

afterEach(() => {
  themeStyles().forEach(style => style.remove());
  vi.restoreAllMocks();
});

describe('generateThemeStylesheet', () => {
  test('writes plain values and light-dark pairs', () => {
    const css = generateThemeStylesheet({
      theme: {
        tokens: {
          colorTextLink: { light: '#0b5cad', dark: '#7cc4ff' },
          borderRadiusButton: '999px',
        },
      },
    });
    expect(css).toContain('--ord-color-text-link: light-dark(#0b5cad, #7cc4ff);');
    expect(css).toContain('--ord-border-radius-button: 999px;');
  });

  test('outranks the revision classes on the element and in nested revision subtrees', () => {
    const css = generateThemeStylesheet({ theme: { tokens: { fontFamilyBase: 'serif' } } });
    expect(css).toContain(':root:root,');
    expect(css).toContain(':root:root :is(.ord-revision-2026-1, .ord-revision-2026-2)');
  });

  test('ignores tokens that are not themeable', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const theme = { tokens: { colorTextError: 'hotpink', colorTextAccent: 'teal' } } as unknown as Theme;
    const css = generateThemeStylesheet({ theme });
    expect(css).not.toContain('hotpink');
    expect(css).toContain('--ord-color-text-accent: teal;');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"colorTextError" is not a themeable token'));
  });

  test('rejects values that could escape the declaration', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const css = generateThemeStylesheet({ theme: { tokens: { colorTextLink: 'red; } body { display: none' } } });
    expect(css).toBe('');
  });

  test('returns an empty string when nothing is themed', () => {
    expect(generateThemeStylesheet({ theme: { tokens: {} } })).toBe('');
  });
});

describe('applyTheme', () => {
  test('injects one stylesheet for the document and removes it on reset', () => {
    const { reset } = applyTheme({ theme: { tokens: { colorTextAccent: 'teal' } } });
    expect(themeStyles()).toHaveLength(1);
    expect(themeStyles()[0].textContent).toContain(':root:root');
    reset();
    expect(themeStyles()).toHaveLength(0);
  });

  test('scopes a theme to a subtree', () => {
    const target = document.createElement('section');
    document.body.appendChild(target);
    const { reset } = applyTheme({ theme: { tokens: { colorTextAccent: 'teal' } }, target, nonce: 'abc' });
    const id = target.getAttribute('data-ord-theme');
    expect(id).toBeTruthy();
    const [style] = themeStyles() as HTMLStyleElement[];
    expect(style.textContent).toContain(`[data-ord-theme="${id}"][data-ord-theme="${id}"]`);
    expect(style.nonce).toBe('abc');
    reset();
    expect(target.hasAttribute('data-ord-theme')).toBe(false);
    target.remove();
  });
});

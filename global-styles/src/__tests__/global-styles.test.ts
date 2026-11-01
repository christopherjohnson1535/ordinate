// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  applyDensity,
  applyMode,
  applyRevision,
  applyStyle,
  Density,
  disableMotion,
  Mode,
  Revision,
  Style,
} from '../index';

afterEach(() => {
  document.body.className = '';
  vi.restoreAllMocks();
});

describe('applyMode', () => {
  test('switches between light, dark and system mode', () => {
    applyMode(Mode.Dark);
    expect(document.body.className).toBe('ord-dark-mode');
    applyMode(Mode.System);
    expect(document.body.className).toBe('ord-system-mode');
    applyMode(Mode.Light);
    expect(document.body.className).toBe('ord-light-mode');
  });

  test('null removes the mode class', () => {
    applyMode(Mode.Dark);
    applyMode(null);
    expect(document.body.className).toBe('');
  });

  test('warns about an unsupported mode and changes nothing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    applyMode(Mode.Dark);
    applyMode('sepia' as Mode);
    expect(warn).toHaveBeenCalledOnce();
    expect(document.body.className).toBe('ord-dark-mode');
  });
});

describe('applyRevision', () => {
  test('keeps only one revision class on the target', () => {
    applyRevision(Revision.V2026_1);
    applyRevision(Revision.V2026_2);
    expect(document.body.className).toBe('ord-revision-2026-2');
  });

  test('can scope a revision to a subtree', () => {
    const section = document.createElement('section');
    applyRevision(Revision.V2026_2, section);
    expect(section.className).toBe('ord-revision-2026-2');
    expect(document.body.className).toBe('');
  });

  test('leaves unrelated classes alone', () => {
    document.body.className = 'app ord-dark-mode';
    applyRevision(Revision.V2026_2);
    applyRevision(null);
    expect(document.body.className).toBe('app ord-dark-mode');
  });
});

test('disableMotion toggles the motion class', () => {
  disableMotion(true);
  expect(document.body.classList.contains('ord-motion-disabled')).toBe(true);
  disableMotion(false);
  expect(document.body.classList.contains('ord-motion-disabled')).toBe(false);
});

describe('applyDensity', () => {
  test('compact adds the compact class and comfortable removes it', () => {
    applyDensity(Density.Compact);
    expect(document.body.className).toBe('ord-compact-mode');
    applyDensity(Density.Comfortable);
    expect(document.body.className).toBe('');
  });

  test('can scope density to a subtree', () => {
    const section = document.createElement('section');
    applyDensity(Density.Compact, section);
    expect(section.className).toBe('ord-compact-mode');
    expect(document.body.className).toBe('');
  });

  test('warns about an unsupported density and changes nothing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    applyDensity('roomy' as Density);
    expect(warn).toHaveBeenCalledOnce();
    expect(document.body.className).toBe('');
  });
});

describe('applyStyle', () => {
  test('keeps one style class, and console removes it', () => {
    applyStyle(Style.Editorial);
    expect(document.body.className).toBe('ord-style-editorial');
    applyStyle(Style.Shopfront);
    expect(document.body.className).toBe('ord-style-shopfront');
    applyStyle(Style.Console);
    expect(document.body.className).toBe('');
  });

  test('can scope a style to a subtree and leaves other classes alone', () => {
    const section = document.createElement('section');
    section.className = 'hero';
    applyStyle(Style.Studio, section);
    expect(section.className).toBe('hero ord-style-studio');
    applyStyle(null, section);
    expect(section.className).toBe('hero');
  });

  test('warns about an unsupported style and changes nothing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    applyStyle(Style.Studio);
    applyStyle('baroque' as Style);
    expect(warn).toHaveBeenCalledOnce();
    expect(document.body.className).toBe('ord-style-studio');
  });
});

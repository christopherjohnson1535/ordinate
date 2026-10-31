// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { afterEach, describe, expect, test } from 'vitest';

import { getIsRtl, getLogicalArrowStep } from '../../../lib/components/internal/direction';

afterEach(() => {
  document.documentElement.removeAttribute('dir');
  document.body.innerHTML = '';
});

describe('direction', () => {
  test('reads the inherited direction', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    expect(getIsRtl(element)).toBe(false);
    element.style.direction = 'rtl';
    expect(getIsRtl(element)).toBe(true);
    expect(getIsRtl(null)).toBe(false);
  });

  test('flips horizontal arrow keys in right-to-left layout', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    expect(getLogicalArrowStep('ArrowRight', element)).toBe(1);
    expect(getLogicalArrowStep('ArrowLeft', element)).toBe(-1);
    element.style.direction = 'rtl';
    expect(getLogicalArrowStep('ArrowRight', element)).toBe(-1);
    expect(getLogicalArrowStep('ArrowLeft', element)).toBe(1);
    expect(getLogicalArrowStep('ArrowDown', element)).toBe(0);
  });
});

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test } from 'vitest';

import {
  computeFloatingPosition,
  FloatingPositionInput,
  toPhysicalSide,
} from '../../../lib/components/internal/components/floating-panel/position';

const viewport = { width: 1000, height: 800 };
const arrow = { depth: 8, breadth: 16 };

function place(overrides: Partial<FloatingPositionInput>) {
  return computeFloatingPosition({
    trigger: { top: 380, bottom: 420, left: 480, right: 520 },
    panel: { width: 200, height: 100 },
    viewport,
    arrow,
    preferredSide: 'right',
    rtl: false,
    gap: 4,
    margin: 8,
    ...overrides,
  });
}

describe('computeFloatingPosition', () => {
  test.each([
    ['top', { top: 380 - 12 - 100, left: 400 }],
    ['bottom', { top: 420 + 12, left: 400 }],
    ['left', { top: 350, left: 480 - 12 - 200 }],
    ['right', { top: 350, left: 520 + 12 }],
  ] as const)('places the panel on the preferred %s side, centered on the trigger', (side, expected) => {
    const result = place({ preferredSide: side });
    expect(result.side).toBe(side);
    expect({ top: result.top, left: result.left }).toEqual(expected);
  });

  test('right and left follow the reading direction', () => {
    expect(toPhysicalSide('right', true)).toBe('left');
    expect(toPhysicalSide('left', true)).toBe('right');
    expect(toPhysicalSide('top', true)).toBe('top');
    const result = place({ preferredSide: 'right', rtl: true });
    expect(result.side).toBe('right');
    expect(result.physicalSide).toBe('left');
    expect(result.left).toBe(480 - 12 - 200);
  });

  test('flips to the opposite side when the preferred side has no room', () => {
    const nearTop = place({ preferredSide: 'top', trigger: { top: 40, bottom: 60, left: 480, right: 520 } });
    expect(nearTop.side).toBe('bottom');
    expect(nearTop.top).toBe(60 + 12);

    const nearEnd = place({ preferredSide: 'right', trigger: { top: 380, bottom: 420, left: 900, right: 940 } });
    expect(nearEnd.side).toBe('left');
  });

  test('tries the sides across when neither the preferred side nor its opposite fits', () => {
    const result = place({ preferredSide: 'right', panel: { width: 600, height: 100 } });
    expect(result.side).toBe('bottom');
  });

  test('takes the side where the panel overflows least when nothing fits', () => {
    const result = place({
      preferredSide: 'top',
      panel: { width: 200, height: 900 },
      trigger: { top: 100, bottom: 120, left: 480, right: 520 },
    });
    // Beside the trigger it overflows by 116 pixels, below it by 240.
    expect(result.side).toBe('right');
    expect(result.top).toBe(8);
  });

  test('keeps the panel inside the viewport and points the arrow at the trigger', () => {
    const result = place({ preferredSide: 'bottom', trigger: { top: 100, bottom: 120, left: 10, right: 30 } });
    expect(result.left).toBe(8);
    expect(result.arrowOffset).toBe(16);

    const centered = place({ preferredSide: 'bottom' });
    expect(centered.arrowOffset).toBe(100);
  });

  test('keeps the arrow off the corners of the panel', () => {
    const result = place({ preferredSide: 'bottom', trigger: { top: 100, bottom: 120, left: 0, right: 4 } });
    expect(result.arrowOffset).toBe(arrow.breadth / 2 + arrow.depth);
  });

  test('centers the arrow on a panel too small to keep it off the corners', () => {
    const result = place({ preferredSide: 'bottom', panel: { width: 20, height: 20 } });
    expect(result.arrowOffset).toBe(10);
  });
});

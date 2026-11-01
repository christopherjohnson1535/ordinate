// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test } from 'vitest';

import { computeSlices, placeLabels } from '../../../../lib/charts/internal/pie/layout';
import { getSeriesStyle, getThresholdStyle } from '../../../../lib/charts/internal/series-style';
import { arcPath, areaPath, linePath, polarToCartesian } from '../../../../lib/charts/internal/utils/paths';
import { createBandScale, createContinuousScale, valueKey } from '../../../../lib/charts/internal/utils/scales';
import { stackExtent, stackValues } from '../../../../lib/charts/internal/utils/stack';
import { estimateTextWidth, truncateText } from '../../../../lib/charts/internal/utils/text';

describe('continuous scales', () => {
  test('a linear scale maps and inverts', () => {
    const scale = createContinuousScale('linear', [0, 100], [0, 500]);
    expect(scale.map(50)).toBe(250);
    expect(scale.invert(100)).toBe(20);
    expect(scale.ticks(5)).toEqual([0, 20, 40, 60, 80, 100]);
  });

  test('a vertical range runs bottom to top', () => {
    const scale = createContinuousScale('linear', [0, 10], [200, 0]);
    expect(scale.map(0)).toBe(200);
    expect(scale.map(10)).toBe(0);
  });

  test('a log scale spaces powers of ten evenly and cannot show zero', () => {
    const scale = createContinuousScale('log', [1, 1000], [0, 300]);
    expect(scale.map(10)).toBeCloseTo(100);
    expect(scale.map(100)).toBeCloseTo(200);
    expect(scale.map(0)).toBeNaN();
    expect(scale.invert(200)).toBeCloseTo(100);
  });

  test('a time scale accepts dates and reports its tick interval', () => {
    const start = new Date(2026, 0, 1);
    const end = new Date(2026, 0, 2);
    const scale = createContinuousScale('time', [start.getTime(), end.getTime()], [0, 240]);
    expect(scale.map(new Date(2026, 0, 1, 12))).toBe(120);
    expect(scale.tickInterval(4)).toEqual({ unit: 'hour', step: 6 });
  });

  test('a domain of one value maps to the middle', () => {
    expect(createContinuousScale('linear', [5, 5], [0, 100]).map(5)).toBe(50);
  });
});

describe('band scales', () => {
  test('splits the range into bands with padding', () => {
    const scale = createBandScale(['a', 'b', 'c', 'd'], [0, 400], { paddingInner: 0.2, paddingOuter: 0.1 });
    expect(scale.step).toBeCloseTo(400 / 4);
    expect(scale.bandwidth).toBeCloseTo(scale.step * 0.8);
    expect(scale.map('a')).toBeLessThan(scale.map('b'));
    expect(scale.map('missing')).toBeNaN();
  });

  test('runs backward on a reversed range, as in right-to-left layout', () => {
    const scale = createBandScale(['a', 'b'], [200, 0]);
    expect(scale.map('a')).toBe(150);
    expect(scale.map('b')).toBe(50);
  });

  test('matches equal dates and tells numbers from strings', () => {
    const scale = createBandScale([new Date(2026, 0, 1), 1, '1'], [0, 300]);
    expect(scale.indexOf(new Date(2026, 0, 1))).toBe(0);
    expect(scale.indexOf(1)).toBe(1);
    expect(scale.indexOf('1')).toBe(2);
    expect(valueKey(1)).not.toBe(valueKey('1'));
  });
});

describe('paths', () => {
  test('linePath joins points and breaks at points that cannot be drawn', () => {
    expect(
      linePath([
        [0, 0],
        [10, 5.555],
        [20, 10],
      ])
    ).toBe('M0,0L10,5.56L20,10');
    expect(
      linePath([
        [0, 0],
        [10, Number.NaN],
        [20, 10],
        [30, 0],
      ])
    ).toBe('M0,0M20,10L30,0');
  });

  test('areaPath closes a band between two edges', () => {
    expect(
      areaPath(
        [
          [0, 10],
          [10, 5],
        ],
        [
          [0, 20],
          [10, 20],
        ]
      )
    ).toBe('M0,10L10,5L10,20L0,20Z');
    expect(areaPath([], [])).toBe('');
  });

  test('polar coordinates start at twelve o clock and run clockwise', () => {
    const [x, y] = polarToCartesian(0, 0, 10, Math.PI / 2);
    expect(x).toBeCloseTo(10);
    expect(y).toBeCloseTo(0);
  });

  test('arcPath draws slices, ring segments and full circles', () => {
    const quarter = arcPath({ cx: 0, cy: 0, innerRadius: 0, outerRadius: 10, startAngle: 0, endAngle: Math.PI / 2 });
    expect(quarter).toBe('M0,-10A10,10 0 0 1 10,0L0,0Z');
    const ring = arcPath({ cx: 0, cy: 0, innerRadius: 5, outerRadius: 10, startAngle: 0, endAngle: Math.PI / 2 });
    expect(ring).toContain('A5,5 0 0 0 0,-5Z');
    const full = arcPath({ cx: 0, cy: 0, innerRadius: 0, outerRadius: 10, startAngle: 0, endAngle: 2 * Math.PI });
    expect(full.match(/A/g)).toHaveLength(2);
    const mirrored = arcPath({ cx: 0, cy: 0, innerRadius: 0, outerRadius: 10, startAngle: 0, endAngle: -Math.PI / 2 });
    expect(mirrored).toContain('0 0 0 -10,0');
  });
});

describe('stacking', () => {
  test('stacks positives up and negatives down, position by position', () => {
    const stacks = stackValues([
      [1, -2, 3],
      [2, -1, undefined],
      [3, 4],
    ]);
    expect(stacks[0]).toEqual([
      [0, 1],
      [0, -2],
      [0, 3],
    ]);
    expect(stacks[1]).toEqual([
      [1, 3],
      [-2, -3],
      [3, 3],
    ]);
    expect(stacks[2]).toEqual([
      [3, 6],
      [0, 4],
      [3, 3],
    ]);
    expect(stackExtent(stacks)).toEqual([-3, 6]);
  });
});

describe('series styles', () => {
  test('gives the first eight series distinct colors and patterns', () => {
    const styles = Array.from({ length: 8 }, (_, index) => getSeriesStyle(index));
    expect(new Set(styles.map(style => style.color)).size).toBe(8);
    expect(new Set(styles.map(style => style.pattern)).size).toBe(8);
    expect(new Set(styles.map(style => style.marker)).size).toBe(8);
    expect(styles[0].color).toBe('var(--ord-color-charts-categorical1)');
    expect(styles[0].pattern).toBe('solid');
    expect(styles[0].dash).toBeUndefined();
  });

  test('repeats colors past eight series with shifted patterns', () => {
    const first = getSeriesStyle(0);
    const ninth = getSeriesStyle(8);
    expect(ninth.color).toBe(first.color);
    expect(ninth.pattern).not.toBe(first.pattern);
  });

  test('keeps a custom color and still assigns a pattern', () => {
    expect(getSeriesStyle(1, '#123456')).toMatchObject({ color: '#123456', pattern: 'diagonal' });
  });

  test('draws thresholds in ink with their own dashes', () => {
    expect(getThresholdStyle(0).color).toBe('var(--ord-color-border-strong)');
    expect(getThresholdStyle(0).dash).not.toBe(getThresholdStyle(1).dash);
  });
});

describe('text', () => {
  test('estimates tabular figures at 0.6 em', () => {
    expect(estimateTextWidth('1000', 10)).toBe(24);
  });

  test('truncates with an ellipsis to fit', () => {
    expect(truncateText('Short', 200)).toBe('Short');
    const cut = truncateText('North annex reading room', 80);
    expect(cut.endsWith('…')).toBe(true);
    expect(estimateTextWidth(cut)).toBeLessThanOrEqual(80);
  });
});

describe('pie layout', () => {
  test('splits the circle in proportion and skips non-positive values', () => {
    const slices = computeSlices([1, 1, 2, 0, -3]);
    expect(slices.map(slice => slice.fraction)).toEqual([0.25, 0.25, 0.5, 0, 0]);
    expect(slices[2].endAngle).toBeCloseTo(2 * Math.PI);
    expect(slices[0].midAngle).toBeCloseTo(Math.PI / 4);
  });

  test('runs counterclockwise when mirrored', () => {
    const slices = computeSlices([1, 1], true);
    expect(slices[0].endAngle).toBeCloseTo(-Math.PI);
  });

  test('places labels on the side of their slice without overlapping', () => {
    const geometry = { cx: 200, cy: 100, outerRadius: 80, innerRadius: 0 };
    const labels = placeLabels(
      [0.1, 0.2, 0.3, 4].map(midAngle => ({ midAngle, height: 16 })),
      geometry,
      200
    );
    expect(labels.slice(0, 3).every(label => label.side === 'right')).toBe(true);
    expect(labels[3].side).toBe('left');
    const right = labels.slice(0, 3).map(label => label.y);
    expect(right[1] - right[0]).toBeGreaterThanOrEqual(16);
    expect(right[2] - right[1]).toBeGreaterThanOrEqual(16);
    labels.forEach(label => {
      expect(label.y).toBeGreaterThanOrEqual(8);
      expect(label.y).toBeLessThanOrEqual(192);
    });
  });
});

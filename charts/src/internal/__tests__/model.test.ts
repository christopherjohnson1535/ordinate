// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test } from 'vitest';

import type { CartesianSeries } from '../../../../lib/charts/internal/cartesian/interfaces';
import {
  computeCartesianModel,
  ModelInput,
  nearestPosition,
  normalizeSeries,
} from '../../../../lib/charts/internal/cartesian/model';
import { formatPercentage, formatTickNumber } from '../../../../lib/charts/internal/utils/format';

type Value = string | number | Date;

function model(series: CartesianSeries<Value>[], options: Partial<ModelInput<Value>> = {}) {
  const all = normalizeSeries<Value>(series);
  return computeCartesianModel<Value>({
    allSeries: all,
    visibleSeries: all,
    xScaleType: 'linear',
    yScaleType: 'linear',
    stackedBars: false,
    horizontal: false,
    width: 400,
    height: 200,
    rtl: false,
    ...options,
  });
}

const line: CartesianSeries<Value> = {
  type: 'line',
  title: 'Requests',
  data: [
    { x: 0, y: 10 },
    { x: 5, y: 30 },
    { x: 10, y: 20 },
  ],
};

describe('normalizeSeries', () => {
  test('gives thresholds no palette slot', () => {
    const [first, threshold, second] = normalizeSeries<Value>([
      line,
      { type: 'threshold', title: 'Limit', y: 25 },
      { ...line, title: 'Errors' },
    ]);
    expect(first.style.color).toBe('var(--ord-color-charts-categorical1)');
    expect(threshold.style.color).toBe('var(--ord-color-border-strong)');
    expect(second.style.color).toBe('var(--ord-color-charts-categorical2)');
  });
});

describe('computeCartesianModel', () => {
  test('places line points across the width and up the height', () => {
    const result = model([line]);
    expect(result.positions.map(position => position.position)).toEqual([0, 200, 400]);
    const [mark] = result.lines;
    expect(mark.points.map(point => point.x)).toEqual([0, 200, 400]);
    // The y domain rounds out to [10, 30], so the lowest value sits on the axis.
    expect(mark.points[0].y).toBe(200);
    expect(mark.points[1].y).toBe(0);
    expect(mark.path.startsWith('M0,200')).toBe(true);
  });

  test('mirrors the x axis in right-to-left layout', () => {
    const result = model([line], { rtl: true });
    expect(result.positions.map(position => position.position)).toEqual([400, 200, 0]);
  });

  test('includes thresholds in the y domain', () => {
    const result = model([line, { type: 'threshold', title: 'Limit', y: 100 }]);
    expect(result.valueScale.domain[1]).toBeGreaterThanOrEqual(100);
    expect(result.thresholds[0]).toMatchObject({ axis: 'value', position: result.valueScale.map(100) });
  });

  test('groups bars side by side from zero on a categorical axis', () => {
    const result = model(
      [
        { type: 'bar', title: 'A', data: [{ x: 'Q1', y: 4 }] },
        { type: 'bar', title: 'B', data: [{ x: 'Q1', y: 8 }] },
      ],
      { xScaleType: 'linear' }
    );
    expect(result.categoryScale.type).toBe('categorical');
    const [a, b] = result.bars.map(mark => mark.rects[0]);
    expect(a.x + a.width).toBeLessThan(b.x);
    expect(a.y + a.height).toBe(200);
    expect(b.height).toBeGreaterThan(a.height);
    expect(result.baseline).toBe(200);
  });

  test('stacks bars on top of each other', () => {
    const result = model(
      [
        { type: 'bar', title: 'A', data: [{ x: 'Q1', y: 4 }] },
        { type: 'bar', title: 'B', data: [{ x: 'Q1', y: 6 }] },
      ],
      { stackedBars: true }
    );
    const [a, b] = result.bars.map(mark => mark.rects[0]);
    expect(a.x).toBe(b.x);
    expect(b.y + b.height).toBeLessThanOrEqual(a.y);
    expect(result.valueScale.domain[1]).toBeGreaterThanOrEqual(10);
  });

  test('runs bars sideways when horizontal', () => {
    const result = model([{ type: 'bar', title: 'A', data: [{ x: 'Long name', y: 4 }] }], { horizontal: true });
    const rect = result.bars[0].rects[0];
    expect(rect.x).toBe(0);
    expect(rect.width).toBeGreaterThan(rect.height);
  });

  test('stacks areas from the axis up', () => {
    const result = model([
      {
        type: 'area',
        title: 'A',
        data: [
          { x: 0, y: 2 },
          { x: 1, y: 2 },
        ],
      },
      {
        type: 'area',
        title: 'B',
        data: [
          { x: 0, y: 3 },
          { x: 1, y: 3 },
        ],
      },
    ]);
    expect(result.valueScale.domain[0]).toBe(0);
    expect(result.areas[1].points[0].value).toBe(3);
    expect(result.areas[1].points[0].y).toBeLessThan(result.areas[0].points[0].y);
  });

  test('thins out categorical labels that would collide', () => {
    const data = Array.from({ length: 40 }, (_, index) => ({ x: `Category ${index}`, y: index }));
    const result = model([{ type: 'line', title: 'A', data }], { xScaleType: 'categorical' });
    const shown = result.categoryTicks.filter(tick => tick.showLabel).length;
    expect(shown).toBeGreaterThan(0);
    expect(shown).toBeLessThan(40);
  });

  test('uses the tick formatters', () => {
    const result = model([line], { xTickFormatter: value => `x${value}`, yTickFormatter: value => `${value}%` });
    expect(result.categoryTicks[0].label.startsWith('x')).toBe(true);
    expect(result.valueTicks[0].label.endsWith('%')).toBe(true);
  });

  test('finds the nearest position to a coordinate', () => {
    const result = model([line]);
    expect(nearestPosition(result.positions, 120)).toBe(1);
    expect(nearestPosition([], 120)).toBeNull();
  });
});

describe('format', () => {
  test('formats ticks with the decimals their step needs', () => {
    expect(formatTickNumber(0.1, 0.05)).toBe('0.10');
    expect(formatTickNumber(0.4, 0.2)).toBe('0.4');
    expect(formatTickNumber(1200, 200)).toBe('1,200');
    expect(formatTickNumber(25_000, 5_000)).toBe('25K');
  });

  test('formats percentages', () => {
    expect(formatPercentage(0.253)).toBe('25.3%');
  });
});

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import '../../../../lib/charts/test-utils/dom';

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import BarChart, { BarChartProps } from '../../../../lib/charts/bar-chart';
import createWrapper from '../../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../../../src/__tests__/a11y';

const quarters = ['Q1', 'Q2', 'Q3'];
const series: BarChartProps.SeriesSpec<string>[] = [
  { title: 'Drafting', type: 'bar', data: quarters.map((x, index) => ({ x, y: [4, 5, 6][index] })) },
  { title: 'Survey', type: 'bar', data: quarters.map((x, index) => ({ x, y: [3, 2, 4][index] })) },
  { title: 'Budget', type: 'threshold', y: 7 },
];

function renderChart(props: Partial<BarChartProps<string>> = {}) {
  const result = render(<BarChart series={series} ariaLabel="Spend" {...props} />);
  return { ...result, chart: createWrapper().findBarChart()! };
}

const rect = (element: SVGRectElement) => ({
  x: Number(element.getAttribute('x')),
  y: Number(element.getAttribute('y')),
  width: Number(element.getAttribute('width')),
  height: Number(element.getAttribute('height')),
});

describe('BarChart', () => {
  test('draws one bar per series and category, grouped side by side', () => {
    const { chart } = renderChart();
    const bars = chart.findBars().map(bar => rect(bar.getElement()));
    expect(bars).toHaveLength(6);
    expect(bars[0].x + bars[0].width).toBeLessThan(bars[3].x);
    expect(bars[0].y + bars[0].height).toBeCloseTo(bars[3].y + bars[3].height);
    expect(chart.findXAxisTicks().map(tick => tick.getText())).toEqual(quarters);
    expect(screen.getByRole('application')).toHaveAttribute('aria-roledescription', 'bar chart');
  });

  test('stacks bars and totals them in the popover', () => {
    const { chart } = renderChart({ stackedBars: true });
    const bars = chart.findBars().map(bar => rect(bar.getElement()));
    expect(bars[0].x).toBe(bars[3].x);
    expect(bars[3].y + bars[3].height).toBeLessThanOrEqual(bars[0].y);
    chart.findApplication()!.focus();
    expect(chart.findDetailPopover()!.findSummary()!.getText()).toBe('Total7');
  });

  test('runs bars sideways and moves between categories with up and down', () => {
    const { chart } = renderChart({ horizontalBars: true });
    const [first] = chart.findBars().map(bar => rect(bar.getElement()));
    expect(first.width).toBeGreaterThan(first.height);
    const plot = chart.findApplication()!;
    plot.focus();
    expect(chart.findDetailPopover()!.findHeader()!.getText()).toBe('Q1');
    plot.keydown('ArrowDown');
    expect(chart.findDetailPopover()!.findHeader()!.getText()).toBe('Q2');
    plot.keydown('ArrowUp');
    expect(chart.findDetailPopover()!.findHeader()!.getText()).toBe('Q1');
  });

  test('moves between categories with the arrow keys', () => {
    const { chart } = renderChart();
    const plot = chart.findApplication()!;
    plot.focus();
    plot.keydown('ArrowRight');
    plot.keydown('ArrowRight');
    const popover = chart.findDetailPopover()!;
    expect(popover.findHeader()!.getText()).toBe('Q3');
    expect(popover.findRows().map(row => row.getText())).toEqual(['Drafting6', 'Survey4', 'Budget7']);
    expect(popover.findSummary()).toBeNull();
  });

  test('fills every series after the first with a pattern', () => {
    const { chart } = renderChart();
    const fills = chart.findBars().map(bar => bar.getElement().getAttribute('fill'));
    expect(fills[0]).toBe('currentColor');
    expect(fills[3]).toMatch(/^url\(#.+\)$/);
  });

  test('fires onHighlightChange from the legend', () => {
    const onHighlightChange = vi.fn();
    const { chart } = renderChart({ onHighlightChange: event => onHighlightChange(event.detail) });
    chart.findLegendItems()[1].focus();
    expect(onHighlightChange).toHaveBeenLastCalledWith({ highlightedSeries: series[1] });
  });

  test('has no accessibility violations', async () => {
    const { container, chart } = renderChart({ xTitle: 'Quarter', yTitle: 'Spend' });
    chart.findApplication()!.focus();
    await expectNoAxeViolations(container);
  });
});

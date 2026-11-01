// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import '../../../../lib/charts/test-utils/dom';

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import MixedLineBarChart, { MixedLineBarChartProps } from '../../../../lib/charts/mixed-line-bar-chart';
import createWrapper from '../../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../../../src/__tests__/a11y';

const months = ['Jan', 'Feb', 'Mar'];
const series: MixedLineBarChartProps.SeriesSpec<string>[] = [
  { title: 'Issued', type: 'bar', data: months.map((x, index) => ({ x, y: [40, 50, 45][index] })) },
  { title: 'Average', type: 'line', data: months.map((x, index) => ({ x, y: [40, 45, 45][index] })) },
  { title: 'Target', type: 'threshold', y: 60 },
];

function renderChart(props: Partial<MixedLineBarChartProps<string>> = {}) {
  const result = render(<MixedLineBarChart series={series} ariaLabel="Drawings" {...props} />);
  return { ...result, chart: createWrapper().findMixedLineBarChart()! };
}

describe('MixedLineBarChart', () => {
  test('draws bars and a line through the middle of each category', () => {
    const { chart } = renderChart();
    const bars = chart.findBars();
    expect(bars).toHaveLength(3);
    const firstBar = bars[0].getElement();
    const center = Number(firstBar.getAttribute('x')) + Number(firstBar.getAttribute('width')) / 2;
    // Series are drawn bars first, then thresholds, then lines.
    const line = chart.findSeries()[2].getElement().querySelector('path')!;
    const firstX = Number(line.getAttribute('d')!.slice(1).split(',')[0]);
    expect(firstX).toBeCloseTo(center, 0);
    expect(screen.getByRole('application')).toHaveAttribute('aria-roledescription', 'mixed line and bar chart');
  });

  test('shows bars, lines and thresholds in the popover', () => {
    const { chart } = renderChart();
    chart.findApplication()!.focus();
    chart.findApplication()!.keydown('ArrowRight');
    expect(
      chart
        .findDetailPopover()!
        .findRows()
        .map(row => row.getText())
    ).toEqual(['Issued50', 'Average45', 'Target60']);
  });

  test('legend items are drawn like their series', () => {
    const { chart } = renderChart();
    const [bar, line, threshold] = chart.findLegendItems().map(item => item.getElement().querySelector('svg')!);
    expect(bar.querySelector('rect')).not.toBeNull();
    expect(line.querySelector('line')).not.toBeNull();
    expect(threshold.querySelector('line')!.getAttribute('stroke-dasharray')).toBeTruthy();
  });

  test('fires onFilterChange', () => {
    const onFilterChange = vi.fn();
    const { chart } = renderChart({ onFilterChange: event => onFilterChange(event.detail) });
    chart.findFilter()!.selectOption('series-2');
    expect(onFilterChange).toHaveBeenCalledWith({ visibleSeries: [series[0], series[1]] });
  });

  test('has no accessibility violations', async () => {
    const { container, chart } = renderChart();
    chart.findApplication()!.focus();
    await expectNoAxeViolations(container);
  });
});

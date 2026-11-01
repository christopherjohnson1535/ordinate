// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import '../../../../lib/charts/test-utils/dom';

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import AreaChart, { AreaChartProps } from '../../../../lib/charts/area-chart';
import createWrapper from '../../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../../../src/__tests__/a11y';

const series: AreaChartProps.SeriesSpec<number>[] = [
  {
    title: 'North annex',
    type: 'area',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 20 },
    ],
  },
  {
    title: 'South annex',
    type: 'area',
    data: [
      { x: 0, y: 5 },
      { x: 1, y: 15 },
    ],
  },
  { title: 'Capacity', type: 'threshold', y: 50 },
];

function renderChart(props: Partial<AreaChartProps<number>> = {}) {
  const result = render(<AreaChart series={series} ariaLabel="Requests" {...props} />);
  return { ...result, chart: createWrapper().findAreaChart()! };
}

describe('AreaChart', () => {
  test('stacks the areas from zero and fills each with its own pattern', () => {
    const { chart, container } = renderChart();
    expect(chart.findSeries()).toHaveLength(3);
    expect(chart.findYAxisTicks()[0].getText()).toBe('0');
    const fills = Array.from(container.querySelectorAll('svg path[fill]'), path => path.getAttribute('fill'));
    expect(fills[0]).toBe('currentColor');
    expect(fills[1]).toMatch(/^url\(#.+\)$/);
    expect(container.querySelectorAll('pattern')).not.toHaveLength(0);
    expect(screen.getByRole('application')).toHaveAttribute('aria-roledescription', 'area chart');
  });

  test('shows the values and their total at a position', () => {
    const { chart } = renderChart();
    chart.findApplication()!.focus();
    chart.findApplication()!.keydown('ArrowRight');
    const popover = chart.findDetailPopover()!;
    expect(popover.findRows().map(row => row.getText())).toEqual(['North annex20', 'South annex15', 'Capacity50']);
    expect(popover.findSummary()!.getText()).toBe('Total35');
  });

  test('names the total row from i18nStrings', () => {
    const { chart } = renderChart({ i18nStrings: { detailTotalLabel: 'Sum' } });
    chart.findApplication()!.focus();
    expect(chart.findDetailPopover()!.findSummary()!.getText()).toBe('Sum15');
  });

  test('fires onFilterChange and onHighlightChange', () => {
    const onFilterChange = vi.fn();
    const onHighlightChange = vi.fn();
    const { chart } = renderChart({
      onFilterChange: event => onFilterChange(event.detail),
      onHighlightChange: event => onHighlightChange(event.detail),
    });
    chart.findLegendItems()[1].click();
    expect(onHighlightChange).toHaveBeenLastCalledWith({ highlightedSeries: series[1] });
    chart.findFilter()!.selectOption('series-0');
    expect(onFilterChange).toHaveBeenCalledWith({ visibleSeries: [series[1], series[2]] });
  });

  test('dims the other series while one is highlighted', () => {
    const { chart } = renderChart({ highlightedSeries: series[0] });
    const [first, second] = chart.findSeries();
    expect(first.getElement().getAttribute('class')).not.toBe(second.getElement().getAttribute('class'));
    expect(chart.findHighlightedLegendItem()!.getText()).toBe('North annex');
  });

  test('has no accessibility violations', async () => {
    const { container, chart } = renderChart({ xTitle: 'Hour', yTitle: 'Requests' });
    chart.findApplication()!.focus();
    await expectNoAxeViolations(container);
  });
});

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import '../../../../lib/charts/test-utils/dom';

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import PieChart, { PieChartProps } from '../../../../lib/charts/pie-chart';
import createWrapper from '../../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../../../src/__tests__/a11y';

const data: PieChartProps.Datum[] = [
  { title: 'Drawings', value: 50 },
  { title: 'Photographs', value: 30 },
  { title: 'Models', value: 20 },
  { title: 'Empty', value: 0 },
];

function renderChart(props: Partial<PieChartProps> = {}) {
  const result = render(<PieChart data={data} ariaLabel="Storage" {...props} />);
  return { ...result, chart: createWrapper().findPieChart()! };
}

describe('PieChart', () => {
  test('draws a segment per positive value, each named and patterned', () => {
    const { chart } = renderChart();
    const segments = chart.findSegments();
    expect(segments).toHaveLength(3);
    expect(screen.getByRole('img', { name: 'Photographs 30' })).toHaveAttribute('aria-roledescription', 'segment');
    expect(segments[0].getElement().getAttribute('fill')).toBe('currentColor');
    expect(segments[1].getElement().getAttribute('fill')).toMatch(/^url\(#.+\)$/);
    expect(screen.getByRole('application')).toHaveAttribute('aria-roledescription', 'pie chart');
  });

  test('labels segments with titles and descriptions unless hidden', () => {
    const description = (datum: PieChartProps.Datum, sum: number) => `${Math.round((datum.value / sum) * 100)}%`;
    const { chart, rerender } = renderChart({ segmentDescription: description });
    expect(chart.findSegmentLabels().map(label => label.getText())).toEqual([
      'Drawings50%',
      'Photographs30%',
      'Models20%',
    ]);
    rerender(<PieChart data={data} segmentDescription={description} hideDescriptions={true} />);
    expect(chart.findSegmentLabels().map(label => label.getText())).toEqual(['Drawings', 'Photographs', 'Models']);
    rerender(<PieChart data={data} hideTitles={true} />);
    expect(chart.findSegmentLabels()).toHaveLength(0);
  });

  test('shows the inner metric of a donut', () => {
    const { chart } = renderChart({ variant: 'donut', innerMetricValue: '100 GB', innerMetricDescription: 'stored' });
    expect(chart.findInnerMetricValue()!.getText()).toBe('100 GB');
    expect(chart.findInnerMetricDescription()!.getText()).toBe('stored');
  });

  test('arrow keys move between segments and wrap around', () => {
    const onHighlightChange = vi.fn();
    const { chart } = renderChart({ onHighlightChange: event => onHighlightChange(event.detail) });
    const plot = chart.findApplication()!;
    plot.focus();
    let popover = chart.findDetailPopover()!;
    expect(popover.findHeader()!.getText()).toBe('Drawings');
    expect(popover.findRows().map(row => row.getText())).toEqual(['Value50', 'Percentage50%']);
    expect(onHighlightChange).toHaveBeenLastCalledWith({ highlightedSegment: data[0] });
    plot.keydown('ArrowLeft');
    popover = chart.findDetailPopover()!;
    expect(popover.findHeader()!.getText()).toBe('Models');
    plot.keydown('ArrowRight');
    expect(chart.findDetailPopover()!.findHeader()!.getText()).toBe('Drawings');
    plot.keydown('Escape');
    expect(chart.findDetailPopover()).toBeNull();
    expect(onHighlightChange).toHaveBeenLastCalledWith({ highlightedSegment: null });
  });

  test('Enter pins the popover with a close button', () => {
    const { chart } = renderChart({ i18nStrings: { detailPopoverDismissAriaLabel: 'Close details' } });
    const plot = chart.findApplication()!;
    plot.focus();
    plot.keydown('Enter');
    const dismiss = chart.findDetailPopover()!.findDismissButton()!;
    expect(dismiss.getElement()).toHaveFocus();
    expect(dismiss.getElement()).toHaveAccessibleName('Close details');
    dismiss.click();
    expect(plot.getElement()).toHaveFocus();
  });

  test('pointing at a segment shows its popover; custom content replaces the rows', () => {
    const { chart } = renderChart({
      detailPopoverContent: (datum, sum) => [{ key: 'Share', value: `${(datum.value / sum) * 100} percent` }],
      detailPopoverFooter: datum => `More about ${datum.title}`,
    });
    fireEvent.mouseEnter(chart.findSegments()[1].getElement());
    const popover = chart.findDetailPopover()!;
    expect(popover.findRows().map(row => row.getText())).toEqual(['Share30 percent']);
    expect(popover.findFooter()!.getText()).toBe('More about Photographs');
  });

  test('the filter hides segments and fires onFilterChange', () => {
    const onFilterChange = vi.fn();
    const { chart } = renderChart({ onFilterChange: event => onFilterChange(event.detail) });
    chart.findFilter()!.selectOption('segment-0');
    expect(onFilterChange).toHaveBeenCalledWith({ visibleSegments: [data[1], data[2], data[3]] });
    expect(chart.findSegments()).toHaveLength(2);
  });

  test('highlights a controlled segment in the legend', () => {
    const { chart } = renderChart({ highlightedSegment: data[2] });
    expect(chart.findHighlightedLegendItem()!.getText()).toBe('Models');
  });

  test('shows the states in place of the chart', () => {
    const { chart, rerender } = renderChart({ data: [], empty: 'No data' });
    expect(chart.findStatusContainer()!.getText()).toBe('No data');
    rerender(<PieChart data={data} visibleSegments={[]} noMatch="Nothing selected" />);
    expect(createWrapper().findPieChart()!.findStatusContainer()!.getText()).toBe('Nothing selected');
    rerender(<PieChart data={data} statusType="loading" loadingText="Loading storage" />);
    expect(createWrapper().findPieChart()!.findStatusContainer()!.getText()).toContain('Loading storage');
  });

  test('has no accessibility violations', async () => {
    const { container, chart } = renderChart({ variant: 'donut', innerMetricValue: '100', legendTitle: 'Kind' });
    await expectNoAxeViolations(container);
    chart.findApplication()!.focus();
    chart.findApplication()!.keydown('Enter');
    await expectNoAxeViolations(container);
  });
});

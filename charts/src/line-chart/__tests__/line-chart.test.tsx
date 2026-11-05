// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import '../../../../lib/charts/test-utils/dom';

import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import LineChart, { LineChartProps } from '../../../../lib/charts/line-chart';
import createWrapper from '../../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../../../src/__tests__/a11y';

const north: LineChartProps.DataSeries<number> = {
  title: 'North annex',
  type: 'line',
  data: [
    { x: 1, y: 40 },
    { x: 2, y: 55 },
    { x: 3, y: 48 },
  ],
  valueFormatter: value => `${value} rpm`,
};
const south: LineChartProps.DataSeries<number> = {
  title: 'South annex',
  type: 'line',
  data: [
    { x: 1, y: 20 },
    { x: 2, y: 25 },
    { x: 3, y: 30 },
  ],
};
const capacity: LineChartProps.ThresholdSeries<number> = { title: 'Capacity', type: 'threshold', y: 60 };
const series = [north, south, capacity];

function renderChart(props: Partial<LineChartProps<number>> = {}) {
  const result = render(<LineChart series={series} ariaLabel="Requests" {...props} />);
  return { ...result, chart: createWrapper().findLineChart()! };
}

describe('LineChart', () => {
  test('draws a group per series and a labeled, focusable plot', () => {
    const { chart } = renderChart({ xTitle: 'Hour', yTitle: 'Requests' });
    expect(chart.findSeries()).toHaveLength(3);
    const plot = screen.getByRole('application', { name: 'Requests' });
    expect(plot).toHaveAttribute('tabindex', '0');
    expect(plot).toHaveAttribute('aria-roledescription', 'line chart');
    expect(chart.findXAxisTicks().length).toBeGreaterThan(1);
    expect(chart.findYAxisTicks().map(tick => tick.getText())).toContain('60');
    expect(screen.getByText('Hour')).toBeInTheDocument();
  });

  test('lists every series in the legend with its title', () => {
    const { chart } = renderChart({ legendTitle: 'Building' });
    expect(chart.findLegendItems().map(item => item.getText())).toEqual(['North annex', 'South annex', 'Capacity']);
    expect(screen.getByRole('toolbar', { name: 'Building' })).toBeInTheDocument();
  });

  test('hides the filter and legend on request', () => {
    const { chart } = renderChart({ hideFilter: true, hideLegend: true });
    expect(chart.findFilter()).toBeNull();
    expect(chart.findLegend()).toBeNull();
  });

  test('arrow keys move between x positions and show the values there', () => {
    const { chart } = renderChart();
    const plot = chart.findApplication()!;
    plot.focus();
    let popover = chart.findDetailPopover()!;
    expect(popover.findHeader()!.getText()).toBe('1');
    plot.keydown('ArrowRight');
    popover = chart.findDetailPopover()!;
    expect(popover.findHeader()!.getText()).toBe('2');
    expect(popover.findRows().map(row => row.getText())).toEqual(['North annex55 rpm', 'South annex25', 'Capacity60']);
    plot.keydown('End');
    expect(chart.findDetailPopover()!.findHeader()!.getText()).toBe('3');
    plot.keydown('ArrowRight');
    expect(chart.findDetailPopover()!.findHeader()!.getText()).toBe('3');
    plot.keydown('Home');
    expect(chart.findDetailPopover()!.findHeader()!.getText()).toBe('1');
  });

  test('announces the focused position to screen readers', () => {
    const { chart, container } = renderChart();
    chart.findApplication()!.focus();
    chart.findApplication()!.keydown('ArrowRight');
    const live = container.querySelector('[aria-live="polite"][aria-atomic="true"]')!;
    expect(live.textContent).toBe('2: North annex 55 rpm, South annex 25, Capacity 60');
  });

  test('up and down highlight series at the position and fire onHighlightChange', () => {
    const onHighlightChange = vi.fn();
    const { chart } = renderChart({ onHighlightChange: event => onHighlightChange(event.detail) });
    const plot = chart.findApplication()!;
    plot.focus();
    plot.keydown('ArrowDown');
    expect(onHighlightChange).toHaveBeenLastCalledWith({ highlightedSeries: north });
    expect(chart.findHighlightedLegendItem()!.getText()).toBe('North annex');
    plot.keydown('ArrowDown');
    expect(onHighlightChange).toHaveBeenLastCalledWith({ highlightedSeries: south });
    plot.keydown('Escape');
    expect(onHighlightChange).toHaveBeenLastCalledWith({ highlightedSeries: null });
  });

  test('Enter pins the popover and moves focus to its close button; Escape returns focus', () => {
    const { chart } = renderChart();
    const plot = chart.findApplication()!;
    plot.focus();
    plot.keydown('Enter');
    const popover = chart.findDetailPopover()!;
    expect(popover.getElement()).toHaveAttribute('role', 'dialog');
    const dismiss = popover.findDismissButton()!;
    expect(dismiss.getElement()).toHaveFocus();
    expect(dismiss.getElement()).toHaveAccessibleName('Dismiss');
    dismiss.keydown('Escape');
    expect(plot.getElement()).toHaveFocus();
    expect(chart.findDetailPopover()!.getElement()).not.toHaveAttribute('role');
  });

  test('Escape on the plot dismisses the popover', () => {
    const { chart } = renderChart();
    chart.findApplication()!.focus();
    expect(chart.findDetailPopover()).not.toBeNull();
    chart.findApplication()!.keydown('Escape');
    expect(chart.findDetailPopover()).toBeNull();
  });

  test('moving the pointer over the plot shows the nearest position', () => {
    const { chart, container } = renderChart();
    const overlay = container.querySelector('svg > g > rect:last-of-type')!;
    fireEvent.mouseMove(overlay, { clientX: 10000, clientY: 10 });
    expect(chart.findDetailPopover()!.findHeader()!.getText()).toBe('3');
    fireEvent.mouseLeave(overlay);
    expect(chart.findDetailPopover()).toBeNull();
  });

  test('pointing at a legend item highlights its series', () => {
    const onHighlightChange = vi.fn();
    const { chart } = renderChart({ onHighlightChange: event => onHighlightChange(event.detail) });
    const [first] = chart.findLegendItems();
    fireEvent.mouseEnter(first.getElement());
    expect(onHighlightChange).toHaveBeenLastCalledWith({ highlightedSeries: north });
    expect(first.getElement()).toHaveAttribute('aria-pressed', 'true');
    fireEvent.mouseLeave(first.getElement());
    expect(onHighlightChange).toHaveBeenLastCalledWith({ highlightedSeries: null });
  });

  test('legend arrow keys move focus between items', () => {
    const { chart } = renderChart();
    const items = chart.findLegendItems();
    expect(items.map(item => item.getElement().tabIndex)).toEqual([0, -1, -1]);
    items[0].focus();
    items[0].keydown('ArrowRight');
    expect(items[1].getElement()).toHaveFocus();
    items[1].keydown('End');
    expect(items[2].getElement()).toHaveFocus();
  });

  test('the filter hides series and fires onFilterChange', () => {
    const onFilterChange = vi.fn();
    const { chart } = renderChart({ onFilterChange: event => onFilterChange(event.detail) });
    const filter = chart.findFilter()!;
    filter.selectOption('series-1');
    expect(onFilterChange).toHaveBeenCalledWith({ visibleSeries: [north, capacity] });
    expect(chart.findSeries()).toHaveLength(2);
    expect(chart.findLegendItems().map(item => item.getText())).toEqual(['North annex', 'Capacity']);
  });

  test('keeps colors with their series when others are filtered out', () => {
    const { chart, rerender } = renderChart();
    const colorOf = (title: string) =>
      chart
        .findLegendItems()
        .find(item => item.getText() === title)!
        .getElement()
        .querySelector('line')!
        .getAttribute('style');
    const before = colorOf('South annex');
    rerender(<LineChart series={series} visibleSeries={[south]} ariaLabel="Requests" />);
    expect(colorOf('South annex')).toBe(before);
  });

  test('shows noMatch when the filter hides every series', () => {
    const { chart } = renderChart({ visibleSeries: [], noMatch: 'Nothing selected' });
    expect(chart.findStatusContainer()!.getText()).toBe('Nothing selected');
    expect(chart.findFilter()).not.toBeNull();
    expect(chart.findLegend()).toBeNull();
  });

  test('shows empty, loading and error states in place of the plot', () => {
    const onRecoveryClick = vi.fn();
    const { chart, rerender } = renderChart({ series: [], empty: 'No data' });
    expect(chart.findStatusContainer()!.getText()).toBe('No data');
    expect(chart.findApplication()).toBeNull();

    rerender(<LineChart series={series} statusType="loading" loadingText="Loading requests" />);
    expect(createWrapper().findLineChart()!.findStatusContainer()!.getText()).toContain('Loading requests');

    rerender(
      <LineChart
        series={series}
        statusType="error"
        errorText="Failed"
        recoveryText="Retry"
        onRecoveryClick={onRecoveryClick}
      />
    );
    const errorChart = createWrapper().findLineChart()!;
    expect(errorChart.findStatusContainer()!.getText()).toContain('Failed');
    errorChart.findRecoveryButton()!.click();
    expect(onRecoveryClick).toHaveBeenCalledOnce();
  });

  test('renders the description and footer', () => {
    const { chart } = renderChart({
      ariaDescription: 'Requests peak at noon.',
      detailPopoverFooter: x => <a href={`#${x}`}>Log for {x}</a>,
    });
    expect(screen.getByRole('application')).toHaveAccessibleDescription('Requests peak at noon.');
    act(() => chart.findApplication()!.getElement().focus());
    expect(chart.findDetailPopover()!.findFooter()!.getText()).toBe('Log for 1');
  });

  test('takes strings from i18nStrings', () => {
    renderChart({ i18nStrings: { filterLabel: 'Series', chartAriaRoleDescription: 'graph' } });
    expect(screen.getByText('Series')).toBeInTheDocument();
    expect(screen.getByRole('application')).toHaveAttribute('aria-roledescription', 'graph');
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'requests', 'data-testid': 'chart', className: 'custom' } as Partial<LineChartProps<number>>;
    renderChart(props);
    const root = screen.getByTestId('chart');
    expect(root).toHaveAttribute('id', 'requests');
    expect(root).not.toHaveClass('custom');
  });

  test('supports time and log scales', () => {
    const start = new Date(2026, 0, 1).getTime();
    const timeSeries: LineChartProps.SeriesSpec<Date>[] = [
      {
        title: 'Load',
        type: 'line',
        data: [0, 1, 2].map(hour => ({ x: new Date(start + hour * 3_600_000), y: hour })),
      },
    ];
    render(<LineChart series={timeSeries} xScaleType="time" ariaLabel="Load" />);
    expect(createWrapper().findLineChart()!.findXAxisTicks()[0].getText()).toMatch(/\d\d:\d\d/);
  });

  test('has no accessibility violations', async () => {
    const { container, chart } = renderChart({ xTitle: 'Hour', yTitle: 'Requests', legendTitle: 'Building' });
    await expectNoAxeViolations(container);
    chart.findApplication()!.focus();
    chart.findApplication()!.keydown('Enter');
    await expectNoAxeViolations(container);
  });

  describe('ticks', () => {
    // Sizes in bytes from 1 KiB to 1 MiB, by powers of 4.
    const sizes = [1024, 4096, 16384, 65536, 262144, 1048576];
    const transfer: LineChartProps.DataSeries<number> = {
      title: 'Transfer',
      type: 'line',
      data: sizes.map((x, index) => ({ x, y: (index + 1) * 10 })),
    };
    const binary = (bytes: number) => (bytes >= 1048576 ? `${bytes / 1048576} MiB` : `${bytes / 1024} KiB`);
    const xLabels = (chart: ReturnType<typeof renderChart>['chart']) =>
      chart.findXAxisTicks().map(tick => tick.getText());
    const yLabels = (chart: ReturnType<typeof renderChart>['chart']) =>
      chart.findYAxisTicks().map(tick => tick.getText());

    test('adds 2 and 5 multiples to a log axis that spans few decades', () => {
      const { chart } = renderChart({ series: [transfer], xScaleType: 'log' });
      expect(xLabels(chart)).toEqual(['2,000', '5,000', '10K', '20K', '50K', '100K', '200K', '500K', '1M']);
    });

    test('draws x ticks at the given values on a log axis', () => {
      const { chart } = renderChart({
        series: [transfer],
        xScaleType: 'log',
        xTicks: [1024, 16384, 262144, 1048576, 4194304],
        xTickFormatter: binary,
      });
      expect(xLabels(chart)).toEqual(['1 KiB', '16 KiB', '256 KiB', '1 MiB']);
    });

    test('draws x ticks at the given values on a linear axis', () => {
      const { chart } = renderChart({ xTicks: [1, 1.5, 3] });
      expect(xLabels(chart)).toEqual(['1', '1.5', '3']);
    });

    test('draws y ticks at the given values', () => {
      const { chart } = renderChart({ yTicks: [5, 25, 35, 50, 1000] });
      expect(yLabels(chart)).toEqual(['25', '35', '50']);
    });

    test('draws y ticks at the given values on a log axis', () => {
      const { chart } = renderChart({ series: [transfer], yScaleType: 'log', yTicks: [16, 32, 64] });
      expect(yLabels(chart)).toEqual(['16', '32', '64']);
    });
  });
});

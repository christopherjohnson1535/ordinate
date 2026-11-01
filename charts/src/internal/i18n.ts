// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Text a chart renders on its own. Every chart accepts the same keys in `i18nStrings`, plus
 * the ones in its own block below.
 */
export interface ChartI18nStrings {
  /** Label of the series filter. */
  filterLabel?: string;
  /** Placeholder of the series filter while nothing is selected. */
  filterPlaceholder?: string;
  /** Accessible name of the remove button on a selected series in the filter, before the series title. */
  filterSelectedAriaLabel?: string;
  /** Accessible name of the legend. */
  legendAriaLabel?: string;
  /** Spoken name of the kind of chart, such as "line chart", given to the plot as its role description. */
  chartAriaRoleDescription?: string;
  /** Spoken name of the x axis kind, given to the x axis as its role description. */
  xAxisAriaRoleDescription?: string;
  /** Spoken name of the y axis kind, given to the y axis as its role description. */
  yAxisAriaRoleDescription?: string;
  /** Accessible name of the close button in a pinned detail popover. */
  detailPopoverDismissAriaLabel?: string;
  /** Label of the total row in the detail popover of a stacked chart. */
  detailTotalLabel?: string;
}

export interface PieChartI18nStrings extends ChartI18nStrings {
  /** Label of the value row in a segment's detail popover. */
  detailsValue?: string;
  /** Label of the percentage row in a segment's detail popover. */
  detailsPercentage?: string;
  /** Spoken name of the kind of a segment, given to each segment as its role description. */
  segmentAriaRoleDescription?: string;
}

type Messages = Required<PieChartI18nStrings>;

const shared: Omit<
  Messages,
  'chartAriaRoleDescription' | 'detailsValue' | 'detailsPercentage' | 'segmentAriaRoleDescription'
> = {
  filterLabel: 'Filter displayed data',
  filterPlaceholder: 'Filter data',
  filterSelectedAriaLabel: 'Remove',
  legendAriaLabel: 'Legend',
  xAxisAriaRoleDescription: 'x axis',
  yAxisAriaRoleDescription: 'y axis',
  detailPopoverDismissAriaLabel: 'Dismiss',
  detailTotalLabel: 'Total',
};

const english: Record<ChartName, Partial<Messages>> = {
  'area-chart': { ...shared, chartAriaRoleDescription: 'area chart' },
  'bar-chart': { ...shared, chartAriaRoleDescription: 'bar chart' },
  'line-chart': { ...shared, chartAriaRoleDescription: 'line chart' },
  'mixed-line-bar-chart': { ...shared, chartAriaRoleDescription: 'mixed line and bar chart' },
  'pie-chart': {
    ...shared,
    chartAriaRoleDescription: 'pie chart',
    detailsValue: 'Value',
    detailsPercentage: 'Percentage',
    segmentAriaRoleDescription: 'segment',
  },
};

export type ChartName = 'area-chart' | 'bar-chart' | 'line-chart' | 'mixed-line-bar-chart' | 'pie-chart';

export type ChartMessages = Messages;

/**
 * Merges the strings a consumer passed over the English defaults for one chart. A string
 * passed in `i18nStrings` always wins.
 */
export function resolveI18nStrings(chart: ChartName, provided: PieChartI18nStrings | undefined): Messages {
  const defaults = english[chart] as Messages;
  const merged = { ...defaults };
  for (const [key, value] of Object.entries(provided ?? {})) {
    if (value !== undefined) {
      merged[key as keyof Messages] = value;
    }
  }
  return merged;
}

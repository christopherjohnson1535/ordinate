// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseChartProps } from '../base';
import { NonCancelableEventHandler } from '../events';
import { ChartI18nStrings } from '../i18n';
import { ChartValue, ScaleType } from '../utils/scales';

export type ChartDataTypes = ChartValue;

export interface Datum<T> {
  x: T;
  y: number;
}

/**
 * Formats a value for the detail popover. It receives the y value and the x value it belongs to.
 */
export type ValueFormatter<T> = (value: number, x: T) => string;

export type TickFormatter<T> = (value: T) => string;

interface DataSeries<T> {
  /** Name of the series, shown in the legend, the filter and the detail popover. */
  title: string;
  /** The values, one per x position. */
  data: ReadonlyArray<Datum<T>>;
  /** A color for the series. By default series take the categorical chart colors in order. */
  color?: string;
  /** Formats the series' values in the detail popover. */
  valueFormatter?: ValueFormatter<T>;
}

export interface LineSeries<T> extends DataSeries<T> {
  type: 'line';
}

export interface AreaSeries<T> extends DataSeries<T> {
  type: 'area';
}

export interface BarSeries<T> extends DataSeries<T> {
  type: 'bar';
}

/**
 * A reference line across the plot: horizontal at `y`, or vertical at `x`.
 */
export interface ThresholdSeries<T> {
  type: 'threshold';
  /** Name of the threshold, shown in the legend, the filter and the detail popover. */
  title: string;
  /** The value the threshold marks on the y axis. */
  y?: number;
  /** The position the threshold marks on the x axis, for a vertical line. */
  x?: T;
  /** A color for the line. Thresholds are drawn in ink by default and told apart by their dashes. */
  color?: string;
  /** Formats the threshold's value in the detail popover. */
  valueFormatter?: (value: number) => string;
}

export type CartesianSeries<T> = LineSeries<T> | AreaSeries<T> | BarSeries<T> | ThresholdSeries<T>;

export type StatusType = 'loading' | 'finished' | 'error';

export type DetailPopoverSize = 'small' | 'medium' | 'large';

/**
 * Props every chart with x and y axes shares.
 */
export interface CartesianChartProps<T extends ChartDataTypes, S extends CartesianSeries<T>> extends BaseChartProps {
  /**
   * The series to draw. Each series has a `type`, a `title` and its `data` as `{ x, y }` points,
   * and optionally a `color` and a `valueFormatter` for the detail popover. Series take the
   * categorical colors and patterns in the order they are listed here, and keep them when
   * other series are filtered out.
   *
   * A `threshold` series draws a reference line at `y`, or at `x` for a vertical line.
   */
  series: ReadonlyArray<S>;
  /**
   * The x values the axis shows. For a categorical axis, the categories in order; for the
   * other scales, the lowest and highest value. By default the axis fits the data.
   */
  xDomain?: ReadonlyArray<T>;
  /**
   * The lowest and highest value of the y axis. By default the axis fits the data and is
   * rounded out to whole ticks.
   */
  yDomain?: readonly [number, number];
  /**
   * The x values to draw ticks at, on any scale type. Use it when round numbers are not the
   * right steps, such as powers of 1,024 for sizes in binary units. On a categorical axis it
   * picks the categories that get a tick and a label. Values outside the axis are left out. By
   * default the chart picks round values that fit the width.
   */
  xTicks?: ReadonlyArray<T>;
  /**
   * The y values to draw ticks and grid rules at, on a linear or log scale. Values outside the
   * axis are left out. By default the chart picks round values that fit the height.
   */
  yTicks?: ReadonlyArray<number>;
  /**
   * The scale of the x axis:
   * * `linear`: numbers, evenly spaced.
   * * `log`: positive numbers, each power of ten evenly spaced.
   * * `time`: dates, with ticks on calendar boundaries.
   * * `categorical`: named categories, evenly spaced in the order of `xDomain` or of the data.
   */
  xScaleType?: ScaleType;
  /**
   * The scale of the y axis: `linear` or `log`.
   */
  yScaleType?: 'linear' | 'log';
  /**
   * Title of the x axis, shown below it.
   */
  xTitle?: string;
  /**
   * Title of the y axis, shown above it.
   */
  yTitle?: string;
  /**
   * Formats the x axis ticks and the header of the detail popover.
   */
  xTickFormatter?: TickFormatter<T>;
  /**
   * Formats the y axis ticks.
   */
  yTickFormatter?: TickFormatter<number>;
  /**
   * Height of the plot in pixels, without the axes, filter and legend.
   */
  height?: number;
  /**
   * Hides the series filter above the chart.
   */
  hideFilter?: boolean;
  /**
   * Hides the legend below the chart.
   */
  hideLegend?: boolean;
  /**
   * A heading shown before the legend items.
   */
  legendTitle?: string;
  /**
   * The state of the data:
   * * `loading`: shows `loadingText` in place of the plot.
   * * `error`: shows `errorText` and a `recoveryText` button that calls `onRecoveryClick`.
   * * `finished`: shows the plot, or `empty` when there is no data.
   */
  statusType?: StatusType;
  /**
   * Shown while `statusType` is `loading`.
   */
  loadingText?: string;
  /**
   * Shown when `statusType` is `error`. Say what failed.
   */
  errorText?: string;
  /**
   * Text of the button shown after `errorText`.
   */
  recoveryText?: string;
  /**
   * Called when the user clicks the recovery button.
   */
  onRecoveryClick?: NonCancelableEventHandler;
  /**
   * Shown in place of the plot when there are no series or no data.
   */
  empty?: React.ReactNode;
  /**
   * Shown in place of the plot when the filter hides every series.
   */
  noMatch?: React.ReactNode;
  /**
   * The series that are shown. Set it with `onFilterChange` to control the filter; by default
   * every series is shown.
   */
  visibleSeries?: ReadonlyArray<S>;
  /**
   * Called when the user changes the series filter, with the shown series in
   * `event.detail.visibleSeries`.
   */
  onFilterChange?: NonCancelableEventHandler<CartesianChartProps.FilterChangeDetail<S>>;
  /**
   * The series that is emphasized, with the others dimmed. Set it with `onHighlightChange` to
   * control it.
   */
  highlightedSeries?: S | null;
  /**
   * Called when the user highlights a series from the legend or with the arrow keys, or clears
   * the highlight, with the series in `event.detail.highlightedSeries`.
   */
  onHighlightChange?: NonCancelableEventHandler<CartesianChartProps.HighlightChangeDetail<S>>;
  /**
   * The largest width of the detail popover.
   */
  detailPopoverSize?: DetailPopoverSize;
  /**
   * Content shown at the bottom of the detail popover for an x position, such as a link.
   */
  detailPopoverFooter?: (xValue: T) => React.ReactNode;
  /**
   * Draws the line at y = 0 in ink, so it reads as the baseline.
   */
  emphasizeBaselineAxis?: boolean;
  /**
   * Accessible name of the plot.
   */
  ariaLabel?: string;
  /**
   * The ID of an element that names the plot, such as a container header.
   */
  ariaLabelledby?: string;
  /**
   * A longer description of the plot for screen reader users, such as what it shows and how
   * it trends.
   */
  ariaDescription?: string;
  /**
   * Text the chart renders on its own:
   * * `filterLabel`, `filterPlaceholder` and `filterSelectedAriaLabel`: the series filter.
   * * `legendAriaLabel`: the accessible name of the legend.
   * * `chartAriaRoleDescription`, `xAxisAriaRoleDescription` and `yAxisAriaRoleDescription`:
   *   spoken names of the plot and axes.
   * * `detailPopoverDismissAriaLabel`: the close button of a pinned detail popover.
   * * `detailTotalLabel`: the total row of a stacked chart's detail popover.
   */
  i18nStrings?: ChartI18nStrings;
}

export namespace CartesianChartProps {
  export interface FilterChangeDetail<S> {
    visibleSeries: ReadonlyArray<S>;
  }

  export interface HighlightChangeDetail<S> {
    highlightedSeries: S | null;
  }
}

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  BarSeries,
  CartesianChartProps,
  ChartDataTypes,
  Datum as SharedDatum,
  ThresholdSeries as SharedThresholdSeries,
} from '../internal/cartesian/interfaces';
import { ChartI18nStrings } from '../internal/i18n';

/**
 * A bar chart draws one or more series as bars, one band per category. Bars of different
 * series sit side by side, or on top of each other with `stackedBars`, and run sideways with
 * `horizontalBars`. Each series has its own color and fill pattern, so bars stay apart without
 * color.
 *
 * The shared props (series, domains, scales, titles, filter, legend, states, highlight and
 * i18n strings) are described on `CartesianChartProps`.
 */
export interface BarChartProps<T extends BarChartProps.DataTypes> extends CartesianChartProps<
  T,
  BarChartProps.SeriesSpec<T>
> {
  /**
   * The series to draw: `bar` series with `data`, and `threshold` series that draw a dashed
   * reference line at `y`, or at a category `x`.
   */
  series: ReadonlyArray<BarChartProps.SeriesSpec<T>>;
  /**
   * The scale of the x axis. Bars need a band per category, so the axis is always `categorical`.
   */
  xScaleType?: CartesianChartProps<T, BarChartProps.SeriesSpec<T>>['xScaleType'];
  /**
   * Stacks the bars of all series in each category instead of placing them side by side. The
   * detail popover then shows the total.
   */
  stackedBars?: boolean;
  /**
   * Runs the bars sideways: categories down the vertical axis and values along the horizontal
   * one. Use it for long category names.
   */
  horizontalBars?: boolean;
  /**
   * Text the chart renders on its own. See `CartesianChartProps.i18nStrings`.
   */
  i18nStrings?: BarChartProps.I18nStrings;
}

export namespace BarChartProps {
  export type DataTypes = ChartDataTypes;

  export interface Datum<T> extends SharedDatum<T> {}

  export interface DataSeries<T> extends BarSeries<T> {}

  export interface ThresholdSeries<T> extends SharedThresholdSeries<T> {}

  export type SeriesSpec<T> = DataSeries<T> | ThresholdSeries<T>;

  export type FilterChangeDetail<T> = CartesianChartProps.FilterChangeDetail<SeriesSpec<T>>;

  export type HighlightChangeDetail<T> = CartesianChartProps.HighlightChangeDetail<SeriesSpec<T>>;

  export interface I18nStrings extends ChartI18nStrings {}
}

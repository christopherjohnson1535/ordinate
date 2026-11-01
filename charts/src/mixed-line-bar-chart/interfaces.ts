// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  BarSeries,
  CartesianChartProps,
  ChartDataTypes,
  Datum as SharedDatum,
  LineSeries,
  ThresholdSeries as SharedThresholdSeries,
} from '../internal/cartesian/interfaces';
import { ChartI18nStrings } from '../internal/i18n';

/**
 * A mixed chart draws bars and lines against the same categories and the same y axis, such as
 * monthly totals as bars and their running average as a line. Bars get color and fill
 * patterns; lines get color, dashes and point markers.
 *
 * The shared props (series, domains, scales, titles, filter, legend, states, highlight and
 * i18n strings) are described on `CartesianChartProps`.
 */
export interface MixedLineBarChartProps<T extends MixedLineBarChartProps.DataTypes> extends CartesianChartProps<
  T,
  MixedLineBarChartProps.SeriesSpec<T>
> {
  /**
   * The series to draw: `bar` and `line` series with `data`, and `threshold` series that draw
   * a dashed reference line at `y`, or at a category `x`. Lines run through the middle of each
   * category.
   */
  series: ReadonlyArray<MixedLineBarChartProps.SeriesSpec<T>>;
  /**
   * The scale of the x axis. Bars need a band per category, so the axis is always `categorical`.
   */
  xScaleType?: CartesianChartProps<T, MixedLineBarChartProps.SeriesSpec<T>>['xScaleType'];
  /**
   * Stacks the bars of all bar series in each category instead of placing them side by side.
   */
  stackedBars?: boolean;
  /**
   * Text the chart renders on its own. See `CartesianChartProps.i18nStrings`.
   */
  i18nStrings?: MixedLineBarChartProps.I18nStrings;
}

export namespace MixedLineBarChartProps {
  export type DataTypes = ChartDataTypes;

  export interface Datum<T> extends SharedDatum<T> {}

  export interface BarDataSeries<T> extends BarSeries<T> {}

  export interface LineDataSeries<T> extends LineSeries<T> {}

  export type DataSeries<T> = BarDataSeries<T> | LineDataSeries<T>;

  export interface ThresholdSeries<T> extends SharedThresholdSeries<T> {}

  export type SeriesSpec<T> = BarDataSeries<T> | LineDataSeries<T> | ThresholdSeries<T>;

  export type FilterChangeDetail<T> = CartesianChartProps.FilterChangeDetail<SeriesSpec<T>>;

  export type HighlightChangeDetail<T> = CartesianChartProps.HighlightChangeDetail<SeriesSpec<T>>;

  export interface I18nStrings extends ChartI18nStrings {}
}

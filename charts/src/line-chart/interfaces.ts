// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  CartesianChartProps,
  ChartDataTypes,
  Datum as SharedDatum,
  LineSeries,
  ThresholdSeries as SharedThresholdSeries,
} from '../internal/cartesian/interfaces';
import { ChartI18nStrings } from '../internal/i18n';

/**
 * A line chart draws one or more series of `{ x, y }` points as lines. Each line has its own
 * color, dash and point marker, so lines stay apart without color. Use it to show how values
 * change along a continuous axis, such as time.
 *
 * The shared props (series, domains, scales, titles, filter, legend, states, highlight and
 * i18n strings) are described on `CartesianChartProps`.
 */
export interface LineChartProps<T extends LineChartProps.DataTypes> extends CartesianChartProps<
  T,
  LineChartProps.SeriesSpec<T>
> {
  /**
   * The series to draw: `line` series with `data`, and `threshold` series that draw a dashed
   * reference line at `y`, or at `x` for a vertical line.
   */
  series: ReadonlyArray<LineChartProps.SeriesSpec<T>>;
  /**
   * The scale of the x axis. Defaults to `linear`; use `time` for dates.
   */
  xScaleType?: CartesianChartProps<T, LineChartProps.SeriesSpec<T>>['xScaleType'];
  /**
   * Text the chart renders on its own. See `CartesianChartProps.i18nStrings`.
   */
  i18nStrings?: LineChartProps.I18nStrings;
}

export namespace LineChartProps {
  export type DataTypes = ChartDataTypes;

  export interface Datum<T> extends SharedDatum<T> {}

  export interface DataSeries<T> extends LineSeries<T> {}

  export interface ThresholdSeries<T> extends SharedThresholdSeries<T> {}

  export type SeriesSpec<T> = DataSeries<T> | ThresholdSeries<T>;

  export type FilterChangeDetail<T> = CartesianChartProps.FilterChangeDetail<SeriesSpec<T>>;

  export type HighlightChangeDetail<T> = CartesianChartProps.HighlightChangeDetail<SeriesSpec<T>>;

  export interface I18nStrings extends ChartI18nStrings {}
}

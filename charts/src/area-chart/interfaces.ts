// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  AreaSeries,
  CartesianChartProps,
  ChartDataTypes,
  Datum as SharedDatum,
  ThresholdSeries as SharedThresholdSeries,
} from '../internal/cartesian/interfaces';
import { ChartI18nStrings } from '../internal/i18n';

/**
 * An area chart stacks one or more series of `{ x, y }` points as filled areas, so the top edge
 * shows the total. Each area has its own color and fill pattern, so areas stay apart without
 * color. Use it to show how parts add up to a whole over a continuous axis, such as time.
 *
 * The shared props (series, domains, scales, titles, filter, legend, states, highlight and
 * i18n strings) are described on `CartesianChartProps`.
 */
export interface AreaChartProps<T extends AreaChartProps.DataTypes> extends CartesianChartProps<
  T,
  AreaChartProps.SeriesSpec<T>
> {
  /**
   * The series to draw: `area` series with `data`, stacked in the order listed from the axis
   * up, and `threshold` series that draw a dashed reference line at `y`, or at `x`.
   */
  series: ReadonlyArray<AreaChartProps.SeriesSpec<T>>;
  /**
   * The scale of the x axis. Defaults to `linear`; use `time` for dates.
   */
  xScaleType?: CartesianChartProps<T, AreaChartProps.SeriesSpec<T>>['xScaleType'];
  /**
   * Text the chart renders on its own. See `CartesianChartProps.i18nStrings`.
   */
  i18nStrings?: AreaChartProps.I18nStrings;
}

export namespace AreaChartProps {
  export type DataTypes = ChartDataTypes;

  export interface Datum<T> extends SharedDatum<T> {}

  export interface DataSeries<T> extends AreaSeries<T> {}

  export interface ThresholdSeries<T> extends SharedThresholdSeries<T> {}

  export type SeriesSpec<T> = DataSeries<T> | ThresholdSeries<T>;

  export type FilterChangeDetail<T> = CartesianChartProps.FilterChangeDetail<SeriesSpec<T>>;

  export type HighlightChangeDetail<T> = CartesianChartProps.HighlightChangeDetail<SeriesSpec<T>>;

  export interface I18nStrings extends ChartI18nStrings {}
}

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseChartProps } from '../internal/base';
import { DetailPopoverSize, StatusType } from '../internal/cartesian/interfaces';
import { NonCancelableEventHandler } from '../internal/events';
import { PieChartI18nStrings } from '../internal/i18n';

/**
 * A pie chart shows how a whole splits into parts. Each segment has its own color and fill
 * pattern, so segments stay apart without color. The donut variant leaves room in the middle
 * for a headline number.
 */
export interface PieChartProps<T extends PieChartProps.Datum = PieChartProps.Datum> extends BaseChartProps {
  /**
   * The segments, in the order they are drawn clockwise from twelve o'clock. Each has a
   * `title`, a `value`, and optionally a `color`. Segments take the categorical colors and
   * patterns in this order and keep them when others are filtered out. Values of zero or less
   * draw no segment.
   */
  data: ReadonlyArray<T>;
  /**
   * `pie` fills the whole circle; `donut` leaves a hole for `innerMetricValue` and
   * `innerMetricDescription`.
   */
  variant?: PieChartProps.Variant;
  /**
   * The radius of the pie. It shrinks when the container is too narrow for it and its labels.
   */
  size?: PieChartProps.Size;
  /**
   * A headline value in the middle of a donut, such as the total.
   */
  innerMetricValue?: string;
  /**
   * A short description below `innerMetricValue`, such as its unit.
   */
  innerMetricDescription?: string;
  /**
   * Returns a second line for a segment's label, such as its share: `(datum, sum) => '24%'`.
   */
  segmentDescription?: (datum: T, sum: number) => string;
  /**
   * Hides the labels beside the pie. The legend and detail popover still name the segments.
   */
  hideTitles?: boolean;
  /**
   * Hides the second line of each label that `segmentDescription` adds.
   */
  hideDescriptions?: boolean;
  /**
   * Hides the segment filter above the chart.
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
   * Returns the rows of a segment's detail popover as `{ key, value }` pairs. By default it
   * shows the value and the percentage.
   */
  detailPopoverContent?: (datum: T, sum: number) => ReadonlyArray<PieChartProps.DetailPopoverItem>;
  /**
   * Content shown at the bottom of a segment's detail popover, such as a link.
   */
  detailPopoverFooter?: (datum: T) => React.ReactNode;
  /**
   * The largest width of the detail popover.
   */
  detailPopoverSize?: DetailPopoverSize;
  /**
   * The segment that is emphasized, with the others dimmed. Set it with `onHighlightChange` to
   * control it.
   */
  highlightedSegment?: T | null;
  /**
   * Called when the user highlights a segment, or clears the highlight, with the segment in
   * `event.detail.highlightedSegment`.
   */
  onHighlightChange?: NonCancelableEventHandler<PieChartProps.HighlightChangeDetail<T>>;
  /**
   * The segments that are shown. Set it with `onFilterChange` to control the filter; by default
   * every segment is shown.
   */
  visibleSegments?: ReadonlyArray<T>;
  /**
   * Called when the user changes the segment filter, with the shown segments in
   * `event.detail.visibleSegments`.
   */
  onFilterChange?: NonCancelableEventHandler<PieChartProps.FilterChangeDetail<T>>;
  /**
   * The state of the data:
   * * `loading`: shows `loadingText` in place of the chart.
   * * `error`: shows `errorText` and a `recoveryText` button that calls `onRecoveryClick`.
   * * `finished`: shows the chart, or `empty` when there is no data.
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
   * Shown in place of the chart when there is no data.
   */
  empty?: React.ReactNode;
  /**
   * Shown in place of the chart when the filter hides every segment.
   */
  noMatch?: React.ReactNode;
  /**
   * Accessible name of the chart.
   */
  ariaLabel?: string;
  /**
   * The ID of an element that names the chart, such as a container header.
   */
  ariaLabelledby?: string;
  /**
   * A longer description of the chart for screen reader users.
   */
  ariaDescription?: string;
  /**
   * Text the chart renders on its own:
   * * `filterLabel`, `filterPlaceholder` and `filterSelectedAriaLabel`: the segment filter.
   * * `legendAriaLabel`: the accessible name of the legend.
   * * `chartAriaRoleDescription` and `segmentAriaRoleDescription`: spoken names of the chart
   *   and of each segment.
   * * `detailsValue` and `detailsPercentage`: the default rows of the detail popover.
   * * `detailPopoverDismissAriaLabel`: the close button of a pinned detail popover.
   */
  i18nStrings?: PieChartProps.I18nStrings;
}

export namespace PieChartProps {
  export interface Datum {
    /** Name of the segment, shown in its label, the legend, the filter and the detail popover. */
    title: string;
    /** The segment's size. Segments are drawn in proportion to their values. */
    value: number;
    /** A color for the segment. By default segments take the categorical chart colors in order. */
    color?: string;
  }

  export type Variant = 'pie' | 'donut';

  export type Size = 'small' | 'medium' | 'large';

  export interface DetailPopoverItem {
    key: string;
    value: string;
  }

  export interface HighlightChangeDetail<T> {
    highlightedSegment: T | null;
  }

  export interface FilterChangeDetail<T> {
    visibleSegments: ReadonlyArray<T>;
  }

  export interface I18nStrings extends PieChartI18nStrings {}
}

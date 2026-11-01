// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  colorBorderStrong,
  colorChartsCategorical1,
  colorChartsCategorical2,
  colorChartsCategorical3,
  colorChartsCategorical4,
  colorChartsCategorical5,
  colorChartsCategorical6,
  colorChartsCategorical7,
  colorChartsCategorical8,
} from '@ordinate-ui/design-tokens';

/**
 * The categorical series colors, in order. They are token references, so they follow the
 * color mode and revision.
 */
export const categoricalColors: ReadonlyArray<string> = [
  colorChartsCategorical1,
  colorChartsCategorical2,
  colorChartsCategorical3,
  colorChartsCategorical4,
  colorChartsCategorical5,
  colorChartsCategorical6,
  colorChartsCategorical7,
  colorChartsCategorical8,
];

export const thresholdColor = colorBorderStrong;

/**
 * Fills for bars, areas and pie segments. Each series gets one in addition to its color, so
 * series stay apart in print, in grayscale and for readers who do not see the colors apart.
 */
export type FillPattern =
  'solid' | 'diagonal' | 'cross-hatch' | 'dots' | 'horizontal' | 'reverse-diagonal' | 'vertical' | 'grid';

export const fillPatterns: ReadonlyArray<FillPattern> = [
  'solid',
  'diagonal',
  'dots',
  'horizontal',
  'cross-hatch',
  'reverse-diagonal',
  'vertical',
  'grid',
];

/**
 * Point markers for lines, in the same order as the fills.
 */
export type MarkerShape =
  'circle' | 'square' | 'triangle' | 'diamond' | 'ring' | 'square-outline' | 'triangle-down' | 'cross';

export const markerShapes: ReadonlyArray<MarkerShape> = [
  'circle',
  'square',
  'triangle',
  'diamond',
  'ring',
  'square-outline',
  'triangle-down',
  'cross',
];

/**
 * Stroke dash arrays for lines. The first line is solid; the rest are told apart by rhythm
 * as well as by marker.
 */
export const lineDashes: ReadonlyArray<string | undefined> = [
  undefined,
  '7 3',
  '2 3',
  '10 3 2 3',
  '4 4',
  '12 3 2 3 2 3',
  '1 4',
  '14 4',
];

/**
 * Dash arrays for threshold lines, which are drawn in ink and need no palette slot.
 */
export const thresholdDashes: ReadonlyArray<string> = ['6 4', '2 3', '10 3 2 3', '14 4'];

export interface SeriesStyle {
  color: string;
  pattern: FillPattern;
  marker: MarkerShape;
  dash: string | undefined;
}

/**
 * The look of the series at `index`, counting only series that take a palette slot. Past the
 * eighth series the colors repeat with the patterns shifted by one, so no two series share
 * both color and pattern.
 */
export function getSeriesStyle(index: number, color?: string): SeriesStyle {
  const slot = index % categoricalColors.length;
  const variant = (index + Math.floor(index / categoricalColors.length)) % fillPatterns.length;
  return {
    color: color ?? categoricalColors[slot],
    pattern: fillPatterns[variant],
    marker: markerShapes[variant],
    dash: lineDashes[variant],
  };
}

export function getThresholdStyle(index: number, color?: string): SeriesStyle {
  return {
    color: color ?? thresholdColor,
    pattern: 'solid',
    marker: 'circle',
    dash: thresholdDashes[index % thresholdDashes.length],
  };
}

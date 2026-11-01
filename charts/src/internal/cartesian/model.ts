// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getSeriesStyle, getThresholdStyle, SeriesStyle } from '../series-style';
import { formatTickNumber, formatTimeTick, formatValue } from '../utils/format';
import { areaPath, linePath, Point } from '../utils/paths';
import {
  BandScale,
  ChartValue,
  ContinuousScale,
  createBandScale,
  createContinuousScale,
  ScaleType,
  toNumber,
  valueKey,
} from '../utils/scales';
import { stackExtent, stackValues } from '../utils/stack';
import { estimateTextWidth } from '../utils/text';
import { niceDomain, niceLogDomain, TimeInterval } from '../utils/ticks';
import { CartesianSeries, Datum, TickFormatter } from './interfaces';

export type SeriesKind = CartesianSeries<ChartValue>['type'];

/**
 * A series with its look settled and its values indexed by x.
 */
export interface ChartSeries<T extends ChartValue> {
  id: string;
  source: CartesianSeries<T>;
  kind: SeriesKind;
  title: string;
  data: ReadonlyArray<Datum<T>>;
  style: SeriesStyle;
  values: ReadonlyMap<string, number>;
}

/**
 * Settles each series' color, pattern, dash and marker by its place in the full list, so a
 * series keeps its look when others are filtered out.
 */
export function normalizeSeries<T extends ChartValue>(series: ReadonlyArray<CartesianSeries<T>>): ChartSeries<T>[] {
  let paletteIndex = 0;
  let thresholdIndex = 0;
  return series.map((source, index) => {
    const data = source.type === 'threshold' ? [] : source.data;
    const style =
      source.type === 'threshold'
        ? getThresholdStyle(thresholdIndex++, source.color)
        : getSeriesStyle(paletteIndex++, source.color);
    return {
      id: `series-${index}`,
      source,
      kind: source.type,
      title: source.title,
      data,
      style,
      values: new Map(data.map(datum => [valueKey(datum.x), datum.y])),
    };
  });
}

export interface Tick {
  key: string;
  /** Position along the axis in pixels, from the plot's top-left corner. */
  position: number;
  label: string;
  showLabel: boolean;
}

export interface Position<T> {
  key: string;
  value: T;
  /** Position along the category axis in pixels. */
  position: number;
}

export interface PointMark {
  positionIndex: number;
  x: number;
  y: number;
  value: number;
}

export interface LineMark<T extends ChartValue> {
  series: ChartSeries<T>;
  path: string;
  points: PointMark[];
}

export interface AreaMark<T extends ChartValue> {
  series: ChartSeries<T>;
  path: string;
  topPath: string;
  points: PointMark[];
}

export interface BarRect {
  positionIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
}

export interface BarMark<T extends ChartValue> {
  series: ChartSeries<T>;
  rects: BarRect[];
}

export interface ThresholdMark<T extends ChartValue> {
  series: ChartSeries<T>;
  /** `value` for a line at a y value, `category` for a line at an x value. */
  axis: 'value' | 'category';
  position: number;
}

export interface CartesianModel<T extends ChartValue> {
  horizontal: boolean;
  width: number;
  height: number;
  categoryScale: BandScale | ContinuousScale;
  valueScale: ContinuousScale;
  categoryTicks: Tick[];
  valueTicks: Tick[];
  positions: Position<T>[];
  /** Width of the band a position covers, for the hover highlight of bars; 0 on continuous axes. */
  bandSize: number;
  lines: LineMark<T>[];
  areas: AreaMark<T>[];
  bars: BarMark<T>[];
  thresholds: ThresholdMark<T>[];
  /** Position of y = 0 on the value axis, when it is inside the domain. */
  baseline: number | null;
}

export interface ModelInput<T extends ChartValue> {
  allSeries: ReadonlyArray<ChartSeries<T>>;
  visibleSeries: ReadonlyArray<ChartSeries<T>>;
  xScaleType: ScaleType;
  yScaleType: 'linear' | 'log';
  xDomain?: ReadonlyArray<T>;
  yDomain?: readonly [number, number];
  stackedBars: boolean;
  horizontal: boolean;
  width: number;
  height: number;
  rtl: boolean;
  xTickFormatter?: TickFormatter<T>;
  yTickFormatter?: TickFormatter<number>;
}

// Pixels between ticks, so labels never run into each other.
const valueTickSpacing = { vertical: 48, horizontal: 96 };
const categoryTickSpacing = 110;
const barGap = 2;

function uniqueValues<T extends ChartValue>(series: ReadonlyArray<ChartSeries<T>>): T[] {
  const seen = new Map<string, T>();
  for (const item of series) {
    for (const datum of item.data) {
      const key = valueKey(datum.x);
      if (!seen.has(key)) {
        seen.set(key, datum.x);
      }
    }
  }
  return [...seen.values()];
}

function extent(values: number[]): [number, number] | null {
  const finite = values.filter(Number.isFinite);
  return finite.length ? [Math.min(...finite), Math.max(...finite)] : null;
}

function formatCategory<T extends ChartValue>(value: T, formatter: TickFormatter<T> | undefined): string {
  if (formatter) {
    return formatter(value);
  }
  return value instanceof Date ? formatTimeTick(value.getTime(), null) : formatValue(value);
}

function formatContinuousTick<T extends ChartValue>(
  value: number,
  scale: ContinuousScale,
  formatter: TickFormatter<T> | undefined,
  step: number,
  interval: TimeInterval | null
): string {
  if (scale.type === 'time') {
    return formatter ? formatter(new Date(value) as T) : formatTimeTick(value, interval);
  }
  if (formatter) {
    return formatter(value as T);
  }
  return formatTickNumber(value, scale.type === 'log' ? value : step);
}

/**
 * Works out everything a cartesian chart draws: scales, ticks, the positions the keyboard
 * moves between, and the geometry of every line, area, bar and threshold. Coordinates are in
 * pixels from the plot's top-left corner, already mirrored for right-to-left layout.
 */
export function computeCartesianModel<T extends ChartValue>(input: ModelInput<T>): CartesianModel<T> {
  const { allSeries, visibleSeries, yScaleType, xDomain, yDomain, stackedBars, horizontal, width, height, rtl } = input;
  const hasBars = visibleSeries.some(series => series.kind === 'bar') || allSeries.some(s => s.kind === 'bar');
  // Bars need a band per category, so they always use a categorical axis.
  const xScaleType: ScaleType = hasBars ? 'categorical' : input.xScaleType;
  const categoryLength = horizontal ? height : width;
  const valueLength = horizontal ? width : height;
  const categoryRange: [number, number] = horizontal ? [0, height] : rtl ? [width, 0] : [0, width];
  const valueRange: [number, number] = horizontal ? (rtl ? [width, 0] : [0, width]) : [height, 0];

  // Category axis.
  let categoryScale: BandScale | ContinuousScale;
  let positionValues: T[];
  if (xScaleType === 'categorical') {
    const domain = xDomain ? [...xDomain] : uniqueValues(allSeries);
    categoryScale = createBandScale(
      domain,
      categoryRange,
      hasBars ? { paddingInner: 0.24, paddingOuter: 0.12 } : { paddingInner: 0, paddingOuter: 0 }
    );
    positionValues = domain;
  } else {
    const isPlottable = (value: T) => Number.isFinite(toNumber(value)) && (xScaleType !== 'log' || toNumber(value) > 0);
    const dataValues = uniqueValues(allSeries).filter(isPlottable);
    const fitted = extent(dataValues.map(toNumber)) ?? [0, 1];
    const domain: [number, number] =
      xDomain && xDomain.length >= 2 ? [toNumber(xDomain[0]), toNumber(xDomain[xDomain.length - 1])] : fitted;
    categoryScale = createContinuousScale(xScaleType, domain, categoryRange);
    const [low, high] = domain[0] <= domain[1] ? domain : [domain[1], domain[0]];
    positionValues = uniqueValues(visibleSeries)
      .filter(isPlottable)
      .filter(value => toNumber(value) >= low && toNumber(value) <= high)
      .sort((a, b) => toNumber(a) - toNumber(b));
  }
  const categoryAt = (value: T) => categoryScale.map(value);
  const positions: Position<T>[] = positionValues.map(value => ({
    key: valueKey(value),
    value,
    position: categoryAt(value),
  }));

  // Value axis.
  const visibleData = visibleSeries.filter(series => series.kind !== 'threshold');
  const areaSeries = visibleData.filter(series => series.kind === 'area');
  const barSeries = visibleData.filter(series => series.kind === 'bar');
  const lineSeries = visibleData.filter(series => series.kind === 'line');
  const thresholdSeries = visibleSeries.filter(series => series.kind === 'threshold');
  const valuesAt = (series: ChartSeries<T>) => positions.map(position => series.values.get(position.key));
  const areaStacks = stackValues(areaSeries.map(valuesAt));
  const barStacks = stackedBars ? stackValues(barSeries.map(valuesAt)) : [];

  const rawValues: number[] = [
    ...lineSeries.flatMap(series => series.data.map(datum => datum.y)),
    ...(stackedBars ? [] : barSeries.flatMap(series => series.data.map(datum => datum.y))),
    ...thresholdSeries.flatMap(series => {
      const y = (series.source as { y?: number }).y;
      return y === undefined ? [] : [y];
    }),
  ];
  if (areaSeries.length) {
    rawValues.push(...stackExtent(areaStacks));
  }
  if (barSeries.length) {
    rawValues.push(...(stackedBars ? stackExtent(barStacks) : [0]));
  }
  const valueTickCount = Math.max(
    2,
    Math.floor(valueLength / valueTickSpacing[horizontal ? 'horizontal' : 'vertical'])
  );
  let valueDomain: [number, number];
  if (yDomain) {
    valueDomain = [yDomain[0], yDomain[1]];
  } else if (yScaleType === 'log') {
    valueDomain = niceLogDomain(extent(rawValues.filter(value => value > 0)) ?? [1, 10]);
  } else {
    valueDomain = niceDomain(extent(rawValues) ?? [0, 1], valueTickCount);
  }
  const valueScale = createContinuousScale(yScaleType, valueDomain, valueRange);
  const valueAt = (value: number) => valueScale.map(value);
  const [domainLow, domainHigh] = valueDomain[0] <= valueDomain[1] ? valueDomain : [valueDomain[1], valueDomain[0]];
  const zero = yScaleType === 'log' ? domainLow : Math.min(Math.max(0, domainLow), domainHigh);
  const baseline = yScaleType !== 'log' && domainLow <= 0 && domainHigh >= 0 ? valueAt(0) : null;
  const place = (category: number, value: number): Point => (horizontal ? [value, category] : [category, value]);

  // Ticks.
  const valueTicks: Tick[] = valueScale.ticks(valueTickCount).map((value, index, all) => ({
    key: `y-${value}`,
    position: valueAt(value),
    label: input.yTickFormatter
      ? input.yTickFormatter(value)
      : formatTickNumber(value, yScaleType === 'log' ? value : (all[1] ?? value) - (all[0] ?? 0)),
    showLabel: true,
  }));

  let categoryTicks: Tick[];
  if (categoryScale.type === 'categorical') {
    const scale = categoryScale;
    const labels = scale.domain.map(value => formatCategory(value as T, input.xTickFormatter));
    const needed = horizontal ? 16 : Math.max(...labels.map(label => estimateTextWidth(label)), 0) + 12;
    const every = scale.step > 0 ? Math.max(1, Math.ceil(needed / scale.step)) : 1;
    categoryTicks = scale.domain.map((value, index) => ({
      key: `x-${valueKey(value)}`,
      position: scale.map(value),
      label: labels[index],
      showLabel: index % every === 0,
    }));
  } else {
    const scale = categoryScale;
    // Powers of ten make short labels, so a log axis can take ticks closer together.
    const spacing = horizontal
      ? valueTickSpacing.vertical
      : scale.type === 'log'
        ? categoryTickSpacing / 2
        : categoryTickSpacing;
    const count = Math.max(2, Math.floor(categoryLength / spacing));
    const ticks = scale.ticks(count);
    const interval = scale.tickInterval(count);
    const step = (ticks[1] ?? ticks[0] ?? 0) - (ticks[0] ?? 0);
    categoryTicks = ticks.map(value => ({
      key: `x-${value}`,
      position: scale.map(value),
      label: formatContinuousTick(value, scale, input.xTickFormatter, step, interval),
      showLabel: true,
    }));
  }

  // Lines.
  const pointsFor = (series: ChartSeries<T>, valueOf: (index: number) => number | undefined): PointMark[] =>
    positions.flatMap((position, positionIndex) => {
      const value = valueOf(positionIndex);
      if (value === undefined) {
        return [];
      }
      const [x, y] = place(position.position, valueAt(value));
      return Number.isFinite(x) && Number.isFinite(y) ? [{ positionIndex, x, y, value }] : [];
    });

  const lines: LineMark<T>[] = lineSeries.map(series => {
    const points = pointsFor(series, index => series.values.get(positions[index].key));
    return { series, points, path: linePath(points.map(point => [point.x, point.y])) };
  });

  // Stacked areas.
  const areas: AreaMark<T>[] = areaSeries.map((series, seriesIndex) => {
    const stack = areaStacks[seriesIndex];
    const top = positions.map((position, index) => place(position.position, valueAt(stack[index][1])));
    const bottom = positions.map((position, index) => place(position.position, valueAt(stack[index][0])));
    const points = pointsFor(series, index =>
      series.values.has(positions[index].key) ? stack[index][1] : undefined
    ).map(point => ({ ...point, value: series.values.get(positions[point.positionIndex].key) ?? 0 }));
    return { series, points, path: areaPath(top, bottom), topPath: linePath(top) };
  });

  // Bars.
  const bandwidth = categoryScale.type === 'categorical' ? categoryScale.bandwidth : 0;
  const categoryDirection = categoryRange[1] >= categoryRange[0] ? 1 : -1;
  const rectFrom = (center: number, breadth: number, from: number, to: number) => {
    const [x0, y0] = place(center - breadth / 2, from);
    const [x1, y1] = place(center + breadth / 2, to);
    return { x: Math.min(x0, x1), y: Math.min(y0, y1), width: Math.abs(x1 - x0), height: Math.abs(y1 - y0) };
  };
  const bars: BarMark<T>[] = barSeries.map((series, seriesIndex) => {
    const rects = positions.flatMap((position, positionIndex): BarRect[] => {
      const value = series.values.get(position.key);
      if (value === undefined || !Number.isFinite(position.position)) {
        return [];
      }
      if (stackedBars) {
        const [bottom, top] = barStacks[seriesIndex][positionIndex];
        let from = valueAt(bottom);
        let to = valueAt(top);
        // A hairline of background between stacked segments, as between grouped bars.
        const towardTop = Math.sign(to - from);
        if (Math.abs(to - from) > 3) {
          to -= towardTop;
          if (bottom !== 0) {
            from += towardTop;
          }
        }
        return [{ positionIndex, value, ...rectFrom(position.position, bandwidth, from, to) }];
      }
      const slot = bandwidth / barSeries.length;
      const center = position.position + categoryDirection * (-bandwidth / 2 + (seriesIndex + 0.5) * slot);
      const breadth = Math.max(1, slot - (barSeries.length > 1 ? barGap : 0));
      return [{ positionIndex, value, ...rectFrom(center, breadth, valueAt(zero), valueAt(value)) }];
    });
    return { series, rects };
  });

  // Thresholds.
  const thresholds: ThresholdMark<T>[] = thresholdSeries.flatMap((series): ThresholdMark<T>[] => {
    const source = series.source as { y?: number; x?: T };
    if (source.y !== undefined) {
      const position = valueAt(source.y);
      return Number.isFinite(position) ? [{ series, axis: 'value', position }] : [];
    }
    if (source.x !== undefined) {
      const position = categoryAt(source.x);
      return Number.isFinite(position) ? [{ series, axis: 'category', position }] : [];
    }
    return [];
  });

  return {
    horizontal,
    width,
    height,
    categoryScale,
    valueScale,
    categoryTicks,
    valueTicks,
    positions,
    bandSize: categoryScale.type === 'categorical' ? categoryScale.step : 0,
    lines,
    areas,
    bars,
    thresholds,
    baseline,
  };
}

/**
 * The index of the position closest to a point along the category axis.
 */
export function nearestPosition(positions: ReadonlyArray<Position<unknown>>, coordinate: number): number | null {
  let best: number | null = null;
  let bestDistance = Infinity;
  positions.forEach((position, index) => {
    const distance = Math.abs(position.position - coordinate);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  });
  return best;
}

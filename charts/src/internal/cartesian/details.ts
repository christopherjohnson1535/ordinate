// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DetailRow } from '../components/detail-popover';
import { SwatchKind } from '../components/marks';
import { formatNumber, formatValue } from '../utils/format';
import { ChartValue } from '../utils/scales';
import { CartesianSeries, TickFormatter } from './interfaces';
import { ChartSeries, Position } from './model';

export function swatchKind(kind: ChartSeries<ChartValue>['kind']): SwatchKind {
  if (kind === 'line') {
    return 'line';
  }
  return kind === 'threshold' ? 'threshold' : 'fill';
}

export interface PositionDetails {
  header: string;
  rows: Array<DetailRow & { seriesId: string; text: string }>;
  summary?: DetailRow & { text: string };
  /** The same content as one sentence, for screen readers. */
  announcement: string;
}

export interface DetailsOptions<T extends ChartValue> {
  series: ReadonlyArray<ChartSeries<T>>;
  position: Position<T>;
  xTickFormatter?: TickFormatter<T>;
  highlightedId: string | null;
  totalLabel: string;
  /** Adds a total row, for stacked series. */
  showTotal: boolean;
}

function formatX<T extends ChartValue>(value: T, formatter?: TickFormatter<T>): string {
  return formatter ? formatter(value) : formatValue(value);
}

/**
 * What the detail popover shows at one x position: a row per series that has a value there,
 * the thresholds, and a total for stacks.
 */
export function getPositionDetails<T extends ChartValue>({
  series,
  position,
  xTickFormatter,
  highlightedId,
  totalLabel,
  showTotal,
}: DetailsOptions<T>): PositionDetails {
  const header = formatX(position.value, xTickFormatter);
  const rows: PositionDetails['rows'] = [];
  let total = 0;
  let stacked = 0;
  for (const item of series) {
    let text: string | null = null;
    if (item.kind === 'threshold') {
      const source = item.source as Extract<CartesianSeries<T>, { type: 'threshold' }>;
      if (source.y !== undefined) {
        text = source.valueFormatter ? source.valueFormatter(source.y) : formatNumber(source.y);
      }
    } else {
      const value = item.values.get(position.key);
      if (value !== undefined) {
        const source = item.source as Exclude<CartesianSeries<T>, { type: 'threshold' }>;
        text = source.valueFormatter ? source.valueFormatter(value, position.value) : formatNumber(value);
        total += value;
        stacked++;
      }
    }
    if (text !== null) {
      rows.push({
        id: item.id,
        seriesId: item.id,
        title: item.title,
        value: text,
        text,
        kind: swatchKind(item.kind),
        style: item.style,
        emphasized: highlightedId === item.id,
        dimmed: highlightedId !== null && highlightedId !== item.id,
      });
    }
  }
  const summary =
    showTotal && stacked > 1
      ? { id: 'total', title: totalLabel, value: formatNumber(total), text: formatNumber(total) }
      : undefined;
  const parts = rows.map(row => `${row.title} ${row.text}`);
  if (summary) {
    parts.push(`${totalLabel} ${summary.text}`);
  }
  return { header, rows, summary, announcement: `${header}: ${parts.join(', ')}` };
}

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { fireNonCancelableEvent } from '../internal/events';
import { useBrowserLayoutEffect } from '../internal/hooks/use-browser-layout-effect';
import { TableProps } from './interfaces';
import { getColumnKey, VisibleColumn } from './utils';

// The width of a column that has none set and cannot be measured, such as during server rendering.
const fallbackWidth = 120;

export const columnKeyAttribute = 'data-column-key';

interface ColumnWidthsOptions<T> {
  enabled: boolean;
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>;
  visibleColumns: ReadonlyArray<VisibleColumn<T>>;
  tableRef: React.RefObject<HTMLTableElement | null>;
  onColumnWidthsChange?: TableProps['onColumnWidthsChange'];
}

export interface ColumnWidths {
  layout: 'auto' | 'fixed';
  /**
   * The width to set on a column heading. The last column has none, so it takes the remaining space.
   */
  widthOf: (key: string) => number | undefined;
  /**
   * The narrowest the table may get, so the last column keeps at least its own width.
   */
  minTableWidth?: number;
  resize: (key: string, width: number) => void;
  commit: (key: string, width: number) => void;
}

function initialWidths<T>(columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>) {
  const widths = new Map<string, number>();
  columnDefinitions.forEach((definition, index) => {
    if (typeof definition.width === 'number') {
      widths.set(getColumnKey(definition, index), definition.width);
    }
  });
  return widths;
}

/**
 * Column widths for resizable columns. Columns without a numeric width are rendered once in the
 * automatic layout and measured before the browser paints, then the table switches to a fixed layout.
 */
export function useColumnWidths<T>({
  enabled,
  columnDefinitions,
  visibleColumns,
  tableRef,
  onColumnWidthsChange,
}: ColumnWidthsOptions<T>): ColumnWidths {
  const [widths, setWidths] = useState(() => initialWidths(columnDefinitions));
  // Columns whose width comes from the definitions or from the user, rather than from measuring.
  const [chosen, setChosen] = useState(() => new Set(initialWidths(columnDefinitions).keys()));
  const [extraWidth, setExtraWidth] = useState(0);
  const measured = visibleColumns.every(column => widths.has(column.key));
  const visibleKeys = visibleColumns.map(column => column.key).join(' ');

  useBrowserLayoutEffect(() => {
    const headerRow = tableRef.current?.tHead?.rows[0];
    if (!enabled || !headerRow) {
      return;
    }
    const cells = Array.from(headerRow.cells, cell => ({
      key: cell.getAttribute(columnKeyAttribute),
      width: cell.getBoundingClientRect().width,
    }));
    // Cells that are not data columns, such as the selection column, keep their own width.
    setExtraWidth(cells.reduce((sum, cell) => (cell.key === null ? sum + cell.width : sum), 0));
    setWidths(current => {
      const missing = cells.filter(cell => cell.key !== null && !current.has(cell.key));
      if (missing.length === 0) {
        return current;
      }
      const next = new Map(current);
      missing.forEach(cell => next.set(cell.key!, cell.width || fallbackWidth));
      return next;
    });
    // Measures again when the set of columns changes, not after every resize.
  }, [enabled, visibleKeys, tableRef]);

  const lastKey = visibleColumns[visibleColumns.length - 1]?.key;
  // A measured last column was stretched to fill the table, so only part of its width is kept as a
  // minimum; otherwise widening another column would always push the table into scrolling.
  const minimumOf = (key: string) => {
    const width = widths.get(key) ?? 0;
    return key === lastKey && !chosen.has(key) ? Math.min(width, fallbackWidth) : width;
  };
  const total = visibleColumns.reduce((sum, column) => sum + minimumOf(column.key), 0);

  const widthsInDefinitionOrder = (current: Map<string, number>) =>
    columnDefinitions.map((definition, index) => {
      const width = current.get(getColumnKey(definition, index)) ?? definition.width;
      return typeof width === 'number' ? width : fallbackWidth;
    });

  return {
    layout: enabled && measured ? 'fixed' : 'auto',
    widthOf: key => (enabled && key !== lastKey ? widths.get(key) : undefined),
    minTableWidth: enabled && measured ? Math.round(total + extraWidth) : undefined,
    resize: (key, width) => {
      setChosen(current => (current.has(key) ? current : new Set(current).add(key)));
      setWidths(current => new Map(current).set(key, width));
    },
    commit: (key, width) => {
      const next = new Map(widths).set(key, width);
      setChosen(current => (current.has(key) ? current : new Set(current).add(key)));
      setWidths(next);
      fireNonCancelableEvent(onColumnWidthsChange, { widths: widthsInDefinitionOrder(next) });
    },
  };
}

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from '../internal/logging';
import { TableProps } from './interfaces';

export interface VisibleColumn<T> {
  key: string;
  definition: TableProps.ColumnDefinition<T>;
}

export function getColumnKey<T>(definition: TableProps.ColumnDefinition<T>, index: number): string {
  return definition.id ?? String(index);
}

/**
 * The columns to show, in display order. `columnDisplay` picks and orders them by ID.
 */
export function getVisibleColumns<T>(
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>,
  columnDisplay?: ReadonlyArray<TableProps.ColumnDisplayProperties>
): VisibleColumn<T>[] {
  const all = columnDefinitions.map((definition, index) => ({ key: getColumnKey(definition, index), definition }));
  if (!columnDisplay) {
    return all;
  }
  if (columnDefinitions.some(definition => definition.id === undefined)) {
    warnOnce('Table', 'Give every column definition an `id` when you use `columnDisplay`.');
  }
  const byId = new Map(all.filter(column => column.definition.id !== undefined).map(column => [column.key, column]));
  return columnDisplay
    .filter(display => display.visible)
    .map(display => byId.get(display.id))
    .filter((column): column is VisibleColumn<T> => column !== undefined);
}

/**
 * The value that identifies an item: its tracked key, or the item itself when there is no `trackBy`.
 */
export function getTrackedValue<T>(trackBy: TableProps.TrackBy<T> | undefined, item: T): unknown {
  if (typeof trackBy === 'function') {
    return trackBy(item);
  }
  if (trackBy !== undefined) {
    return (item as Record<string, unknown>)[trackBy];
  }
  return item;
}

export function getRowKey<T>(trackBy: TableProps.TrackBy<T> | undefined, item: T, index: number): string {
  return trackBy === undefined ? String(index) : String(getTrackedValue(trackBy, item));
}

export function isSortable<T>(definition: TableProps.ColumnDefinition<T>): boolean {
  return Boolean(definition.sortingField || definition.sortingComparator) && !definition.sortingDisabled;
}

export function isSortingColumn<T>(
  definition: TableProps.ColumnDefinition<T>,
  sortingColumn: TableProps.SortingColumn<T> | undefined
): boolean {
  if (!sortingColumn) {
    return false;
  }
  if (sortingColumn === definition) {
    return true;
  }
  if (sortingColumn.sortingField !== undefined) {
    return sortingColumn.sortingField === definition.sortingField;
  }
  return (
    sortingColumn.sortingComparator !== undefined && sortingColumn.sortingComparator === definition.sortingComparator
  );
}

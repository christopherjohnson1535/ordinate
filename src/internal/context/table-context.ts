// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

/**
 * Settings the table root hands down to its rows and cells, which style themselves from them.
 */
export interface TableContextValue {
  wrapLines: boolean;
  stripedRows: boolean;
  layout: 'auto' | 'fixed';
  /**
   * Padding at the start of the first column and the end of the last one. `container` lines them up
   * with the padding of a surrounding container, and `flush` with the edges of the table.
   */
  edgeInset: 'cell' | 'container' | 'flush';
  /**
   * How strongly the table is ruled. `heavy` draws a schedule: a thick ink rule under the header row.
   * `light` keeps the rules thin, for a table set inside another sheet.
   */
  ruleWeight: 'heavy' | 'light';
}

export const TableContext = createContext<TableContextValue>({
  wrapLines: false,
  stripedRows: false,
  layout: 'auto',
  edgeInset: 'cell',
  ruleWeight: 'heavy',
});

export function useTableContext(): TableContextValue {
  return useContext(TableContext);
}

/**
 * Which part of the table a row sits in. Only body rows react to hover and striping.
 */
export type TableSection = 'head' | 'body';

export const TableSectionContext = createContext<TableSection>('body');

export function useTableSection(): TableSection {
  return useContext(TableSectionContext);
}

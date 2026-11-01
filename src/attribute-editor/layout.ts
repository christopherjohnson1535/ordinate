// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Breakpoint, breakpoints } from '../internal/breakpoints';
import { warnOnce } from '../internal/logging';
import { AttributeEditorProps } from './interfaces';

export interface ResolvedLayout {
  rows: ReadonlyArray<ReadonlyArray<number>>;
  removeButtonOwnRow: boolean;
}

// Two fields fit side by side in a narrow panel; more need a wider editor before they line up.
function defaultLayouts(fieldCount: number): AttributeEditorProps.GridLayout[] {
  const stacked = Array.from({ length: fieldCount }, () => [1]);
  const columns = [Array.from({ length: fieldCount }, () => 1)];
  return [
    { breakpoint: 'default', rows: stacked, removeButton: { ownRow: true } },
    { breakpoint: fieldCount <= 2 ? 'xxs' : 'xs', rows: columns },
  ];
}

function fieldsIn(layout: AttributeEditorProps.GridLayout): number {
  return layout.rows.reduce((count, row) => count + row.length, 0);
}

function pickForBreakpoint(
  layouts: ReadonlyArray<AttributeEditorProps.GridLayout>,
  breakpoint: Breakpoint
): AttributeEditorProps.GridLayout | undefined {
  const rank = (layout: AttributeEditorProps.GridLayout) => breakpoints.indexOf(layout.breakpoint ?? 'default');
  return layouts
    .filter(layout => rank(layout) <= breakpoints.indexOf(breakpoint))
    .reduce<AttributeEditorProps.GridLayout | undefined>(
      (best, layout) => (best === undefined || rank(layout) >= rank(best) ? layout : best),
      undefined
    );
}

/**
 * The layout of a row at the given breakpoint: the consumer's `gridLayout` when it covers every
 * field, otherwise the responsive default.
 */
export function resolveLayout(
  gridLayout: ReadonlyArray<AttributeEditorProps.GridLayout> | undefined,
  fieldCount: number,
  breakpoint: Breakpoint
): ResolvedLayout {
  const custom = gridLayout && pickForBreakpoint(gridLayout, breakpoint);
  if (custom && fieldsIn(custom) !== fieldCount) {
    warnOnce('AttributeEditor', '`gridLayout` needs one width for every field of `definition`.');
  }
  const layout =
    custom && fieldsIn(custom) === fieldCount ? custom : pickForBreakpoint(defaultLayouts(fieldCount), breakpoint)!;
  return { rows: layout.rows, removeButtonOwnRow: layout.removeButton?.ownRow ?? false };
}

/**
 * Whether every field sits in one line next to the remove button, so the rows line up as columns
 * under one set of headings.
 */
export function isColumnLayout(layout: ResolvedLayout): boolean {
  return layout.rows.length === 1 && !layout.removeButtonOwnRow;
}

export function toGridTemplate(widths: ReadonlyArray<number>, withRemoveButton: boolean): string {
  const fields = widths.map(width => `minmax(0, ${width}fr)`);
  return [...fields, ...(withRemoveButton ? ['auto'] : [])].join(' ');
}

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Breakpoint, breakpoints, resolveBreakpointValue } from '../internal/breakpoints';
import { GridProps } from './interfaces';

export const gridColumns = 12;

export interface Placement {
  /**
   * The `grid-column` value, such as `4 / span 6`.
   */
  column: string;
  /**
   * The `grid-row` value.
   */
  row: number;
}

interface Span {
  colspan: number;
  offset: number;
  shift: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function readSpan(definition: GridProps.ElementDefinition, breakpoint: Breakpoint): Span {
  const read = (value: GridProps.Value | undefined) => resolveBreakpointValue(value, breakpoint) ?? 0;
  const colspan = clamp(Math.round(read(definition.colspan) || gridColumns), 1, gridColumns);
  return {
    colspan,
    offset: clamp(Math.round(read(definition.offset)), 0, gridColumns - colspan),
    shift: Math.round(read(definition.push) - read(definition.pull)),
  };
}

/**
 * Lays the children out in rows the way floated columns would wrap, then applies push and pull as a
 * visual shift that leaves the other children where they are.
 */
function placeAt(definitions: ReadonlyArray<GridProps.ElementDefinition>, breakpoint: Breakpoint): Placement[] {
  let row = 1;
  let cursor = 0;
  return definitions.map(definition => {
    const { colspan, offset, shift } = readSpan(definition, breakpoint);
    if (cursor > 0 && cursor + offset + colspan > gridColumns) {
      row += 1;
      cursor = 0;
    }
    const start = cursor + offset;
    cursor = start + colspan;
    const visualStart = clamp(start + shift, 0, gridColumns - colspan);
    return { column: `${visualStart + 1} / span ${colspan}`, row };
  });
}

/**
 * The placement of each child at every breakpoint, keyed by breakpoint.
 */
export function getPlacements(
  definitions: ReadonlyArray<GridProps.ElementDefinition>
): Record<Breakpoint, Placement[]> {
  return Object.fromEntries(breakpoints.map(breakpoint => [breakpoint, placeAt(definitions, breakpoint)])) as Record<
    Breakpoint,
    Placement[]
  >;
}

/**
 * Custom properties for one child. A breakpoint only gets its own property when the placement
 * changes there; the styles fall back to the nearest smaller breakpoint otherwise.
 */
export function placementStyle(placements: Record<Breakpoint, Placement[]>, index: number): Record<string, string> {
  const style: Record<string, string> = {};
  let previous: Placement | undefined;
  for (const breakpoint of breakpoints) {
    const placement = placements[breakpoint][index];
    if (placement.column !== previous?.column) {
      style[`--grid-column-${breakpoint}`] = placement.column;
    }
    if (placement.row !== previous?.row) {
      style[`--grid-row-${breakpoint}`] = String(placement.row);
    }
    previous = placement;
  }
  return style;
}

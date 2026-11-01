// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface UtilityMeasure {
  /**
   * Width with its text.
   */
  full: number;
  /**
   * Width with only its icon.
   */
  collapsed: number;
  canCollapseText: boolean;
  canOverflow: boolean;
}

export interface LayoutInput {
  /**
   * The width the utilities may take.
   */
  available: number;
  utilities: ReadonlyArray<UtilityMeasure>;
  overflowTriggerWidth: number;
  /**
   * The gap between two utilities.
   */
  gap: number;
}

export interface UtilityLayout {
  collapseText: boolean;
  /**
   * Indexes of the utilities shown in the overflow menu instead of the bar.
   */
  overflowed: ReadonlyArray<number>;
}

function rowWidth(widths: ReadonlyArray<number>, gap: number): number {
  if (widths.length === 0) {
    return 0;
  }
  return widths.reduce((sum, width) => sum + width, 0) + gap * (widths.length - 1);
}

/**
 * Decides how the utilities fit in `available`: all with text, then with text collapsed to
 * icons, then moving utilities into the overflow menu one at a time from the first, until
 * the rest fit next to the overflow trigger. Utilities that cannot overflow stay in the bar
 * even when they do not fit.
 */
export function computeUtilityLayout({ available, utilities, overflowTriggerWidth, gap }: LayoutInput): UtilityLayout {
  const full = utilities.map(utility => utility.full);
  if (rowWidth(full, gap) <= available) {
    return { collapseText: false, overflowed: [] };
  }

  const collapsed = utilities.map(utility => (utility.canCollapseText ? utility.collapsed : utility.full));
  if (rowWidth(collapsed, gap) <= available) {
    return { collapseText: true, overflowed: [] };
  }

  const overflowed: number[] = [];
  for (const [index, utility] of utilities.entries()) {
    if (!utility.canOverflow) {
      continue;
    }
    overflowed.push(index);
    const remaining = collapsed.filter((_, position) => !overflowed.includes(position));
    if (rowWidth([...remaining, overflowTriggerWidth], gap) <= available) {
      break;
    }
  }
  return { collapseText: true, overflowed };
}

export function isSameLayout(a: UtilityLayout, b: UtilityLayout): boolean {
  return (
    a.collapseText === b.collapseText &&
    a.overflowed.length === b.overflowed.length &&
    a.overflowed.every((index, position) => b.overflowed[position] === index)
  );
}

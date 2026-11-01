// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import { isSameDay } from '../../dates/arithmetic';
import { getNextFocusedDate } from '../../dates/grid';
import { DateGranularity } from '../../dates/iso';
import { getLogicalArrowStep } from '../../direction';

/**
 * Selects the one cell in a calendar that holds the tab stop.
 */
export const tabStopSelector = '[data-date][tabindex="0"]';

export interface GridKeyboardOptions {
  granularity: DateGranularity;
  weekStart: number;
  focusedDate: Date;
  onMove(date: Date): void;
  onSelect(date: Date): void;
}

/**
 * Roving focus for one or more calendar grids inside a container. Keys move the focused date,
 * and once the grids have rendered the new date, its cell takes focus. The container can hold
 * several month grids, so focus can move from one to the next.
 */
export function useGridKeyboard({ granularity, weekStart, focusedDate, onMove, onSelect }: GridKeyboardOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const focusPending = useRef(false);

  const focus = () => containerRef.current?.querySelector<HTMLElement>(tabStopSelector)?.focus();

  // Runs after every render: the cell to focus may only exist once the next month has rendered.
  useEffect(() => {
    if (focusPending.current) {
      focusPending.current = false;
      focus();
    }
  });

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(focusedDate);
      return;
    }
    const next = getNextFocusedDate(
      focusedDate,
      { key: event.key, shiftKey: event.shiftKey, logicalStep: getLogicalArrowStep(event.key, event.currentTarget) },
      granularity,
      weekStart
    );
    if (next) {
      event.preventDefault();
      if (!isSameDay(next, focusedDate)) {
        focusPending.current = true;
        onMove(next);
      }
    }
  };

  return { containerRef, onKeyDown, focus };
}

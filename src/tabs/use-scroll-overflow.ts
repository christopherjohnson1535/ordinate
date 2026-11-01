// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { getIsRtl } from '../internal/direction';
import { useResizeObserver } from '../internal/hooks/use-resize-observer';

export interface ScrollOverflow {
  overflowing: boolean;
  atStart: boolean;
  atEnd: boolean;
}

// Sub-pixel layouts leave the scroll position a fraction away from its limits.
const tolerance = 1;
// Each step keeps part of the previous view in sight, so the reader does not lose their place.
const stepRatio = 0.75;

/**
 * Tracks whether a horizontal scroller overflows and whether it is scrolled to either end,
 * in logical terms: `atStart` is the right edge in right-to-left layout.
 */
export function useScrollOverflow(
  scrollerRef: React.RefObject<HTMLElement | null>,
  contentRef: React.RefObject<HTMLElement | null>
) {
  const [state, setState] = useState<ScrollOverflow>({ overflowing: false, atStart: true, atEnd: true });

  const measure = () => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }
    const max = scroller.scrollWidth - scroller.clientWidth;
    // Right-to-left scrollers count scrollLeft from zero down to negative values.
    const offset = Math.abs(scroller.scrollLeft);
    const next = {
      overflowing: max > tolerance,
      atStart: offset <= tolerance,
      atEnd: offset >= max - tolerance,
    };
    setState(current =>
      current.overflowing === next.overflowing && current.atStart === next.atStart && current.atEnd === next.atEnd
        ? current
        : next
    );
  };

  useResizeObserver(scrollerRef, measure);
  // The content changes size when tabs are added or renamed, while the scroller keeps its size.
  useResizeObserver(contentRef, measure);

  const scrollStep = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }
    const physical = getIsRtl(scroller) ? -direction : direction;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    scroller.scrollBy?.({
      left: physical * scroller.clientWidth * stepRatio,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  return { ...state, measure, scrollStep };
}

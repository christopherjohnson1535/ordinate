// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';

import { breakpointMinWidths } from '../internal/breakpoints';

// Two months need about the width of a small tablet; below that the popup shows one.
const query = `(min-width: ${breakpointMinWidths.xs}px)`;

function getMonthCount(): 1 | 2 {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 2;
  }
  return window.matchMedia(query).matches ? 2 : 1;
}

/**
 * How many months the absolute range calendar shows side by side: two, or one on narrow viewports.
 */
export function useMonthCount(): 1 | 2 {
  const [count, setCount] = useState(getMonthCount);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }
    const list = window.matchMedia(query);
    const update = () => setCount(list.matches ? 2 : 1);
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, []);
  return count;
}

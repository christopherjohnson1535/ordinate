// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

/**
 * Calls `onResize` once after mounting and again whenever the element changes size.
 * The latest callback is always used, so it does not need to be memoized.
 */
export function useResizeObserver(ref: React.RefObject<Element | null>, onResize: () => void): void {
  const callbackRef = useRef(onResize);
  useEffect(() => {
    callbackRef.current = onResize;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const notify = () => callbackRef.current();
    notify();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', notify);
      return () => window.removeEventListener('resize', notify);
    }
    const observer = new ResizeObserver(notify);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
}

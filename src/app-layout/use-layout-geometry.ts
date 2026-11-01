// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { useResizeObserver } from '../internal/hooks/use-resize-observer';
import { mobileBreakpoint } from './defaults';

export interface LayoutGeometry {
  width: number;
  height: number;
  isMobile: boolean;
  headerHeight: number;
  footerHeight: number;
  viewportHeight: number;
}

function subscribeToViewport(onChange: () => void) {
  window.addEventListener('resize', onChange);
  return () => window.removeEventListener('resize', onChange);
}

const getViewportHeight = () => window.innerHeight;
const getServerViewportHeight = () => 0;

// Follows the height of a fixed header or footer elsewhere on the page.
function useSelectorHeight(selector: string | undefined): number {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const element = selector ? document.querySelector(selector) : null;
    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(() => setHeight(element.getBoundingClientRect().height));
    observer.observe(element);
    return () => observer.disconnect();
  }, [selector]);
  return selector ? height : 0;
}

/**
 * Follows the height of an element that mounts and unmounts, such as the toolbar, through
 * the returned callback ref.
 */
export function useMeasuredHeight(): [(element: HTMLElement | null) => void, number] {
  const [height, setHeight] = useState(0);
  const observer = useRef<ResizeObserver | null>(null);
  const ref = useCallback((element: HTMLElement | null) => {
    observer.current?.disconnect();
    observer.current = null;
    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }
    observer.current = new ResizeObserver(() => setHeight(element.offsetHeight));
    observer.current.observe(element);
  }, []);
  return [ref, height];
}

/**
 * Measures the layout and the page around it. The layout counts as narrow from its own
 * width rather than the window's, so it also adapts inside a narrow region of a page.
 * `onMobileChange` runs when the layout crosses the breakpoint.
 */
export function useLayoutGeometry(
  rootRef: React.RefObject<HTMLElement | null>,
  {
    headerSelector,
    footerSelector,
    onMobileChange,
  }: { headerSelector?: string; footerSelector?: string; onMobileChange: (isMobile: boolean) => void }
): LayoutGeometry {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const wasMobile = useRef(false);

  useResizeObserver(rootRef, () => {
    const element = rootRef.current;
    if (!element) {
      return;
    }
    const width = element.clientWidth;
    const height = element.clientHeight;
    setSize(current => (current.width === width && current.height === height ? current : { width, height }));
    const isMobile = width > 0 && width < mobileBreakpoint;
    if (isMobile !== wasMobile.current) {
      wasMobile.current = isMobile;
      onMobileChange(isMobile);
    }
  });

  const viewportHeight = useSyncExternalStore(subscribeToViewport, getViewportHeight, getServerViewportHeight);

  return {
    ...size,
    isMobile: size.width > 0 && size.width < mobileBreakpoint,
    headerHeight: useSelectorHeight(headerSelector),
    footerHeight: useSelectorHeight(footerSelector),
    viewportHeight,
  };
}

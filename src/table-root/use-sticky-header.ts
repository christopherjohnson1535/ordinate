// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef } from 'react';

function findScrollParent(element: Element | null): Element | null {
  for (let current = element; current && current !== document.documentElement; current = current.parentElement) {
    const { overflowY } = window.getComputedStyle(current);
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
      return current;
    }
  }
  return null;
}

/**
 * Returns the ref for the table's scrolling wrapper, and keeps the table head in view by moving it
 * down while the table scrolls past the top of its scrolling area. CSS `position: sticky` cannot do
 * this here: the wrapper that lets the table scroll sideways is itself a scroll container, so a
 * sticky head would stick to the wrapper and never to the page.
 */
export function useStickyHeader(enabled: boolean, verticalOffset: number, stuckClassName: string) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const table = wrapper?.querySelector<HTMLTableElement>(':scope > table');
    const head = table?.tHead;
    if (!enabled || !wrapper || !table || !head) {
      return;
    }
    const scrollParent = findScrollParent(wrapper.parentElement);

    const update = () => {
      const areaTop = scrollParent ? scrollParent.getBoundingClientRect().top + scrollParent.clientTop : 0;
      const tableRect = table.getBoundingClientRect();
      // A caption sits above the head inside the table, so the head starts lower than the table does.
      const headTop = tableRect.top + head.offsetTop;
      const travel = Math.max(tableRect.height - head.offsetTop - head.offsetHeight, 0);
      const offset = Math.min(Math.max(areaTop + verticalOffset - headTop, 0), travel);
      head.style.transform = offset > 0 ? `translateY(${offset}px)` : '';
      head.classList.toggle(stuckClassName, offset > 0);
    };

    update();
    // Scroll events do not bubble, so listening in the capture phase catches every scrolling ancestor.
    document.addEventListener('scroll', update, { capture: true, passive: true });
    window.addEventListener('resize', update);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(table);
    return () => {
      document.removeEventListener('scroll', update, { capture: true });
      window.removeEventListener('resize', update);
      observer?.disconnect();
      head.style.transform = '';
      head.classList.remove(stuckClassName);
    };
  }, [enabled, verticalOffset, stuckClassName]);

  return wrapperRef;
}

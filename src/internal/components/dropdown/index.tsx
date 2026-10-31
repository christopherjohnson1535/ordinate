// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

// Layout effects do nothing on the server, and React 18 warns when they are used there.
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// Keeps the popup clear of the viewport edge when its height is limited by the available space.
const viewportMargin = 8;

export interface DropdownProps {
  /**
   * Whether the popup is shown.
   */
  open: boolean;
  /**
   * The element that opens the popup. The popup is positioned against it.
   */
  trigger: React.ReactNode;
  /**
   * Content fixed above the scrolling content, such as a filter input.
   */
  header?: React.ReactNode;
  /**
   * Content fixed below the scrolling content, such as a loading status.
   */
  footer?: React.ReactNode;
  /**
   * The scrolling content of the popup.
   */
  children?: React.ReactNode;
  /**
   * Called when the user presses the mouse outside the trigger and the popup.
   */
  onOutsideClick?: () => void;
  /**
   * Called when the scrolling content scrolls.
   */
  onContentScroll?: (element: HTMLElement) => void;
  className?: string;
}

interface Placement {
  above: boolean;
  availableBlockSize?: number;
}

/**
 * A popup positioned under its trigger, at least as wide as the trigger. It
 * opens above the trigger when there is not enough room below and more room
 * above. It holds no state of its own: the host decides when it is open.
 */
export function Dropdown({
  open,
  trigger,
  header,
  footer,
  children,
  onOutsideClick,
  onContentScroll,
  className,
}: DropdownProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<Placement>({ above: false });

  useBrowserLayoutEffect(() => {
    if (!open) {
      return;
    }
    const place = () => {
      const root = rootRef.current;
      const popup = popupRef.current;
      if (!root || !popup) {
        return;
      }
      const rect = root.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - viewportMargin;
      const spaceAbove = rect.top - viewportMargin;
      const above = popup.offsetHeight > spaceBelow && spaceAbove > spaceBelow;
      const availableBlockSize = Math.max(above ? spaceAbove : spaceBelow, 0);
      setPlacement(current =>
        current.above === above && current.availableBlockSize === availableBlockSize
          ? current
          : { above, availableBlockSize }
      );
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    // The popup grows and shrinks as options load or are filtered.
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(place);
    if (popupRef.current) {
      observer?.observe(popupRef.current);
    }
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      observer?.disconnect();
    };
  }, [open]);

  useEffect(() => {
    if (!open || !onOutsideClick) {
      return;
    }
    const handleMouseDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onOutsideClick();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open, onOutsideClick]);

  const popupStyle =
    placement.availableBlockSize === undefined
      ? undefined
      : ({ '--dropdown-available-block-size': `${placement.availableBlockSize}px` } as React.CSSProperties);

  return (
    <div ref={rootRef} className={clsx(styles.root, className)}>
      {trigger}
      {open && (
        <div
          ref={popupRef}
          className={clsx(styles.popup, placement.above && styles['popup-above'])}
          style={popupStyle}
          onMouseDown={event => {
            // Clicking the popup's own surface would otherwise move focus to the page and close it.
            if (!(event.target as Element).closest('input, button, textarea, a[href]')) {
              event.preventDefault();
            }
          }}
        >
          {header && <div className={styles.header}>{header}</div>}
          <div
            className={styles.content}
            onScroll={onContentScroll ? event => onContentScroll(event.currentTarget) : undefined}
          >
            {children}
          </div>
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      )}
    </div>
  );
}

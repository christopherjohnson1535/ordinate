// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { getIsRtl } from '../../direction';

import styles from './styles.css.js';

// Layout effects do nothing on the server, and React 18 warns when they are used there.
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// Keeps the popup clear of the viewport edge when its height is limited by the available space.
const viewportMargin = 8;

/**
 * Named popup widths, taken from the panel size tokens.
 */
export type DropdownWidth = 'small' | 'medium' | 'large';

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
  /**
   * The narrowest the popup gets. `trigger` matches the trigger's width.
   */
  minWidth?: 'trigger' | DropdownWidth;
  /**
   * Lets the popup grow with its content up to this width, or up to the viewport width with
   * `none`. When it is not set, content wraps at the popup's minimum width.
   */
  maxWidth?: DropdownWidth | 'none';
  /**
   * The role of the popup, such as `dialog` or `menu`.
   */
  ariaRole?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  className?: string;
}

interface Placement {
  above: boolean;
  alignEnd: boolean;
  availableBlockSize?: number;
}

// Aligns the popup to the trigger's end edge when that keeps it inside the viewport and the start edge does not.
function shouldAlignEnd(root: HTMLElement, popupWidth: number): boolean {
  const rect = root.getBoundingClientRect();
  const maxRight = document.documentElement.clientWidth - viewportMargin;
  const fits = (left: number) => left >= viewportMargin && left + popupWidth <= maxRight;
  const startLeft = getIsRtl(root) ? rect.right - popupWidth : rect.left;
  const endLeft = getIsRtl(root) ? rect.left : rect.right - popupWidth;
  return !fits(startLeft) && fits(endLeft);
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
  minWidth = 'trigger',
  maxWidth,
  ariaRole,
  ariaLabel,
  ariaLabelledby,
  className,
}: DropdownProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<Placement>({ above: false, alignEnd: false });

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
      const alignEnd = shouldAlignEnd(root, popup.offsetWidth);
      setPlacement(current =>
        current.above === above && current.alignEnd === alignEnd && current.availableBlockSize === availableBlockSize
          ? current
          : { above, alignEnd, availableBlockSize }
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
          className={clsx(
            styles.popup,
            placement.above && styles['popup-above'],
            placement.alignEnd && styles['popup-align-end'],
            styles[`min-width-${minWidth}`],
            maxWidth && styles['fit-content'],
            maxWidth && styles[`max-width-${maxWidth}`]
          )}
          style={popupStyle}
          role={ariaRole}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
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

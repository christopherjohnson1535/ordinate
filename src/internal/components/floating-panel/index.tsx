// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import { FloatingSide } from './position';
import { useFloatingPosition } from './use-floating-position';

import styles from './styles.css.js';

export type { FloatingSide, PhysicalSide } from './position';
export { computeFloatingPosition, toPhysicalSide } from './position';
export { useFloatingPosition } from './use-floating-position';

export interface FloatingPanelProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'> {
  /**
   * The element the panel points at.
   */
  trigger: React.RefObject<Element | null>;
  /**
   * Where to place the panel when there is room. `right` and `left` follow the reading
   * direction, so `right` is on the left in right-to-left layout.
   */
  preferredSide: FloatingSide;
  /**
   * `sheet` is a plate, for interactive content such as a popover. A leader runs from a dot at the
   * trigger to the plate's nearest edge.
   * `inverse` is an ink chip on a short stem, for short labels such as a tooltip.
   */
  variant?: 'sheet' | 'inverse';
  /**
   * Renders the panel at the end of `document.body`, outside any container that clips it
   * or stacks above it. Only mount a portal panel after hydration, for example on a click.
   */
  renderWithPortal?: boolean;
  /**
   * Space in pixels between the end of the leader and the trigger.
   */
  gap?: number;
}

/**
 * A panel that floats next to a trigger, tied to it by a leader. It flips to the opposite side
 * when the preferred side has no room and stays inside the viewport. The leader follows the side
 * the panel ends up on and is drawing only, hidden from screen readers.
 *
 * It only positions and frames its content. The component that owns it decides when it
 * is shown, what role it has and how it is dismissed. Keep it mounted with `hidden` when
 * other elements refer to it by ID, as a tooltip's trigger does.
 *
 * ```tsx
 * <FloatingPanel trigger={buttonRef} preferredSide="top" role="tooltip" id={id}>
 *   Copied
 * </FloatingPanel>
 * ```
 */
export const FloatingPanel = React.forwardRef(
  (
    {
      trigger,
      preferredSide,
      variant = 'sheet',
      renderWithPortal = false,
      gap = 2,
      hidden,
      className,
      children,
      ...rest
    }: FloatingPanelProps,
    ref: React.Ref<HTMLSpanElement>
  ) => {
    const panelRef = useRef<HTMLSpanElement | null>(null);
    const leaderRef = useRef<HTMLSpanElement>(null);
    const { physicalSide, panelStyle, leaderStyle } = useFloatingPosition({
      open: !hidden,
      trigger,
      panel: panelRef,
      leader: leaderRef,
      preferredSide,
      gap,
    });

    const setRefs = useCallback(
      (element: HTMLSpanElement | null) => {
        panelRef.current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          (ref as React.RefObject<HTMLSpanElement | null>).current = element;
        }
      },
      [ref]
    );

    const panel = (
      <span
        {...rest}
        ref={setRefs}
        hidden={hidden}
        className={clsx(styles.panel, styles[`variant-${variant}`], styles[`side-${physicalSide}`], className)}
        style={panelStyle}
      >
        {children}
        <span
          ref={leaderRef}
          className={clsx(styles.leader, styles[`leader-${physicalSide}`])}
          style={leaderStyle}
          aria-hidden="true"
        >
          {variant === 'sheet' && <span className={styles.dot} />}
        </span>
      </span>
    );

    return renderWithPortal && typeof document !== 'undefined' ? createPortal(panel, document.body) : panel;
  }
);

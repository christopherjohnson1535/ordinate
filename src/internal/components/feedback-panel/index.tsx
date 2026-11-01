// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { FloatingPanel, FloatingSide } from '../floating-panel';

import styles from './styles.css.js';

export type { Feedback, FeedbackControls } from './use-feedback';
export { feedbackDuration, useFeedback } from './use-feedback';

export interface FeedbackPanelProps {
  /**
   * The control the feedback is about.
   */
  trigger: React.RefObject<Element | null>;
  /**
   * The message. `null` keeps the panel empty and transparent, in the page as a live region,
   * until the message is known.
   */
  children: React.ReactNode | null;
  preferredSide?: FloatingSide;
  /**
   * Renders the panel at the end of `document.body`, outside containers that clip it.
   */
  renderWithPortal?: boolean;
  className?: string;
}

/**
 * A short status message in an ink panel next to a control, such as "Copied". Pair it with
 * `useFeedback`, and mount it with the feedback's `key` when the user acts.
 *
 * The panel is a polite live region. `useFeedback` mounts it empty and fills it in a later
 * render, because screen readers only announce changes to a live region already in the page.
 */
export function FeedbackPanel({
  trigger,
  children,
  preferredSide = 'top',
  renderWithPortal = false,
  className,
}: FeedbackPanelProps) {
  const filled = children !== null && children !== undefined;

  return (
    <FloatingPanel
      trigger={trigger}
      preferredSide={preferredSide}
      variant="inverse"
      role="status"
      renderWithPortal={renderWithPortal}
      className={clsx(styles.panel, !filled && styles.empty, className)}
    >
      {children}
    </FloatingPanel>
  );
}

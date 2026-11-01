// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { isPlainLeftClick } from '../../link-click';

import styles from './styles.css.js';

export interface StretchedLinkProps {
  href: string;
  children: React.ReactNode;
  /**
   * Called for a plain left click only. Clicks with a modifier key open the link elsewhere and are
   * left to the browser.
   */
  onFollow?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

/**
 * A link whose click area covers its nearest positioned ancestor, so a whole card or row follows the
 * link while the link stays the only interactive element in it. The ancestor sets
 * `position: relative`. A part that may hold links or buttons of its own, such as the byline, takes
 * `raiseInteractiveClassName` so those stay clickable above the card's link.
 */
export function StretchedLink({ href, children, onFollow, className }: StretchedLinkProps) {
  return (
    <a
      className={clsx(styles.link, className)}
      href={href}
      onClick={event => {
        if (isPlainLeftClick(event)) {
          onFollow?.(event);
        }
      }}
    >
      {children}
    </a>
  );
}

export const raiseInteractiveClassName = styles['raise-interactive'];

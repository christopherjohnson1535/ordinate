// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { InternalSpinner } from '../spinner/internal';
import { StatusIndicatorProps } from './interfaces';

import styles from './styles.css.js';

// Each state's mark color. Running and loading read as information; waiting, stopped and queued are quiet.
const stateTone: Record<StatusIndicatorProps.State, StatusIndicatorProps.Tone> = {
  complete: 'complete',
  caution: 'caution',
  fault: 'fault',
  note: 'note',
  underway: 'note',
  loading: 'note',
  waiting: 'neutral',
  halted: 'neutral',
  queued: 'neutral',
};

export interface InternalStatusIndicatorProps extends StatusIndicatorProps {
  /**
   * Lets other components position the status indicator. Not part of the public API.
   */
  className?: string;
}

/**
 * A state shown as a colored mark followed by text in ink. Only the mark carries color, so the words read
 * the same in every state and the mark's shape tells the states apart without color.
 */
export function InternalStatusIndicator({
  state = 'complete',
  children,
  iconAriaLabel,
  tone,
  wrapText = true,
  className,
  ...rest
}: InternalStatusIndicatorProps) {
  return (
    <span {...rest} className={clsx(styles.root, !wrapText && styles['no-wrap'], className)}>
      <span
        className={clsx(styles.icon, styles[`tone-${tone ?? stateTone[state]}`])}
        role={iconAriaLabel ? 'img' : undefined}
        aria-label={iconAriaLabel}
        aria-hidden={iconAriaLabel ? undefined : 'true'}
      >
        {state === 'loading' ? <InternalSpinner /> : <InternalIcon name={state} />}
      </span>
      <span className={styles.text}>{children}</span>
    </span>
  );
}

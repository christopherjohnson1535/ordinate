// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { IconProps } from '../icon/interfaces';
import { InternalIcon } from '../icon/internal';
import { InternalSpinner } from '../spinner/internal';
import { StatusIndicatorProps } from './interfaces';

import styles from './styles.css.js';

const typeToIcon: Record<Exclude<StatusIndicatorProps.Type, 'loading'>, IconProps.Name> = {
  error: 'status-negative',
  warning: 'status-warning',
  success: 'status-positive',
  info: 'status-info',
  stopped: 'status-stopped',
  pending: 'status-pending',
  'in-progress': 'status-in-progress',
};

export interface InternalStatusIndicatorProps extends StatusIndicatorProps {
  /**
   * Lets other components position the status indicator. Not part of the public API.
   */
  className?: string;
}

export function InternalStatusIndicator({
  type = 'success',
  children,
  iconAriaLabel,
  colorOverride,
  wrapText = true,
  className,
  ...rest
}: InternalStatusIndicatorProps) {
  return (
    <span
      {...rest}
      className={clsx(
        styles.root,
        styles[`type-${type}`],
        colorOverride && styles[`color-${colorOverride}`],
        !wrapText && styles['no-wrap'],
        className
      )}
    >
      <span
        className={styles.icon}
        role={iconAriaLabel ? 'img' : undefined}
        aria-label={iconAriaLabel}
        aria-hidden={iconAriaLabel ? undefined : 'true'}
      >
        {type === 'loading' ? <InternalSpinner /> : <InternalIcon name={typeToIcon[type]} />}
      </span>
      <span className={styles.text}>{children}</span>
    </span>
  );
}

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalSpinner } from '../../../spinner/internal';

import styles from './styles.css.js';

export interface LoadingStatusProps {
  text?: string;
  className?: string;
}

/**
 * A spinner with a short text, standing in for panel content that is still loading.
 * The text is a status message, so screen readers announce it when it appears.
 */
export function LoadingStatus({ text, className }: LoadingStatusProps) {
  return (
    <div role="status" className={clsx(styles.root, className)}>
      <InternalSpinner />
      {text && <span>{text}</span>}
    </div>
  );
}

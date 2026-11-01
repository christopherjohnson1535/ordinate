// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Button from '@ordinate-ui/components/button';
import StatusIndicator from '@ordinate-ui/components/status-indicator';
import clsx from 'clsx';

import { BaseChartProps } from '../../base';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../../events';

import styles from './styles.css.js';

export interface ChartFrameProps {
  baseProps: BaseChartProps;
  /** The chart's own root class, which its test-utils wrapper finds it by. */
  className: string;
  filter?: React.ReactNode;
  legend?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * The parts every chart is laid out in: the series filter, the plot or its status, and the legend.
 */
export function ChartFrame({ baseProps, className, filter, legend, children }: ChartFrameProps) {
  return (
    <div {...baseProps} className={clsx(styles.root, className)}>
      {filter && <div className={styles.filter}>{filter}</div>}
      <div className={styles.content}>{children}</div>
      {legend}
    </div>
  );
}

export type ChartStatusKind = 'loading' | 'error' | 'empty' | 'no-match';

export interface ChartStatusProps {
  kind: ChartStatusKind;
  /** The plot height the status stands in for, so the layout does not jump. */
  height: number;
  /** Draws the two axis rules around the status, for charts that have axes. */
  withAxes?: boolean;
  loadingText?: string;
  errorText?: string;
  recoveryText?: string;
  onRecoveryClick?: NonCancelableEventHandler;
  empty?: React.ReactNode;
  noMatch?: React.ReactNode;
}

/**
 * What a chart shows in place of its plot while loading, after an error, without data, or when
 * the filter hides every series.
 */
export function ChartStatus({
  kind,
  height,
  withAxes = false,
  loadingText,
  errorText,
  recoveryText,
  onRecoveryClick,
  empty,
  noMatch,
}: ChartStatusProps) {
  const content = (() => {
    switch (kind) {
      case 'loading':
        return <StatusIndicator type="loading">{loadingText}</StatusIndicator>;
      case 'error':
        return (
          <span className={styles['error-content']}>
            <StatusIndicator type="error">{errorText}</StatusIndicator>
            {recoveryText && (
              <Button variant="link" formAction="none" onClick={() => fireNonCancelableEvent(onRecoveryClick, null)}>
                {recoveryText}
              </Button>
            )}
          </span>
        );
      case 'empty':
        return empty;
      case 'no-match':
        return noMatch;
    }
  })();
  return (
    <div
      className={clsx(styles.status, withAxes && styles['status-axes'], styles[`status-${kind}`])}
      style={{ minBlockSize: height }}
      aria-live="polite"
    >
      <div className={styles['status-content']}>{content}</div>
    </div>
  );
}

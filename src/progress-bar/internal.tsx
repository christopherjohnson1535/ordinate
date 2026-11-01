// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalLiveRegion } from '../live-region/internal';
import { InternalStatusIndicator } from '../status-indicator/internal';
import { ProgressBarProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalProgressBarProps extends ProgressBarProps {
  /**
   * Lets other components position the progress bar. Not part of the public API.
   */
  className?: string;
}

function clamp(value: number) {
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

export function InternalProgressBar({
  value = 0,
  label,
  description,
  additionalInfo,
  status = 'in-progress',
  resultText,
  resultButtonText,
  onResultButtonClick,
  variant = 'standalone',
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  className,
  ...rest
}: InternalProgressBarProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const additionalInfoId = `${id}-additional-info`;

  const percent = Math.round(clamp(value));
  // A flash announces its own content when it changes, so a second live region would read the result twice.
  const ResultRegion = variant === 'flash' ? React.Fragment : InternalLiveRegion;
  const describedBy = [description && descriptionId, additionalInfo && additionalInfoId, ariaDescribedby]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...rest} className={clsx(styles.root, styles[`variant-${variant}`], className)}>
      {label && (
        <div id={labelId} className={styles.label}>
          {label}
        </div>
      )}
      {description && (
        <div id={descriptionId} className={styles.description}>
          {description}
        </div>
      )}
      {status === 'in-progress' ? (
        <div className={styles.progress}>
          <div
            className={styles.track}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby ?? (label && !ariaLabel ? labelId : undefined)}
            aria-describedby={describedBy || undefined}
          >
            <div className={styles.fill} style={{ inlineSize: `${percent}%` }} />
          </div>
          {/* The progress bar already reports its value, so the printed figure is for sighted users only. */}
          <span className={styles.percentage} aria-hidden="true">
            {percent}%
          </span>
        </div>
      ) : (
        <ResultRegion>
          <div className={styles.result}>
            <InternalStatusIndicator type={status}>
              <span className={styles['result-text']}>{resultText}</span>
            </InternalStatusIndicator>
            {resultButtonText && (
              <InternalButton
                className={styles['result-button']}
                formAction="none"
                onClick={() => fireNonCancelableEvent(onResultButtonClick, null)}
              >
                {resultButtonText}
              </InternalButton>
            )}
          </div>
        </ResultRegion>
      )}
      {additionalInfo && (
        <div id={additionalInfoId} className={styles['additional-info']}>
          {additionalInfo}
        </div>
      )}
    </div>
  );
}

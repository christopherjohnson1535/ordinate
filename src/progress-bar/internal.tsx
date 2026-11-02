// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { InternalLiveRegion } from '../live-region/internal';
import { InternalStatusIndicator } from '../status-indicator/internal';
import { ProgressBarProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalProgressBarProps extends Omit<ProgressBarProps, 'status'> {
  status?: ProgressBarProps.Status;
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
  status = 'underway',
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
  // The words for the result come from Alert's messages, which name the same states.
  const i18n = useInternalI18n('alert');
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const additionalInfoId = `${id}-additional-info`;

  const underway = status === 'underway';
  const percent = Math.round(clamp(value));
  // A finished operation fills the line; one that failed keeps the ink where it stopped.
  const filled = status === 'complete' ? 100 : percent;
  // A flash announces its own content when it changes, so a second live region would read the result twice.
  const ResultRegion = variant === 'flash' ? React.Fragment : InternalLiveRegion;
  const describedBy = [description && descriptionId, additionalInfo && additionalInfoId, ariaDescribedby]
    .filter(Boolean)
    .join(' ');

  const barProps = underway
    ? {
        role: 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': percent,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby ?? (label && !ariaLabel ? labelId : undefined),
        'aria-describedby': describedBy || undefined,
      }
    : { 'aria-hidden': true };

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
      {underway && (
        // The progress bar already reports its value, so the printed measure is for sighted users only.
        <span className={clsx(styles.measure, styles.percentage)} aria-hidden="true">
          {percent}%
        </span>
      )}
      <div {...barProps} className={clsx(styles.bar, underway && styles.track)}>
        <span className={styles.base} />
        <span className={styles.fill} style={{ inlineSize: `${filled}%` }} />
        {status === 'fault' && <span className={styles.stop} style={{ insetInlineStart: `${filled}%` }} />}
      </div>
      {!underway && (
        <ResultRegion>
          <InternalStatusIndicator className={clsx(styles.measure, styles.status)} state={status}>
            {i18n(`${status}Label`)}
          </InternalStatusIndicator>
          {(resultText || resultButtonText) && (
            <div className={styles.result}>
              {resultText && <span className={styles['result-text']}>{resultText}</span>}
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
          )}
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

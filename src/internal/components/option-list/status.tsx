// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { InternalButton } from '../../../button/internal';
import { InternalIcon } from '../../../icon/internal';
import { StatusType } from './interfaces';

import styles from './styles.css.js';

// Loads the next page a little before the user reaches the very end of the list.
const loadMoreThreshold = 16;

export interface DropdownStatusProps {
  statusType: StatusType;
  loadingText?: string;
  finishedText?: string;
  errorText?: string;
  recoveryText?: string;
  errorIconAriaLabel?: string;
  empty?: React.ReactNode;
  noMatch?: React.ReactNode;
  /**
   * Whether the list shows no options.
   */
  isEmpty: boolean;
  /**
   * Whether the list shows no options because of the filter text, so `noMatch` applies instead of `empty`.
   */
  isNoMatch: boolean;
  onRecoveryClick(): void;
}

function getStatusContent({
  statusType,
  loadingText,
  finishedText,
  errorText,
  recoveryText,
  errorIconAriaLabel,
  empty,
  noMatch,
  isEmpty,
  isNoMatch,
  onRecoveryClick,
}: DropdownStatusProps): React.ReactNode {
  if (statusType === 'loading') {
    return (
      <span className={styles['status-loading']}>
        <InternalIcon name="underway" className={styles['status-spinner']} />
        <span>{loadingText}</span>
      </span>
    );
  }
  if (statusType === 'error') {
    return (
      <span className={styles['status-error']}>
        <InternalIcon name="fault" variant="error" ariaLabel={errorIconAriaLabel} />
        <span>{errorText}</span>
        {recoveryText && (
          <InternalButton className={styles.recovery} variant="link" formAction="none" onClick={onRecoveryClick}>
            {recoveryText}
          </InternalButton>
        )}
      </span>
    );
  }
  if (isEmpty) {
    return isNoMatch ? noMatch : empty;
  }
  return statusType === 'finished' ? finishedText : null;
}

/**
 * Returns the footer that reports loading, errors and empty results below the options, or undefined
 * when there is nothing to report, so the popup draws no empty footer.
 */
export function renderDropdownStatus(props: DropdownStatusProps): React.ReactNode {
  const content = getStatusContent(props);
  if (content === null || content === undefined || content === '') {
    return undefined;
  }
  return (
    <div className={styles.status} aria-live="polite">
      {content}
    </div>
  );
}

/**
 * Whether the list has been scrolled close enough to its end to load the next page.
 */
export function isScrolledToEnd(element: HTMLElement): boolean {
  return element.scrollTop + element.clientHeight >= element.scrollHeight - loadMoreThreshold;
}

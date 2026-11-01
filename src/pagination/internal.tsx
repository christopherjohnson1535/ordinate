// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { PaginationProps } from './interfaces';
import { getPageItems } from './utils';

import styles from './styles.css.js';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function InternalPagination({
  currentPageIndex,
  pagesCount,
  openEnd = false,
  disabled = false,
  ariaLabels,
  onChange,
  onNextPageClick,
  onPreviousPageClick,
  ...rest
}: PaginationProps) {
  const i18n = useInternalI18n('pagination');
  // An empty list still shows page 1, so the control keeps its shape while data loads.
  const count = Math.max(Math.floor(pagesCount), 1);
  const current = clamp(Math.floor(currentPageIndex), 1, count);

  const pageLabel = (pageNumber: number) =>
    i18n('pageLabel', ariaLabels?.pageLabel?.(pageNumber), {
      pageNumber,
      pagesCount: count,
      openEnd: openEnd ? 'true' : 'false',
    });

  const goTo = (pageIndex: number) => {
    if (pageIndex !== current) {
      fireNonCancelableEvent(onChange, { currentPageIndex: pageIndex });
    }
  };

  const previous = () => {
    const requestedPageIndex = current - 1;
    fireNonCancelableEvent(onPreviousPageClick, { requestedPageAvailable: true, requestedPageIndex });
    goTo(requestedPageIndex);
  };

  const next = () => {
    const requestedPageIndex = current + 1;
    const requestedPageAvailable = requestedPageIndex <= count;
    fireNonCancelableEvent(onNextPageClick, { requestedPageAvailable, requestedPageIndex });
    if (requestedPageAvailable) {
      goTo(requestedPageIndex);
    }
  };

  return (
    <ul
      {...rest}
      className={clsx(styles.root, disabled && styles['root-disabled'])}
      aria-label={i18n('paginationLabel', ariaLabels?.paginationLabel)}
    >
      <li className={styles.item}>
        <button
          type="button"
          className={clsx(styles.button, styles.arrow, styles['previous-page'])}
          aria-label={i18n('previousPageLabel', ariaLabels?.previousPageLabel)}
          disabled={disabled || current <= 1}
          onClick={previous}
        >
          <InternalIcon name="angle-left" />
        </button>
      </li>
      {getPageItems(current, count, openEnd).map(item =>
        typeof item === 'number' ? (
          <li key={item} className={styles.item}>
            <button
              type="button"
              className={clsx(styles.button, styles['page-number'], item === current && styles['current-page'])}
              aria-label={pageLabel(item)}
              aria-current={item === current ? 'true' : undefined}
              disabled={disabled}
              onClick={() => goTo(item)}
            >
              {item}
            </button>
          </li>
        ) : (
          <li key={item} className={clsx(styles.item, styles.ellipsis)} aria-hidden="true">
            <InternalIcon name="ellipsis" />
          </li>
        )
      )}
      <li className={styles.item}>
        <button
          type="button"
          className={clsx(styles.button, styles.arrow, styles['next-page'])}
          aria-label={i18n('nextPageLabel', ariaLabels?.nextPageLabel)}
          disabled={disabled || (!openEnd && current >= count)}
          onClick={next}
        >
          <InternalIcon name="angle-right" />
        </button>
      </li>
    </ul>
  );
}

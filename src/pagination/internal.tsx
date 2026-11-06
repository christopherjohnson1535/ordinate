// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { InternalIcon } from '../icon/internal';
import { SlidingMarker, useSlidingMarker } from '../internal/components/sliding-marker';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { PaginationProps } from './interfaces';
import { formatPageNumber, getPageItems } from './utils';

import styles from './styles.css.js';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * The lettered page number. The padding zero is drawn by the style sheet rather than written in the text, so
 * the button's text is the number itself, "2", which is part of its name, "Page 2 of 12", and voice control
 * can find the button by what it shows.
 */
function PageNumber({ pageNumber, count }: { pageNumber: number; count: number }) {
  const lettered = formatPageNumber(pageNumber, count);
  const padding = lettered.slice(0, lettered.length - String(pageNumber).length);
  return (
    <>
      {padding && <span className={styles.padding} data-padding={padding} />}
      {String(pageNumber)}
    </>
  );
}

export function InternalPagination({
  currentPageIndex,
  pagesCount,
  openEnd = false,
  disabled = false,
  showPageLabel = false,
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

  const rowRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLButtonElement>(null);
  // Crop marks stand at the corners of the current page and slide to the next one, as on the open tab.
  const marker = useSlidingMarker(rowRef, () => (currentRef.current ? [currentRef.current] : []));

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
    <div {...rest} className={clsx(styles.root, disabled && styles['root-disabled'])}>
      {showPageLabel && <span className={styles['page-label']}>{pageLabel(current)}</span>}
      <div ref={rowRef} className={styles.row}>
        <ul className={styles.list} aria-label={i18n('paginationLabel', ariaLabels?.paginationLabel)}>
          <li className={styles.item}>
            <InternalButton
              className={clsx(styles.arrow, styles['previous-page'])}
              variant="icon"
              iconName="chevron-left"
              formAction="none"
              ariaLabel={i18n('previousPageLabel', ariaLabels?.previousPageLabel)}
              disabled={disabled || current <= 1}
              onClick={previous}
            />
          </li>
          {getPageItems(current, count, openEnd).map(item =>
            typeof item === 'number' ? (
              <li key={item} className={styles.item}>
                <button
                  ref={item === current ? currentRef : undefined}
                  type="button"
                  className={clsx(styles.button, styles['page-number'], item === current && styles['current-page'])}
                  aria-label={pageLabel(item)}
                  aria-current={item === current ? 'true' : undefined}
                  disabled={disabled}
                  onClick={() => goTo(item)}
                >
                  <PageNumber pageNumber={item} count={count} />
                </button>
              </li>
            ) : (
              <li key={item} className={clsx(styles.item, styles.ellipsis)} aria-hidden="true">
                <InternalIcon name="more" />
              </li>
            )
          )}
          <li className={styles.item}>
            <InternalButton
              className={clsx(styles.arrow, styles['next-page'])}
              variant="icon"
              iconName="chevron-right"
              formAction="none"
              ariaLabel={i18n('nextPageLabel', ariaLabels?.nextPageLabel)}
              disabled={disabled || (!openEnd && current >= count)}
              onClick={next}
            />
          </li>
        </ul>
        <SlidingMarker position={marker.position} placed={marker.placed} className={styles.marker} />
      </div>
    </div>
  );
}

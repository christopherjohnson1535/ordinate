// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useId, useRef } from 'react';

import { InternalButton } from '../button/internal';
import { RuleEndMarks } from '../internal/components/construction';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { DialogProps } from './interfaces';

import styles from './styles.css.js';

/**
 * Focuses the element when it mounts and, when it unmounts with focus still inside,
 * gives focus back to whatever had it before. A ref callback runs on detach while the
 * element is still in the document, which an effect cleanup does not guarantee.
 */
function useFocusOnMount<E extends HTMLElement>() {
  const elementRef = useRef<E | null>(null);
  const previousRef = useRef<HTMLElement | null>(null);

  return useCallback((element: E | null) => {
    if (element) {
      const active = element.ownerDocument.activeElement;
      previousRef.current = active instanceof HTMLElement && !element.contains(active) ? active : null;
      elementRef.current = element;
      element.focus({ preventScroll: true });
      return;
    }
    const mounted = elementRef.current;
    if (mounted?.contains(mounted.ownerDocument.activeElement) && previousRef.current?.isConnected) {
      previousRef.current.focus({ preventScroll: true });
    }
    elementRef.current = null;
    previousRef.current = null;
  }, []);
}

export function InternalDialog({
  header,
  children,
  footer,
  onDismiss,
  dismissAriaLabel,
  ariaLabel,
  ...rest
}: DialogProps) {
  const i18n = useInternalI18n('dialog');
  const headingId = useId();
  const focusRef = useFocusOnMount<HTMLDivElement>();

  const dismiss = (reason: DialogProps.DismissReason) => fireNonCancelableEvent(onDismiss, { reason });

  const closeButton = (
    <InternalButton
      className={styles['close-button']}
      variant="icon"
      formAction="none"
      iconName="close"
      ariaLabel={i18n('dismissAriaLabel', dismissAriaLabel)}
      onClick={() => dismiss('closeButton')}
    />
  );

  return (
    <div
      {...rest}
      ref={focusRef}
      role="dialog"
      tabIndex={-1}
      className={styles.dialog}
      aria-labelledby={header ? headingId : undefined}
      aria-label={header ? undefined : ariaLabel}
      onKeyDown={event => {
        if (event.key === 'Escape') {
          // Closes only this dialog, not a modal or panel around it.
          event.preventDefault();
          event.stopPropagation();
          dismiss('keyboard');
        }
      }}
    >
      {header ? (
        <>
          <div className={styles.header}>
            <h2 id={headingId} className={styles.heading}>
              {header}
            </h2>
            {closeButton}
          </div>
          {children && <div className={styles.content}>{children}</div>}
        </>
      ) : (
        // Without a heading, the close button sits beside the content instead of on a row of its own.
        <div className={styles['content-row']}>
          <div className={styles.content}>{children}</div>
          {closeButton}
        </div>
      )}
      {footer && (
        <div className={styles.footer}>
          <RuleEndMarks />
          {footer}
        </div>
      )}
    </div>
  );
}

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { InternalIcon } from '../icon/internal';
import { ConstructionTopLine } from '../internal/components/construction';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { AlertProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalAlertProps extends Omit<AlertProps, 'type'> {
  type?: AlertProps.Type;
}

/**
 * A note drawn like a section: a construction line in the note's color opens it, the icon and the kind of
 * note sit in the margin, and the title, text and action follow in ink.
 */
export const InternalAlert = React.forwardRef(
  (
    {
      type = 'note',
      header,
      children,
      action,
      dismissible = false,
      onDismiss,
      dismissAriaLabel,
      statusIconAriaLabel,
      i18nStrings,
      ...rest
    }: InternalAlertProps,
    ref: React.Ref<AlertProps.Ref>
  ) => {
    const i18n = useInternalI18n('alert');
    const focusRef = useRef<HTMLDivElement>(null);
    const headerId = useId();
    const labelKey = `${type}Label` as const;
    const label = i18n(labelKey, i18nStrings?.[labelKey]);

    // The group only becomes focusable for the moment it is focused, so it never joins the tab order.
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (focusRef.current) {
          focusRef.current.tabIndex = -1;
          focusRef.current.focus();
        }
      },
    }));

    return (
      <div {...rest} className={clsx(styles.alert, styles[`type-${type}`])}>
        <ConstructionTopLine kind={type} />
        <div className={styles.layout}>
          <div
            ref={focusRef}
            className={styles.body}
            role="group"
            aria-labelledby={header ? headerId : undefined}
            onBlur={() => focusRef.current?.removeAttribute('tabindex')}
          >
            <div className={styles.side}>
              <span className={styles.icon}>
                <InternalIcon name={type} ariaLabel={statusIconAriaLabel} />
              </span>
              <span className={styles.label}>{label}</span>
            </div>
            <div className={styles.message}>
              {header && (
                <div id={headerId} className={styles.header}>
                  {header}
                </div>
              )}
              {children && <div className={styles.content}>{children}</div>}
              {action && <div className={styles['action-slot']}>{action}</div>}
            </div>
          </div>
          {dismissible && (
            <div className={styles.dismiss}>
              <InternalButton
                variant="icon"
                formAction="none"
                ariaLabel={i18n('dismissAriaLabel', dismissAriaLabel)}
                iconSvg={<InternalIcon name="close" />}
                onClick={() => fireNonCancelableEvent(onDismiss, null)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

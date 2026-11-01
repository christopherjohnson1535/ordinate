// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { IconProps } from '../icon/interfaces';
import { InternalIcon } from '../icon/internal';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { AlertProps } from './interfaces';

import styles from './styles.css.js';

const typeToIcon: Record<AlertProps.Type, IconProps.Name> = {
  info: 'status-info',
  success: 'status-positive',
  warning: 'status-warning',
  error: 'status-negative',
};

export const InternalAlert = React.forwardRef(
  (
    {
      type = 'info',
      header,
      children,
      action,
      dismissible = false,
      onDismiss,
      dismissAriaLabel,
      statusIconAriaLabel,
      ...rest
    }: AlertProps,
    ref: React.Ref<AlertProps.Ref>
  ) => {
    const i18n = useInternalI18n('alert');
    const focusRef = useRef<HTMLDivElement>(null);
    const headerId = useId();

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
        <div className={styles.layout}>
          <div
            ref={focusRef}
            className={styles.body}
            role="group"
            aria-labelledby={header ? headerId : undefined}
            onBlur={() => focusRef.current?.removeAttribute('tabindex')}
          >
            <span className={styles.icon}>
              <InternalIcon name={typeToIcon[type]} ariaLabel={statusIconAriaLabel} />
            </span>
            <div className={styles.message}>
              {header && (
                <div id={headerId} className={styles.header}>
                  {header}
                </div>
              )}
              {children && <div className={styles.content}>{children}</div>}
            </div>
          </div>
          {action && <div className={styles['action-slot']}>{action}</div>}
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

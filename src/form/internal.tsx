// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { InternalIcon } from '../icon/internal';
import { FormProps } from './interfaces';

import styles from './styles.css.js';

// The component does not render a <form> element, so consumers can nest it in their own
// <form> and control submission themselves.
export function InternalForm({
  children,
  header,
  errorText,
  errorIconAriaLabel,
  actions,
  secondaryActions,
  variant = 'full-page',
  ...rest
}: FormProps) {
  return (
    <div {...rest} className={styles.root} data-variant={variant}>
      {header && <div className={styles.header}>{header}</div>}
      {children && <div className={styles.content}>{children}</div>}
      <div role="alert" className={styles['error-region']}>
        {errorText && (
          <div className={styles.error}>
            <InternalIcon
              className={styles['error-icon']}
              name="status-negative"
              variant="error"
              ariaLabel={errorIconAriaLabel}
            />
            <div className={styles['error-text']}>{errorText}</div>
          </div>
        )}
      </div>
      {(actions || secondaryActions) && (
        <div className={styles.footer}>
          {secondaryActions && <div className={styles['secondary-actions']}>{secondaryActions}</div>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
    </div>
  );
}

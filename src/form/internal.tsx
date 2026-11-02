// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { ConstructionTopLine, RuleEndMarks } from '../internal/components/construction';
import { FormProps } from './interfaces';

import styles from './styles.css.js';

// The component does not render a <form> element, so consumers can nest it in their own
// <form> and control submission themselves.
//
// It is drawn like a section: a construction line in the kind's color opens it, the reference sits above the
// header, and the actions stand on a rule closed by hash marks.
export function InternalForm({
  kind = 'neutral',
  reference,
  children,
  header,
  errorText,
  errorIconAriaLabel,
  actions,
  secondaryActions,
  variant = 'full-page',
  ...rest
}: FormProps) {
  const hasReference = reference !== undefined && reference !== '';
  return (
    <div {...rest} className={clsx(styles.root, styles[`kind-${kind}`])} data-variant={variant}>
      <ConstructionTopLine kind={kind} />
      {(header || hasReference) && (
        <div className={styles['header-block']}>
          {hasReference && <span className={styles.reference}>{reference}</span>}
          {header && <div className={styles.header}>{header}</div>}
        </div>
      )}
      {children && <div className={styles.content}>{children}</div>}
      <div role="alert" className={styles['error-region']}>
        {errorText && (
          <div className={styles.error}>
            <InternalIcon
              className={styles['error-icon']}
              name="fault"
              variant="error"
              ariaLabel={errorIconAriaLabel}
            />
            <div className={styles['error-text']}>{errorText}</div>
          </div>
        )}
      </div>
      {(actions || secondaryActions) && (
        <div className={styles.footer}>
          <RuleEndMarks kind={kind} />
          {secondaryActions && <div className={styles['secondary-actions']}>{secondaryActions}</div>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
    </div>
  );
}

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { Band } from '../internal/components/band';
import { Heading } from '../internal/components/heading';
import { CallToActionProps } from './interfaces';

import styles from './styles.css.js';

export function InternalCallToAction({
  heading,
  description,
  actions,
  children,
  tone = 'inverted',
  headingLevel,
  ...rest
}: CallToActionProps) {
  const hasText = Boolean(heading || description);
  const hasActions = Boolean(actions || children);

  return (
    <Band
      {...rest}
      tag="section"
      tone={tone}
      spacing="small"
      className={clsx(styles.root, styles[`tone-${tone}`])}
      innerClassName={styles.frame}
    >
      <div className={styles.layout}>
        {hasText && (
          <div className={styles.text}>
            {heading && (
              <Heading level={headingLevel} defaultLevel={2} className={styles.heading}>
                {heading}
              </Heading>
            )}
            {description && <div className={styles.description}>{description}</div>}
          </div>
        )}
        {hasActions && (
          <div className={styles['action-area']}>
            {children && <div className={styles.content}>{children}</div>}
            {actions && <div className={styles.actions}>{actions}</div>}
          </div>
        )}
      </div>
    </Band>
  );
}

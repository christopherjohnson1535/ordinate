// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { Band } from '../internal/components/band';
import { Heading } from '../internal/components/heading';
import { SectionProps } from './interfaces';

import styles from './styles.css.js';

export function InternalSection({
  children,
  heading,
  description,
  headingLevel,
  actions,
  tone = 'default',
  width = 'default',
  spacing = 'default',
  rule = 'none',
  ...rest
}: SectionProps) {
  const hasHeader = Boolean(heading || description || actions);

  return (
    <Band
      {...rest}
      tag="section"
      tone={tone}
      width={width}
      spacing={spacing}
      className={clsx(styles.root, styles[`tone-${tone}`])}
    >
      {rule === 'double' && <div className={styles['double-rule']} aria-hidden="true" />}
      <div className={clsx(styles.body, rule !== 'none' && styles[`rule-${rule}`])}>
        {hasHeader && (
          <div className={styles.header}>
            {(heading || description) && (
              <div className={styles.titles}>
                {heading && (
                  <Heading level={headingLevel} defaultLevel={2} className={styles.heading}>
                    {heading}
                  </Heading>
                )}
                {description && <div className={styles.description}>{description}</div>}
              </div>
            )}
            {actions && <div className={styles.actions}>{actions}</div>}
          </div>
        )}
        {children && <div className={styles.content}>{children}</div>}
      </div>
    </Band>
  );
}

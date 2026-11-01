// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { HeaderProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalHeaderProps extends HeaderProps {
  /**
   * Lets other components position the header. Not part of the public API.
   */
  className?: string;
}

export function InternalHeader({
  variant = 'h2',
  headingTagOverride,
  description,
  actions,
  counter,
  info,
  code,
  className,
  children,
  ...rest
}: InternalHeaderProps) {
  const HeadingTag = headingTagOverride ?? variant;

  return (
    <div {...rest} className={clsx(styles.root, styles[`variant-${variant}`], className)}>
      <div className={styles.main}>
        <div className={styles['heading-group']}>
          {code && <div className={styles.code}>{code}</div>}
          <div className={styles.title}>
            <HeadingTag className={styles.heading}>
              <span className={styles['heading-text']}>{children}</span>
              {counter !== undefined && counter !== null && (
                <>
                  {' '}
                  <span className={styles.counter}>{counter}</span>
                </>
              )}
            </HeadingTag>
            {info && <span className={styles.info}>{info}</span>}
          </div>
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}

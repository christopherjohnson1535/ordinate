// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { Band } from '../internal/components/band';
import { Heading } from '../internal/components/heading';
import { SiteBrandMark } from '../internal/components/site-brand';
import { SiteLinkList } from '../internal/components/site-link-list';
import { useInternalI18n } from '../internal/i18n/context';
import { SiteFooterProps } from './interfaces';

import styles from './styles.css.js';

export function InternalSiteFooter({
  brand,
  columns = [],
  children,
  legal,
  tone = 'default',
  headingLevel,
  navigationAriaLabel,
  onFollow,
  ...rest
}: SiteFooterProps) {
  const i18n = useInternalI18n('site-footer');
  const hasAbout = Boolean(brand || children);

  return (
    <Band
      {...rest}
      tag="footer"
      tone={tone}
      spacing="small"
      className={clsx(styles.root, styles[`tone-${tone}`])}
      innerClassName={styles.frame}
    >
      {(hasAbout || columns.length > 0) && (
        <div className={styles.main}>
          {hasAbout && (
            <div className={styles.about}>
              {brand && <SiteBrandMark brand={brand} className={styles.brand} onFollow={onFollow} />}
              {children && <div className={styles.content}>{children}</div>}
            </div>
          )}
          {columns.length > 0 && (
            <nav className={styles.navigation} aria-label={i18n('navigationAriaLabel', navigationAriaLabel)}>
              {columns.map((column, index) => (
                <div key={`${index}-${column.title}`} className={styles.column}>
                  <Heading level={headingLevel} defaultLevel={2} className={styles['column-title']}>
                    {column.title}
                  </Heading>
                  <SiteLinkList
                    links={column.links}
                    className={styles['column-links']}
                    linkClassName={styles.link}
                    onFollow={onFollow}
                  />
                </div>
              ))}
            </nav>
          )}
        </div>
      )}
      {legal && <div className={styles.legal}>{legal}</div>}
    </Band>
  );
}

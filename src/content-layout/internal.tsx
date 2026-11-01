// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { ContentLayoutProps } from './interfaces';

import styles from './styles.css.js';

export function InternalContentLayout({
  header,
  breadcrumbs,
  notifications,
  headerVariant = 'default',
  maxContentWidth,
  disableOverlap = false,
  defaultPadding = false,
  children,
  ...rest
}: ContentLayoutProps) {
  const hasHeaderArea = Boolean(header || breadcrumbs || notifications);
  const highContrast = headerVariant === 'high-contrast' && hasHeaderArea;
  const style =
    maxContentWidth !== undefined
      ? ({ '--content-layout-max-width': `${maxContentWidth}px` } as React.CSSProperties)
      : undefined;

  return (
    <div
      {...rest}
      className={clsx(
        styles.root,
        headerVariant !== 'default' && styles[`header-variant-${headerVariant}`],
        highContrast && !disableOverlap && styles.overlap,
        (defaultPadding || highContrast) && styles.padded,
        // The band already keeps its content clear of the top edge.
        defaultPadding && !highContrast && styles['padded-top']
      )}
      style={style}
    >
      {highContrast && <div className={styles.band} />}
      {hasHeaderArea && (
        <div className={styles['header-area']}>
          {notifications && <div className={styles.notifications}>{notifications}</div>}
          {breadcrumbs && <div className={styles.breadcrumbs}>{breadcrumbs}</div>}
          {header && <div className={styles.header}>{header}</div>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

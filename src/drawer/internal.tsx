// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { LoadingStatus } from '../internal/components/loading-status';
import { useInternalI18n } from '../internal/i18n/context';
import { DrawerProps } from './interfaces';

import styles from './styles.css.js';

export function InternalDrawer({
  kind = 'neutral',
  reference,
  header,
  children,
  footer,
  loading = false,
  loadingText,
  disableContentPaddings = false,
  ...rest
}: DrawerProps) {
  const i18n = useInternalI18n('drawer');

  return (
    <div {...rest} className={clsx(styles.root, styles[`kind-${kind}`])} aria-busy={loading ? 'true' : undefined}>
      {(header || reference) && (
        <div className={styles['header-block']}>
          {reference && <span className={styles.reference}>{reference}</span>}
          {header && <h2 className={styles.header}>{header}</h2>}
        </div>
      )}
      {loading ? (
        <LoadingStatus className={styles.loading} text={i18n('loadingText', loadingText)} />
      ) : (
        <div className={clsx(styles.content, disableContentPaddings && styles['no-paddings'])}>{children}</div>
      )}
      {footer && !loading && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}

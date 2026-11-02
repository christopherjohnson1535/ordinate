// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { LoadingStatus } from '../internal/components/loading-status';
import { useInternalI18n } from '../internal/i18n/context';
import { InternalTextContent } from '../text-content/internal';
import { HelpPanelProps } from './interfaces';

import styles from './styles.css.js';

/**
 * Help drawn as a margin note: a faint construction line down the start edge, a mono caption above the
 * title, and the help text beside the line.
 */
export function InternalHelpPanel({ header, children, footer, loading = false, loadingText, ...rest }: HelpPanelProps) {
  const i18n = useInternalI18n('help-panel');

  if (loading) {
    return (
      <div {...rest} className={styles.root} aria-busy="true">
        <LoadingStatus className={styles.loading} text={i18n('loadingText', loadingText)} />
      </div>
    );
  }

  return (
    <div {...rest} className={styles.root}>
      {header && (
        <div className={styles['header-block']}>
          <span className={styles.caption}>{i18n('captionText')}</span>
          <h2 className={styles.header}>{header}</h2>
        </div>
      )}
      {children !== undefined && children !== null && (
        <InternalTextContent className={styles.content}>{children}</InternalTextContent>
      )}
      {footer && <InternalTextContent className={styles.footer}>{footer}</InternalTextContent>}
    </div>
  );
}

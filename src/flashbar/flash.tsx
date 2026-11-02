// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalAlert } from '../alert/internal';
import { InternalMessageDefinition } from './internal';

import styles from './styles.css.js';

interface FlashProps {
  item: InternalMessageDefinition;
  statusIconAriaLabel?: string;
  underwayLabel?: string;
  dismissLabel?: string;
  hidden: boolean;
}

/**
 * One notification, drawn as Alert's margin note. The margin, header and content are read to screen readers
 * when the note appears and again when its text changes, as when an operation that is underway completes.
 */
export function Flash({ item, statusIconAriaLabel, underwayLabel, dismissLabel, hidden }: FlashProps) {
  const loading = Boolean(item.loading);
  return (
    <li className={clsx(styles.flash, styles[`type-${item.type}`], loading && styles.underway)} hidden={hidden}>
      <InternalAlert
        className={styles.note}
        type={item.type}
        header={item.header}
        action={item.action}
        dismissible={item.dismissible}
        dismissAriaLabel={dismissLabel}
        onDismiss={item.onDismiss}
        statusIconAriaLabel={statusIconAriaLabel}
        loading={loading}
        caption={loading ? underwayLabel : undefined}
        announce={item.ariaRole === 'alert' ? 'assertive' : 'polite'}
      >
        {item.content}
      </InternalAlert>
    </li>
  );
}

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { Heading } from '../internal/components/heading';
import { LeaderRow } from '../internal/components/leader-row';
import { MenuTileProps } from './interfaces';

import styles from './styles.css.js';

export function InternalMenuTile({
  title,
  items = [],
  description,
  badge,
  tone = 'default',
  footer,
  headingLevel = 3,
  ...rest
}: MenuTileProps) {
  return (
    <div {...rest} className={clsx(styles.root, styles[`tone-${tone}`])}>
      <div className={styles.header}>
        <Heading level={headingLevel} defaultLevel={3} className={styles.title}>
          {title}
        </Heading>
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>
      {description && <div className={styles.description}>{description}</div>}
      {items.length > 0 && (
        <ul className={styles.items}>
          {items.map((item, index) => (
            <li key={index} className={styles.item}>
              <LeaderRow label={item.label} value={item.value} valueClassName={styles['item-value']} />
              {item.description && <span className={styles['item-description']}>{item.description}</span>}
            </li>
          ))}
        </ul>
      )}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}

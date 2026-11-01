// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { KeyValuePairsProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalKeyValuePairsProps extends KeyValuePairsProps {
  /**
   * Lets other components position the list. Not part of the public API.
   */
  className?: string;
}

function isGroup(item: KeyValuePairsProps.Item): item is KeyValuePairsProps.Group {
  return item.type === 'group';
}

function Pair({ pair }: { pair: KeyValuePairsProps.Pair }) {
  return (
    <div className={styles.pair}>
      <dt id={pair.id} className={styles.label}>
        <span className={styles['label-text']}>{pair.label}</span>
        {pair.info && <span className={styles.info}>{pair.info}</span>}
      </dt>
      <dd className={styles.value}>{pair.value}</dd>
    </div>
  );
}

// A group is one term (its title) whose description is a nested list of pairs, which keeps the markup a
// valid description list at every level.
function Group({ group }: { group: KeyValuePairsProps.Group }) {
  return (
    <div className={styles.group}>
      <dt className={styles['group-title']}>{group.title}</dt>
      <dd className={styles['group-content']}>
        <dl className={styles['group-list']}>
          {group.items.map((pair, index) => (
            <Pair key={index} pair={pair} />
          ))}
        </dl>
      </dd>
    </div>
  );
}

export function InternalKeyValuePairs({
  items,
  columns = 1,
  ariaLabel,
  ariaLabelledby,
  className,
  ...rest
}: InternalKeyValuePairsProps) {
  return (
    <div {...rest} className={clsx(styles.root, className)}>
      <dl
        className={clsx(styles.list, styles[`columns-${columns}`])}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
      >
        {items.map((item, index) =>
          isGroup(item) ? <Group key={index} group={item} /> : <Pair key={index} pair={item} />
        )}
      </dl>
    </div>
  );
}

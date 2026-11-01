// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getHiddenTokenCount, TokenList } from '../internal/components/token-list';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { TokenGroupProps } from './interfaces';

import styles from './styles.css.js';

export function InternalTokenGroup({
  items = [],
  onDismiss,
  alignment = 'horizontal',
  limit,
  readOnly = false,
  ariaLabel,
  i18nStrings,
  ...rest
}: TokenGroupProps) {
  const i18n = useInternalI18n('token-group');
  const hiddenCount = getHiddenTokenCount(items.length, limit);

  return (
    <div {...rest} className={styles.root}>
      <TokenList
        items={items.map(item => ({
          ...item,
          dismissLabel: i18n('dismissLabel', item.dismissLabel, { label: item.label }),
        }))}
        alignment={alignment}
        limit={limit}
        readOnly={readOnly}
        ariaLabel={ariaLabel}
        showMoreText={i18n('limitShowMore', i18nStrings?.limitShowMore, { count: hiddenCount })}
        showFewerText={i18n('limitShowFewer', i18nStrings?.limitShowFewer)}
        onDismiss={onDismiss ? itemIndex => fireNonCancelableEvent(onDismiss, { itemIndex }) : undefined}
      />
    </div>
  );
}

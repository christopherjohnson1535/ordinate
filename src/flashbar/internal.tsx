// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useState } from 'react';
import clsx from 'clsx';

import { useInternalI18n } from '../internal/i18n/context';
import { Flash } from './flash';
import { FlashbarProps } from './interfaces';
import { NotificationBar } from './notification-bar';

import styles from './styles.css.js';

type IconLabelKey = keyof Omit<FlashbarProps.I18nStrings, 'ariaLabel' | 'notificationBarText' | 'itemCountText'>;

const iconLabelKeys: Record<FlashbarProps.Type, IconLabelKey> = {
  success: 'successIconAriaLabel',
  error: 'errorIconAriaLabel',
  warning: 'warningIconAriaLabel',
  info: 'infoIconAriaLabel',
  'in-progress': 'inProgressIconAriaLabel',
};

const countKeys: Record<FlashbarProps.Type, string> = {
  success: 'successCount',
  error: 'errorCount',
  warning: 'warningCount',
  info: 'infoCount',
  'in-progress': 'inProgressCount',
};

// A collapsed stack draws at most this many sheet edges under the first item, however many it holds.
const maxStackEdges = 2;

export interface InternalFlashbarProps extends FlashbarProps {
  /**
   * Lets other components position the flashbar. Not part of the public API.
   */
  className?: string;
}

export function InternalFlashbar({
  items,
  stackItems = false,
  i18nStrings,
  className,
  ...rest
}: InternalFlashbarProps) {
  const i18n = useInternalI18n('flashbar');
  const [stackExpanded, setStackExpanded] = useState(false);
  const listId = useId();

  const isStacked = stackItems && items.length > 1;
  const isCollapsed = isStacked && !stackExpanded;

  const iconLabel = (item: FlashbarProps.MessageDefinition) => {
    const key = iconLabelKeys[item.type ?? 'info'];
    return item.statusIconAriaLabel ?? i18n(key, i18nStrings?.[key]);
  };

  const countText = (type: FlashbarProps.Type, count: number) =>
    i18nStrings?.itemCountText?.(type, count) ?? i18n(countKeys[type], undefined, { count });

  return (
    <div {...rest} className={clsx(styles.root, className)}>
      <ul id={listId} className={styles.list} aria-label={i18n('ariaLabel', i18nStrings?.ariaLabel)}>
        {items.map((item, index) => (
          <Flash
            key={item.id ?? index}
            item={item}
            hidden={isCollapsed && index > 0}
            statusIconAriaLabel={iconLabel(item)}
            dismissLabel={i18n('dismissLabel', item.dismissLabel)}
          />
        ))}
      </ul>
      {isCollapsed && (
        <div className={styles['stack-edges']} aria-hidden="true">
          {Array.from({ length: Math.min(items.length - 1, maxStackEdges) }, (_, index) => (
            <div key={index} className={styles['stack-edge']} />
          ))}
        </div>
      )}
      {isStacked && (
        <NotificationBar
          items={items}
          expanded={stackExpanded}
          controlsId={listId}
          text={i18n('notificationBarText', i18nStrings?.notificationBarText)}
          countText={countText}
          onToggle={() => setStackExpanded(!stackExpanded)}
        />
      )}
    </div>
  );
}

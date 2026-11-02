// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useState } from 'react';
import clsx from 'clsx';

import { useInternalI18n } from '../internal/i18n/context';
import { formatMessage, MessageParams } from '../internal/i18n/format';
import { Flash } from './flash';
import { FlashbarProps } from './interfaces';
import { NotificationBar } from './notification-bar';

import styles from './styles.css.js';

export interface InternalMessageDefinition extends Omit<FlashbarProps.MessageDefinition, 'type'> {
  type: FlashbarProps.Type;
}

type IconLabelKey = 'successIconAriaLabel' | 'errorIconAriaLabel' | 'warningIconAriaLabel' | 'infoIconAriaLabel';

const iconLabelKeys: Record<FlashbarProps.Type, IconLabelKey> = {
  complete: 'successIconAriaLabel',
  fault: 'errorIconAriaLabel',
  caution: 'warningIconAriaLabel',
  note: 'infoIconAriaLabel',
};

// English text for messages the shared message file does not hold yet. The provider's messages still win.
const fallbackMessages: Record<string, string> = {
  underwayLabel: 'Underway',
  showAllText: 'Show all {count}',
  showFewerText: 'Show fewer',
  faultCount: '{count, plural, one {# fault} other {# faults}}',
  cautionCount: '{count, plural, one {# caution} other {# cautions}}',
  completeCount: '{count, plural, other {# complete}}',
  noteCount: '{count, plural, one {# note} other {# notes}}',
  underwayCount: '{count, plural, other {# underway}}',
};

export interface InternalFlashbarProps extends Omit<FlashbarProps, 'items'> {
  items: ReadonlyArray<InternalMessageDefinition>;
  /**
   * Lets other components position the flashbar. Not part of the public API.
   */
  className?: string;
}

/**
 * A stack of Alert's margin notes. Collapsed, the first note stays and a summary row keys each type with a
 * count.
 */
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

  const message = (key: string, provided?: string, params?: MessageParams) =>
    i18n(key, provided, params) ?? formatMessage(fallbackMessages[key], params, 'en');

  const isStacked = stackItems && items.length > 1;
  const isCollapsed = isStacked && !stackExpanded;

  // Only a label set by the consumer is used. The margin already names the type, so a default would be read twice.
  const iconLabel = (item: InternalMessageDefinition) =>
    item.statusIconAriaLabel ??
    (item.loading ? i18nStrings?.inProgressIconAriaLabel : undefined) ??
    i18nStrings?.[iconLabelKeys[item.type]];

  const countText = (type: FlashbarProps.CountType, count: number) =>
    i18nStrings?.itemCountText?.(type, count) ?? message(`${type}Count`, undefined, { count });

  return (
    <div {...rest} className={clsx(styles.root, className)}>
      <ul id={listId} className={styles.list} aria-label={i18n('ariaLabel', i18nStrings?.ariaLabel)}>
        {items.map((item, index) => (
          <Flash
            key={item.id ?? index}
            item={item}
            hidden={isCollapsed && index > 0}
            statusIconAriaLabel={iconLabel(item)}
            underwayLabel={message('underwayLabel', i18nStrings?.underwayLabel)}
            dismissLabel={i18n('dismissLabel', item.dismissLabel)}
          />
        ))}
      </ul>
      {isStacked && (
        <NotificationBar
          items={items}
          expanded={stackExpanded}
          controlsId={listId}
          ariaLabel={i18n('notificationBarText', i18nStrings?.notificationBarText)}
          buttonText={
            stackExpanded
              ? message('showFewerText', i18nStrings?.showFewerText)
              : message('showAllText', i18nStrings?.showAllText?.(items.length), { count: items.length })
          }
          countText={countText}
          onToggle={() => setStackExpanded(!stackExpanded)}
        />
      )}
    </div>
  );
}

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { IconProps } from '../icon/interfaces';
import { InternalIcon } from '../icon/internal';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalLiveRegion } from '../live-region/internal';
import { InternalSpinner } from '../spinner/internal';
import { FlashbarProps } from './interfaces';

import styles from './styles.css.js';

export const typeIcons: Record<FlashbarProps.Type, IconProps.Name> = {
  success: 'status-positive',
  error: 'status-negative',
  warning: 'status-warning',
  info: 'status-info',
  'in-progress': 'status-in-progress',
};

interface FlashProps {
  item: FlashbarProps.MessageDefinition;
  /**
   * The item's place in the list, counted from 1, drawn in its margin marker.
   */
  position: number;
  statusIconAriaLabel?: string;
  dismissLabel?: string;
  hidden: boolean;
}

function StatusIcon({ type, loading, ariaLabel }: { type: FlashbarProps.Type; loading: boolean; ariaLabel?: string }) {
  if (!loading) {
    return <InternalIcon name={typeIcons[type]} ariaLabel={ariaLabel} />;
  }
  return (
    <span role={ariaLabel ? 'img' : undefined} aria-label={ariaLabel} aria-hidden={ariaLabel ? undefined : 'true'}>
      <InternalSpinner />
    </span>
  );
}

/**
 * One notification, drawn as a numbered note in the margin. The icon, header and content sit in a live
 * region, so the message is read when it appears and again when its text changes, as when an operation
 * in progress succeeds. The number only repeats the item's place in the list, so it is not read.
 */
export function Flash({ item, position, statusIconAriaLabel, dismissLabel, hidden }: FlashProps) {
  const type = item.type ?? 'info';

  return (
    <li className={clsx(styles.flash, styles[`type-${type}`])} hidden={hidden}>
      <span className={styles.marker} aria-hidden="true">
        <span className={styles['marker-number']}>{position}</span>
        <span className={styles['marker-leader']} />
      </span>
      <div className={styles.note}>
        <div className={styles['note-main']}>
          <InternalLiveRegion assertive={item.ariaRole === 'alert'}>
            <div className={styles.body}>
              <span className={styles['status-icon']}>
                <StatusIcon type={type} loading={Boolean(item.loading)} ariaLabel={statusIconAriaLabel} />
              </span>
              <div className={styles.message}>
                {item.header && <div className={styles.header}>{item.header}</div>}
                {item.content && <div className={styles.content}>{item.content}</div>}
              </div>
            </div>
          </InternalLiveRegion>
          {item.action && <div className={styles['action-slot']}>{item.action}</div>}
        </div>
        {item.dismissible && (
          <div className={styles.dismiss}>
            <InternalButton
              variant="icon"
              formAction="none"
              ariaLabel={dismissLabel}
              iconSvg={<InternalIcon name="close" />}
              onClick={() => fireNonCancelableEvent(item.onDismiss, null)}
            />
          </div>
        )}
      </div>
    </li>
  );
}

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useRef, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../../../button/interfaces';
import { InternalButton } from '../../../button/internal';
import { IconProps } from '../../../icon/interfaces';
import { InternalIcon } from '../../../icon/internal';

import styles from './styles.css.js';

export interface TokenListItem {
  label: string;
  labelTag?: string;
  description?: string;
  iconName?: IconProps.Name;
  iconAriaLabel?: string;
  lang?: string;
  disabled?: boolean;
  /**
   * Accessible name of the token's dismiss button, such as "Remove US East".
   */
  dismissLabel?: string;
}

export interface TokenListProps {
  items: ReadonlyArray<TokenListItem>;
  /**
   * Called when the user dismisses a token. Without it, tokens have no dismiss button.
   */
  onDismiss?(index: number): void;
  /**
   * Shows only this many tokens, with a button to show the rest.
   */
  limit?: number;
  /**
   * Text of the button that shows the hidden tokens. Say how many are hidden, see `getHiddenTokenCount`.
   */
  showMoreText?: string;
  showFewerText?: string;
  /**
   * Dims every token and removes the dismiss buttons.
   */
  disabled?: boolean;
  /**
   * Called after the last token is dismissed while focus was on it, so the host can move focus somewhere useful.
   */
  onEmptied?(): void;
  ariaLabel?: string;
  className?: string;
}

export function getHiddenTokenCount(count: number, limit: number | undefined): number {
  return limit !== undefined && limit >= 0 ? Math.max(count - limit, 0) : 0;
}

/**
 * A wrapping row of tokens, each with an optional dismiss button. Dismissing a focused token moves focus
 * to the next token's button, so focus is not lost with the removed one.
 */
export function TokenList({
  items,
  onDismiss,
  limit,
  showMoreText,
  showFewerText,
  disabled = false,
  onEmptied,
  ariaLabel,
  className,
}: TokenListProps) {
  const listId = useId();
  const [expanded, setExpanded] = useState(false);
  const buttonRefs = useRef<(ButtonProps.Ref | null)[]>([]);
  const listRef = useRef<HTMLUListElement>(null);
  const pendingFocus = useRef<number | null>(null);

  const limited = getHiddenTokenCount(items.length, limit) > 0;
  const visible = limited && !expanded ? items.slice(0, limit) : items;
  const dismissible = Boolean(onDismiss) && !disabled;

  useEffect(() => {
    const index = pendingFocus.current;
    if (index === null) {
      return;
    }
    pendingFocus.current = null;
    if (visible.length === 0) {
      onEmptied?.();
      return;
    }
    buttonRefs.current[Math.min(index, visible.length - 1)]?.focus();
  });

  if (items.length === 0) {
    return null;
  }

  const dismiss = (index: number) => {
    // Only take focus back if the removed button had it, so a pointer user's focus is left where it was.
    if (listRef.current?.contains(document.activeElement)) {
      pendingFocus.current = index;
    }
    onDismiss?.(index);
  };

  return (
    <div className={clsx(styles.root, className)}>
      <ul ref={listRef} id={listId} className={styles.list} aria-label={ariaLabel}>
        {visible.map((item, index) => {
          const itemDisabled = disabled || Boolean(item.disabled);
          return (
            <li key={`${index}-${item.label}`} className={clsx(styles.token, itemDisabled && styles.disabled)}>
              <span className={styles.content}>
                <span className={styles.main}>
                  {item.iconName && (
                    <InternalIcon
                      className={styles.icon}
                      name={item.iconName}
                      ariaLabel={item.iconAriaLabel}
                      variant={itemDisabled ? 'disabled' : 'normal'}
                    />
                  )}
                  <span className={styles.label} lang={item.lang}>
                    {item.label}
                  </span>
                  {item.labelTag && <span className={styles['label-tag']}>{item.labelTag}</span>}
                </span>
                {item.description && <span className={styles.description}>{item.description}</span>}
              </span>
              {dismissible && !item.disabled && (
                <InternalButton
                  ref={button => {
                    buttonRefs.current[index] = button;
                  }}
                  className={styles['dismiss-button']}
                  variant="icon"
                  iconName="close"
                  formAction="none"
                  ariaLabel={item.dismissLabel}
                  onClick={() => dismiss(index)}
                />
              )}
            </li>
          );
        })}
      </ul>
      {limited && (
        <InternalButton
          className={styles.toggle}
          variant="link"
          formAction="none"
          ariaExpanded={expanded}
          ariaControls={listId}
          onClick={() => setExpanded(current => !current)}
        >
          {expanded ? showFewerText : showMoreText}
        </InternalButton>
      )}
    </div>
  );
}

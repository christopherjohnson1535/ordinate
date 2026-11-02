// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { getLogicalArrowStep } from '../internal/direction';
import { useInternalI18n } from '../internal/i18n/context';
import { getRovingIndex, RovingMove } from '../internal/roving-focus';
import { ButtonDropdownProps } from './interfaces';
import { getGroupKey, isCheckboxItem, isItemGroup } from './utils';

import styles from './styles.css.js';

const typeAheadResetMs = 500;
const itemSelector = '[data-menu-item]';

export interface MenuProps {
  id: string;
  ariaLabelledby?: string;
  items: ButtonDropdownProps.Items;
  expandableGroups: boolean;
  /**
   * Called when the user chooses an enabled item.
   */
  onItemActivate: (item: ButtonDropdownProps.Item, event: React.MouseEvent) => void;
  /**
   * Called when the user presses Escape or Tab. The host closes the menu and returns focus to its trigger.
   */
  onDismiss: () => void;
  /**
   * Called when Space chooses an item, so the host can ignore the matching keyup on its trigger.
   */
  onSpaceActivate: () => void;
}

function getVerticalMove(key: string): RovingMove | null {
  switch (key) {
    case 'ArrowDown':
      return 'next';
    case 'ArrowUp':
      return 'previous';
    case 'Home':
      return 'first';
    case 'End':
      return 'last';
  }
  return null;
}

function isTypeAheadKey(event: React.KeyboardEvent) {
  return event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey;
}

/**
 * The list of a menu button, with focus moving between its items. Expanded groups
 * live here, so they collapse again each time the menu closes.
 */
export const Menu = React.forwardRef(
  (
    { id, ariaLabelledby, items, expandableGroups, onItemActivate, onDismiss, onSpaceActivate }: MenuProps,
    ref: React.Ref<HTMLUListElement>
  ) => {
    const i18n = useInternalI18n('button-dropdown');
    const baseId = useId();
    const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
    const afterRender = useRef<(() => void) | null>(null);
    const typeAhead = useRef({ text: '', timer: undefined as ReturnType<typeof setTimeout> | undefined });

    useEffect(() => {
      afterRender.current?.();
      afterRender.current = null;
    });

    useEffect(() => () => clearTimeout(typeAhead.current.timer), []);

    const setGroupExpanded = (key: string, open: boolean) =>
      setExpanded(current => {
        const next = new Set(current);
        if (open) {
          next.add(key);
        } else {
          next.delete(key);
        }
        return next;
      });

    const getItemElements = (list: HTMLElement) => Array.from(list.querySelectorAll<HTMLElement>(itemSelector));

    const findByTypeAhead = (elements: HTMLElement[], current: number, character: string) => {
      const state = typeAhead.current;
      clearTimeout(state.timer);
      state.text += character.toLowerCase();
      state.timer = setTimeout(() => (state.text = ''), typeAheadResetMs);
      const cycling = state.text.split('').every(letter => letter === state.text[0]);
      const search = cycling ? state.text[0] : state.text;
      const start = cycling ? current + 1 : Math.max(current, 0);
      for (let offset = 0; offset < elements.length; offset++) {
        const element = elements[(start + offset) % elements.length];
        if (element.dataset.text?.toLowerCase().startsWith(search)) {
          return element;
        }
      }
      return null;
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
      const list = event.currentTarget;
      const elements = getItemElements(list);
      const target = (event.target as HTMLElement).closest<HTMLElement>(itemSelector);
      const current = target ? elements.indexOf(target) : -1;

      const move = getVerticalMove(event.key);
      if (move) {
        event.preventDefault();
        elements[getRovingIndex(move, current, elements.length)]?.focus();
        return;
      }

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (event.key === ' ') {
            onSpaceActivate();
          }
          target?.click();
          return;
        case 'Escape':
          // Stops a surrounding modal from closing too.
          event.preventDefault();
          event.stopPropagation();
          onDismiss();
          return;
        case 'Tab':
          onDismiss();
          return;
      }

      const step = getLogicalArrowStep(event.key, list);
      if (step !== 0 && target) {
        event.preventDefault();
        const groupKey = target.dataset.groupKey;
        const isExpanded = target.getAttribute('aria-expanded') === 'true';
        if (step === 1 && groupKey && !isExpanded && target.getAttribute('aria-disabled') !== 'true') {
          setGroupExpanded(groupKey, true);
          afterRender.current = () => getItemElements(list)[current + 1]?.focus();
        } else if (step === -1 && groupKey && isExpanded) {
          setGroupExpanded(groupKey, false);
        } else if (step === -1) {
          const parent = target.closest<HTMLElement>('[data-parent-key]');
          const parentKey = parent?.dataset.parentKey;
          if (parentKey) {
            const parentItem = parent?.parentElement?.querySelector<HTMLElement>(itemSelector);
            setGroupExpanded(parentKey, false);
            parentItem?.focus();
          }
        }
        return;
      }

      if (isTypeAheadKey(event)) {
        event.preventDefault();
        findByTypeAhead(elements, current, event.key)?.focus();
      }
    };

    const focusOnHover = (event: React.MouseEvent<HTMLElement>) => {
      if (document.activeElement !== event.currentTarget) {
        event.currentTarget.focus();
      }
    };

    const renderItem = (item: ButtonDropdownProps.Item, key: string, depth: number, parentDisabled: boolean) => {
      const disabled = parentDisabled || Boolean(item.disabled);
      const checkbox = isCheckboxItem(item);
      const link = item.href !== undefined && !disabled;
      const reasonId = `${baseId}reason-${key}`;
      const showReason = disabled && Boolean(item.disabledReason);
      const commonProps = {
        role: checkbox ? 'menuitemcheckbox' : 'menuitem',
        tabIndex: -1,
        className: clsx(styles.item, styles[`depth-${Math.min(depth, 2)}`], disabled && styles['item-disabled']),
        'data-menu-item': '',
        'data-item-id': item.id,
        'data-text': item.text,
        'aria-checked': checkbox ? Boolean(item.checked) : undefined,
        'aria-disabled': disabled ? true : undefined,
        'aria-describedby': showReason ? reasonId : undefined,
        onMouseMove: focusOnHover,
        onClick: (event: React.MouseEvent) => {
          if (disabled) {
            event.preventDefault();
            return;
          }
          onItemActivate(item, event);
        },
      };
      const content = (
        <>
          {checkbox && (
            <span className={styles.check}>
              {item.checked && <InternalIcon name="check" variant={disabled ? 'disabled' : 'normal'} />}
            </span>
          )}
          {item.iconName && (
            <InternalIcon className={styles.icon} name={item.iconName} variant={disabled ? 'disabled' : 'normal'} />
          )}
          <span className={styles['item-content']}>
            <span className={styles['item-text']} lang={item.lang}>
              {item.text}
            </span>
            {item.description && <span className={styles.description}>{item.description}</span>}
            {showReason && (
              <span id={reasonId} className={styles['disabled-reason']} aria-hidden="true">
                {item.disabledReason}
              </span>
            )}
          </span>
          {item.secondaryText && <span className={styles['secondary-text']}>{item.secondaryText}</span>}
          {/* Separates the icon's label from the text in the accessible name. Flex layout drops it visually. */}
          {item.external && ' '}
          {item.external && (
            <InternalIcon
              className={styles['external-icon']}
              name="open-outside"
              variant={disabled ? 'disabled' : 'normal'}
              ariaLabel={i18n('externalIconAriaLabel', item.externalIconAriaLabel)}
            />
          )}
        </>
      );
      return (
        <li key={key} role="none" className={styles['item-row']}>
          {link ? (
            <a
              {...commonProps}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
            >
              {content}
            </a>
          ) : (
            <div {...commonProps}>{content}</div>
          )}
        </li>
      );
    };

    const renderGroup = (
      group: ButtonDropdownProps.ItemGroup,
      path: string,
      depth: number,
      parentDisabled: boolean
    ): React.ReactNode => {
      const disabled = parentDisabled || Boolean(group.disabled);
      const key = getGroupKey(group, path);

      if (!expandableGroups) {
        return (
          <li key={key} role="none" className={styles.group}>
            <span className={clsx(styles['group-label'], disabled && styles['item-disabled'])} aria-hidden="true">
              {group.iconName && <InternalIcon className={styles.icon} name={group.iconName} />}
              {group.text}
            </span>
            <ul role="group" aria-label={group.text} className={styles['sub-list']}>
              {renderEntries(group.items, path, depth, disabled)}
            </ul>
          </li>
        );
      }

      const isExpanded = expanded.has(key) && !disabled;
      return (
        <li key={key} role="none" className={styles['expandable-group']}>
          <div
            role="menuitem"
            tabIndex={-1}
            className={clsx(
              styles.item,
              styles['expandable-trigger'],
              styles[`depth-${Math.min(depth, 2)}`],
              isExpanded && styles.expanded,
              disabled && styles['item-disabled']
            )}
            data-menu-item=""
            data-group-key={key}
            data-text={group.text}
            aria-expanded={isExpanded}
            aria-disabled={disabled ? true : undefined}
            onMouseMove={focusOnHover}
            onClick={() => !disabled && setGroupExpanded(key, !isExpanded)}
          >
            {group.iconName && (
              <InternalIcon className={styles.icon} name={group.iconName} variant={disabled ? 'disabled' : 'normal'} />
            )}
            <span className={styles['item-content']}>
              <span className={styles['item-text']}>{group.text}</span>
            </span>
            <InternalIcon className={styles['expand-icon']} name="chevron-down" />
          </div>
          {isExpanded && (
            <ul role="group" aria-label={group.text} className={styles['sub-list']} data-parent-key={key}>
              {renderEntries(group.items, path, depth + 1, disabled)}
            </ul>
          )}
        </li>
      );
    };

    const renderEntries = (
      entries: ButtonDropdownProps.Items,
      parentPath: string,
      depth: number,
      parentDisabled: boolean
    ): React.ReactNode[] =>
      entries.map((entry, index) => {
        const path = parentPath ? `${parentPath}-${index}` : `${index}`;
        return isItemGroup(entry)
          ? renderGroup(entry, path, depth, parentDisabled)
          : renderItem(entry, path, depth, parentDisabled);
      });

    return (
      <ul
        ref={ref}
        id={id}
        role="menu"
        tabIndex={-1}
        className={styles.menu}
        aria-labelledby={ariaLabelledby}
        onKeyDown={handleKeyDown}
      >
        {renderEntries(items, '', 0, false)}
      </ul>
    );
  }
);

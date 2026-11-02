// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { Dropdown } from '../internal/components/dropdown';
import { Leader } from '../internal/components/leader';
import { fireCancelableEvent } from '../internal/events';
import { useResizeObserver } from '../internal/hooks/use-resize-observer';
import { useInternalI18n } from '../internal/i18n/context';
import { isPlainLeftClick } from '../internal/link-click';
import { BreadcrumbGroupProps } from './interfaces';
import { getHiddenCount } from './utils';

import styles from './styles.css.js';

// Each step leads to the next with a short leader, the mark for "goes somewhere else".
const separator = <Leader size="short" className={styles.separator} />;

export function InternalBreadcrumbGroup<T extends BreadcrumbGroupProps.Item>({
  items,
  ariaLabel,
  expandAriaLabel,
  onFollow,
  onClick,
  ...rest
}: BreadcrumbGroupProps<T>) {
  const i18n = useInternalI18n('breadcrumb-group');
  const menuId = useId();
  const navRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLOListElement>(null);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Items are measured at their natural width in a hidden copy of the list, so the
  // decision does not depend on what is currently collapsed.
  const collapse = () => {
    const nav = navRef.current;
    const measure = measureRef.current;
    if (!nav || !measure) {
      return;
    }
    const widths = Array.from(measure.children, child => child.getBoundingClientRect().width);
    const ellipsisWidth = widths.pop() ?? 0;
    setHiddenCount(getHiddenCount(widths, ellipsisWidth, nav.clientWidth));
  };
  useResizeObserver(navRef, collapse);
  // The hidden copy changes width when the items change.
  useResizeObserver(measureRef, collapse);

  useEffect(() => {
    if (menuOpen) {
      menuRef.current?.querySelector('a')?.focus();
    }
  }, [menuOpen]);

  const follow = (item: T, event: React.MouseEvent) => {
    const detail = { item, text: item.text, href: item.href };
    fireCancelableEvent(onClick, detail, event);
    if (isPlainLeftClick(event)) {
      fireCancelableEvent(onFollow, detail, event);
    }
  };

  const menuLinks = () => Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? []);

  const closeMenuAndRestoreFocus = () => {
    setMenuOpen(false);
    expandButtonRef.current?.focus();
  };

  const onMenuKeyDown = (event: React.KeyboardEvent) => {
    const links = menuLinks();
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenuAndRestoreFocus();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      links[(index + step + links.length) % links.length]?.focus();
    }
  };

  const lastIndex = items.length - 1;
  const hidden = items.slice(1, 1 + hiddenCount);

  const renderItem = (item: T, index: number) =>
    index === lastIndex ? (
      <li key={index} className={clsx(styles.item, styles['current-item'])}>
        <span className={styles.current} aria-current="page">
          {item.text}
        </span>
      </li>
    ) : (
      <li key={index} className={styles.item}>
        <a className={styles.link} href={item.href} onClick={event => follow(item, event)}>
          {item.text}
        </a>
        {separator}
      </li>
    );

  const ellipsis = hiddenCount > 0 && (
    <li
      key="ellipsis"
      className={clsx(styles.item, styles['ellipsis-item'])}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setMenuOpen(false);
        }
      }}
    >
      <Dropdown
        className={styles.dropdown}
        open={menuOpen}
        onOutsideClick={() => setMenuOpen(false)}
        trigger={
          <button
            ref={expandButtonRef}
            type="button"
            className={styles['expand-button']}
            aria-label={i18n('expandAriaLabel', expandAriaLabel)}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? menuId : undefined}
            onClick={() => setMenuOpen(!menuOpen)}
            onKeyDown={event => {
              if (event.key === 'ArrowDown' && !menuOpen) {
                event.preventDefault();
                setMenuOpen(true);
              }
            }}
          >
            <InternalIcon name="more" />
          </button>
        }
      >
        <ul ref={menuRef} id={menuId} className={styles.menu} onKeyDown={onMenuKeyDown}>
          {hidden.map((item, index) => (
            <li key={index}>
              <a
                className={styles['menu-link']}
                href={item.href}
                onClick={event => {
                  follow(item, event);
                  setMenuOpen(false);
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </Dropdown>
      {separator}
    </li>
  );

  return (
    <nav {...rest} ref={navRef} className={styles.root} aria-label={i18n('ariaLabel', ariaLabel)}>
      <ol className={styles.list}>
        {items.slice(0, 1).map(renderItem)}
        {ellipsis}
        {items.slice(1 + hiddenCount).map((item, offset) => renderItem(item, 1 + hiddenCount + offset))}
      </ol>
      <div className={styles.measure} aria-hidden="true">
        <ol ref={measureRef} className={clsx(styles.list, styles['measure-list'])}>
          {items.map((item, index) => (
            <li key={index} className={clsx(styles.item, index === lastIndex && styles['current-item'])}>
              <span className={index === lastIndex ? styles.current : styles.link}>{item.text}</span>
              {index !== lastIndex && separator}
            </li>
          ))}
          <li className={styles.item}>
            <span className={styles['expand-button']}>
              <InternalIcon name="more" />
            </span>
            {separator}
          </li>
        </ol>
      </div>
    </nav>
  );
}

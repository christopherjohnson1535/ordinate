// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useImperativeHandle, useRef } from 'react';

import { useBrowserLayoutEffect } from '../internal/hooks/use-browser-layout-effect';
import { getRovingIndex } from '../internal/roving-focus';
import { NavigableGroupProps } from './interfaces';
import { getGroupItems, getGroupMove, groupAttribute, isTextEntry } from './utils';

import styles from './styles.css.js';

export const InternalNavigableGroup = React.forwardRef(
  (
    {
      children,
      navigationDirection,
      getItemKey,
      loopFocus = false,
      ariaLabel,
      role = 'group',
      ...rest
    }: NavigableGroupProps,
    ref: React.Ref<NavigableGroupProps.Ref>
  ) => {
    const rootRef = useRef<HTMLDivElement>(null);
    // The key of the item that keeps the tab stop. Only the DOM needs it, so it is not state.
    const activeKey = useRef<string | null>(null);
    const getItemKeyRef = useRef(getItemKey);

    // These read only refs, so the mutation observer created once below can keep calling them.
    const getItems = () => (rootRef.current ? getGroupItems(rootRef.current) : []);
    const getTabStop = (items: HTMLElement[]): HTMLElement | undefined =>
      items.find(item => getItemKeyRef.current(item) === activeKey.current) ?? items[0];
    const applyTabStops = () => {
      const items = getItems();
      const tabStop = getTabStop(items);
      for (const item of items) {
        const tabIndex = item === tabStop ? 0 : -1;
        // Writing only on change keeps the mutation observer from reacting to its own writes forever.
        if (item.getAttribute('tabindex') !== String(tabIndex)) {
          item.tabIndex = tabIndex;
        }
      }
    };

    useImperativeHandle(ref, () => ({
      focus: () => getTabStop(getItems())?.focus(),
    }));

    useBrowserLayoutEffect(() => {
      getItemKeyRef.current = getItemKey;
      applyTabStops();
    });

    // Children can add, remove or disable items without the group rendering again.
    useEffect(() => {
      const root = rootRef.current;
      if (!root || typeof MutationObserver === 'undefined') {
        return;
      }
      const observer = new MutationObserver(applyTabStops);
      observer.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'hidden', 'inert', 'href', 'tabindex'],
      });
      return () => observer.disconnect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (getItems().includes(target)) {
        activeKey.current = getItemKeyRef.current(target);
        applyTabStops();
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      // A nested group or an open menu may already have used the key.
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }
      const target = event.target as HTMLElement;
      const items = getItems();
      const index = items.indexOf(target);
      if (index < 0 || isTextEntry(target)) {
        return;
      }
      const move = getGroupMove(event.key, navigationDirection, event.currentTarget);
      if (!move) {
        return;
      }
      event.preventDefault();
      const next = getRovingIndex(move, index, items.length);
      const wrapped = (move === 'next' && next < index) || (move === 'previous' && next > index);
      if (next >= 0 && (loopFocus || !wrapped)) {
        items[next].focus();
      }
    };

    return (
      <div
        {...rest}
        {...{ [groupAttribute]: '' }}
        ref={rootRef}
        role={role}
        aria-label={ariaLabel}
        className={styles.root}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    );
  }
);

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { getLogicalArrowStep } from '../internal/direction';
import { getRovingIndex, RovingMove } from '../internal/roving-focus';
import { ButtonGroupProps } from './interfaces';
import { ActionItem, itemAttribute, MenuItem } from './items';

import styles from './styles.css.js';

function getMove(event: React.KeyboardEvent): RovingMove | null {
  switch (event.key) {
    case 'Home':
      return 'first';
    case 'End':
      return 'last';
  }
  const step = getLogicalArrowStep(event.key, event.currentTarget);
  if (step === 0) {
    return null;
  }
  return step === 1 ? 'next' : 'previous';
}

function flattenItems(items: ReadonlyArray<ButtonGroupProps.ItemOrGroup>): ButtonGroupProps.Item[] {
  return items.flatMap(entry => (entry.type === 'group' ? entry.items : [entry]));
}

function getFocusTarget(control: Element) {
  return control.querySelector<HTMLButtonElement>('button');
}

export const InternalButtonGroup = React.forwardRef(
  (
    { items, onItemClick, variant = 'icon', ariaLabel, ...rest }: ButtonGroupProps,
    ref: React.Ref<ButtonGroupProps.Ref>
  ) => {
    const rootRef = useRef<HTMLDivElement>(null);
    // The action that keeps the tab stop after the user moves through the toolbar.
    const [focusedId, setFocusedId] = useState<string | null>(null);

    const actions = flattenItems(items);
    const canFocus = (index: number) => !actions[index]?.disabled;
    const focusedIndex = actions.findIndex(action => action.id === focusedId);
    const tabStopIndex =
      focusedIndex >= 0 && canFocus(focusedIndex)
        ? focusedIndex
        : getRovingIndex('first', -1, actions.length, canFocus);
    const tabStopId = actions[tabStopIndex]?.id;

    const getControls = () => Array.from(rootRef.current?.querySelectorAll<HTMLElement>(`[${itemAttribute}]`) ?? []);

    useImperativeHandle(ref, () => ({
      focus: (itemId: string) => {
        const control = getControls().find(element => element.getAttribute(itemAttribute) === itemId);
        if (control) {
          getFocusTarget(control)?.focus();
        }
      },
    }));

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      // Keys pressed in an open menu belong to the menu, even though they bubble through here.
      const control = (event.target as Element).closest(`[${itemAttribute}]`);
      const move = getMove(event);
      if (!control || !event.currentTarget.contains(control) || !move) {
        return;
      }
      event.preventDefault();
      const controls = getControls();
      const next = getRovingIndex(move, controls.indexOf(control as HTMLElement), controls.length, index => {
        const target = getFocusTarget(controls[index]);
        return target !== null && !target.disabled;
      });
      if (next >= 0) {
        getFocusTarget(controls[next])?.focus();
      }
    };

    const renderItem = (item: ButtonGroupProps.Item) => {
      const props = {
        tabIndex: item.id === tabStopId ? 0 : -1,
        onItemClick,
        onItemFocus: setFocusedId,
      };
      return item.type === 'menu-dropdown' ? (
        <MenuItem key={item.id} item={item} {...props} />
      ) : (
        <ActionItem key={item.id} item={item} {...props} />
      );
    };

    return (
      <div
        {...rest}
        ref={rootRef}
        role="toolbar"
        aria-label={ariaLabel}
        className={clsx(styles.root, styles[`variant-${variant}`])}
        onKeyDown={handleKeyDown}
      >
        {items.map((entry, index) => {
          const previous = items[index - 1];
          const separated = previous !== undefined && (entry.type === 'group' || previous.type === 'group');
          const key = entry.type === 'group' ? `group-${index}` : entry.id;
          return (
            <React.Fragment key={key}>
              {separated && <span className={styles.divider} aria-hidden="true" />}
              {entry.type === 'group' ? (
                <div role="group" aria-label={entry.text} className={styles.group}>
                  {entry.items.map(renderItem)}
                </div>
              ) : (
                renderItem(entry)
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

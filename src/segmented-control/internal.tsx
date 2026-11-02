// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { SlidingMarker, useSlidingMarker } from '../internal/components/sliding-marker';
import { getLogicalArrowStep } from '../internal/direction';
import { fireNonCancelableEvent } from '../internal/events';
import { warnOnce } from '../internal/logging';
import { getRovingIndex, RovingMove } from '../internal/roving-focus';
import { SegmentedControlProps } from './interfaces';

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

export const InternalSegmentedControl = React.forwardRef(
  (
    { options = [], selectedId, onChange, label, ariaLabelledby, ...rest }: SegmentedControlProps,
    ref: React.Ref<SegmentedControlProps.Ref>
  ) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    // The segment that keeps the tab stop after the user moves through the group with arrow keys.
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const canFocus = (index: number) => !options[index]?.disabled;
    const selectedIndex = options.findIndex(option => option.id === selectedId);
    const tabStopIndex = [focusedIndex, selectedIndex].find(index => index >= 0 && canFocus(index)) ?? -1;
    const fallbackIndex = getRovingIndex('first', -1, options.length, canFocus);
    const tabbableIndex = tabStopIndex >= 0 ? tabStopIndex : fallbackIndex;
    const marker = useSlidingMarker(rootRef, () => {
      const button = buttonRefs.current[selectedIndex];
      return button ? [button] : [];
    });

    useImperativeHandle(ref, () => ({
      focus: () => {
        const index = selectedIndex >= 0 && canFocus(selectedIndex) ? selectedIndex : fallbackIndex;
        buttonRefs.current[index]?.focus();
      },
    }));

    const handleKeyDown = (event: React.KeyboardEvent) => {
      const move = getMove(event);
      if (!move) {
        return;
      }
      event.preventDefault();
      const current = buttonRefs.current.findIndex(button => button === document.activeElement);
      const next = getRovingIndex(move, current, options.length, canFocus);
      if (next >= 0) {
        setFocusedIndex(next);
        buttonRefs.current[next]?.focus();
      }
    };

    const choose = (option: SegmentedControlProps.Option) => {
      if (option.id !== selectedId) {
        fireNonCancelableEvent(onChange, { selectedId: option.id });
      }
    };

    return (
      <div
        {...rest}
        ref={rootRef}
        role="group"
        className={styles.root}
        aria-label={ariaLabelledby ? undefined : label}
        aria-labelledby={ariaLabelledby}
        onKeyDown={handleKeyDown}
        onBlur={event => {
          // Tabbing back into the group lands on the selected segment again.
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setFocusedIndex(-1);
          }
        }}
      >
        {options.map((option, index) => {
          const selected = index === selectedIndex;
          if (!option.text && !option.iconAlt) {
            warnOnce('SegmentedControl', `The segment "${option.id}" needs \`text\` or \`iconAlt\`.`);
          }
          return (
            <button
              key={option.id}
              ref={button => {
                buttonRefs.current[index] = button;
              }}
              type="button"
              className={clsx(
                styles.segment,
                selected && styles.selected,
                option.disabled && styles.disabled,
                !option.text && styles['icon-only']
              )}
              disabled={option.disabled}
              tabIndex={index === tabbableIndex ? 0 : -1}
              aria-pressed={selected}
              aria-label={option.text ? undefined : option.iconAlt}
              data-segment-id={option.id}
              onFocus={() => setFocusedIndex(index)}
              onClick={() => choose(option)}
            >
              {option.iconName && <InternalIcon className={styles.icon} name={option.iconName} />}
              {option.text && <span className={styles.text}>{option.text}</span>}
            </button>
          );
        })}
        <SlidingMarker position={marker.position} placed={marker.placed} />
      </div>
    );
  }
);

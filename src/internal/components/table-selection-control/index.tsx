// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { InternalCheckbox } from '../../../checkbox/internal';
import { InternalRadioButton } from '../../../radio-button/internal';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../../events';

import styles from './styles.css.js';

export type TableSelectionType = 'single' | 'multi';

export interface TableSelectionChangeDetail {
  selected: boolean;
  /**
   * Whether Shift was held, which asks for every row between this one and the last one changed
   * to follow.
   */
  shiftKey: boolean;
}

export interface TableSelectionControlProps {
  type: TableSelectionType;
  selected: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  name?: string;
  ariaLabel?: string;
  onChange?: NonCancelableEventHandler<TableSelectionChangeDetail>;
}

/**
 * The checkbox or radio button of a selection cell. Clicks on the padding around the control count
 * too, so the whole cell is a target, and Shift is passed on for range selection.
 */
export function TableSelectionControl({
  type,
  selected,
  indeterminate = false,
  disabled = false,
  name,
  ariaLabel,
  onChange,
}: TableSelectionControlProps) {
  const shiftKeyRef = useRef(false);
  const fire = (nextSelected: boolean) =>
    fireNonCancelableEvent(onChange, { selected: nextSelected, shiftKey: shiftKeyRef.current });

  const handleClickCapture = (event: React.MouseEvent) => {
    // A click made with the keyboard (Space) reports no modifiers, so keep the state seen on keydown.
    const fromKeyboard = event.detail === 0;
    shiftKeyRef.current = event.shiftKey || (fromKeyboard && shiftKeyRef.current);
  };

  const handleAreaClick = (event: React.MouseEvent) => {
    if (!disabled && !(event.target instanceof HTMLInputElement)) {
      shiftKeyRef.current = event.shiftKey;
      fire(type === 'single' ? true : indeterminate || !selected);
    }
  };

  return (
    <span
      className={styles.root}
      onClickCapture={handleClickCapture}
      onClick={handleAreaClick}
      onKeyDownCapture={event => (shiftKeyRef.current = event.shiftKey)}
    >
      {type === 'multi' ? (
        <InternalCheckbox
          checked={selected}
          indeterminate={indeterminate}
          disabled={disabled}
          ariaLabel={ariaLabel}
          onChange={event => fire(event.detail.checked)}
        />
      ) : (
        <InternalRadioButton
          checked={selected}
          name={name ?? ''}
          disabled={disabled}
          ariaLabel={ariaLabel}
          onSelect={() => fire(true)}
        />
      )}
    </span>
  );
}

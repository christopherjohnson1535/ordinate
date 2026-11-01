// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { FormFieldContext, useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { warnOnce } from '../internal/logging';
import { RadioButtonProps } from '../radio-button/interfaces';
import { InternalRadioButton } from '../radio-button/internal';
import { TilesProps } from './interfaces';

import styles from './styles.css.js';

const maxColumns = 4;

function getDefaultColumns(count: number): number {
  if (count === 4) {
    return 2;
  }
  return Math.min(Math.max(count, 1), 3);
}

function getColumns(columns: number | undefined, count: number): number {
  if (columns === undefined) {
    return getDefaultColumns(count);
  }
  if (!Number.isInteger(columns) || columns < 1 || columns > maxColumns) {
    warnOnce('Tiles', `\`columns\` must be a whole number from 1 to ${maxColumns}.`);
    return Math.min(Math.max(Math.round(columns) || 1, 1), maxColumns);
  }
  return columns;
}

export const InternalTiles = React.forwardRef(
  (
    {
      value,
      items = [],
      onChange,
      columns,
      name,
      readOnly = false,
      ariaLabel,
      ariaRequired,
      ariaControls,
      ariaLabelledby,
      ariaDescribedby,
      ...rest
    }: TilesProps,
    ref: React.Ref<TilesProps.Ref>
  ) => {
    const generatedName = useId();
    const groupName = name ?? `ord-tiles-${generatedName}`;
    const field = useFormFieldContext({ ariaLabelledby, ariaDescribedby });

    const buttonRefs = useRef<(RadioButtonProps.Ref | null)[]>([]);
    const focusableIndex = () => {
      const selected = items.findIndex(item => item.value === value && !item.disabled);
      return selected !== -1 ? selected : items.findIndex(item => !item.disabled);
    };
    useImperativeHandle(ref, () => ({ focus: () => buttonRefs.current[focusableIndex()]?.focus() }));

    const select = (item: TilesProps.Item) => {
      if (!item.disabled && !readOnly && item.value !== value) {
        fireNonCancelableEvent(onChange, { value: item.value });
      }
    };

    // The whole tile is a target for the pointer. Clicks on the radio button or its label already select
    // the tile through the native input, so only clicks elsewhere on the tile are handled here.
    const handleTileClick = (event: React.MouseEvent, item: TilesProps.Item, index: number) => {
      if ((event.target as Element).closest('input, label') || item.disabled) {
        return;
      }
      buttonRefs.current[index]?.focus();
      select(item);
    };

    return (
      <div
        {...rest}
        role="radiogroup"
        className={styles.root}
        aria-label={ariaLabel}
        aria-labelledby={field.ariaLabelledby}
        aria-describedby={field.ariaDescribedby}
        aria-required={ariaRequired ? 'true' : undefined}
        aria-controls={ariaControls}
        aria-readonly={readOnly ? 'true' : undefined}
      >
        <div className={clsx(styles.grid, styles[`columns-${getColumns(columns, items.length)}`])}>
          {/* The field labels the group. Its control ID and label must not reach every radio button. */}
          <FormFieldContext.Provider value={{}}>
            {items.map((item, index) => (
              <div
                key={item.value}
                className={clsx(
                  styles.tile,
                  item.value === value && styles.selected,
                  item.disabled && styles.disabled,
                  readOnly && styles['read-only']
                )}
                onClick={event => handleTileClick(event, item, index)}
              >
                <InternalRadioButton
                  ref={button => {
                    buttonRefs.current[index] = button;
                  }}
                  name={groupName}
                  value={item.value}
                  checked={item.value === value}
                  description={item.description}
                  disabled={item.disabled}
                  readOnly={readOnly}
                  controlId={item.controlId}
                  onSelect={() => select(item)}
                >
                  {item.label}
                </InternalRadioButton>
                {item.image && <div className={styles.image}>{item.image}</div>}
              </div>
            ))}
          </FormFieldContext.Provider>
        </div>
      </div>
    );
  }
);

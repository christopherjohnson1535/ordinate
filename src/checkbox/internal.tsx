// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { AbstractSwitch } from '../internal/components/abstract-switch';
import { useChoiceControlFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { CheckboxProps } from './interfaces';

import styles from './styles.css.js';

export const InternalCheckbox = React.forwardRef(
  (
    {
      checked,
      indeterminate = false,
      onChange,
      children,
      description,
      disabled = false,
      readOnly = false,
      name,
      ariaLabel,
      ariaRequired,
      ariaControls,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      ...rest
    }: CheckboxProps,
    ref: React.Ref<CheckboxProps.Ref>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }));

    const field = useChoiceControlFieldContext({ controlId, ariaLabelledby, ariaDescribedby });
    const isReadOnly = readOnly && !disabled;

    // `indeterminate` exists only as a DOM property, with no HTML attribute for React to render.
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // React puts `checked` back to the controlled value after the click, but not `indeterminate`.
      event.target.indeterminate = indeterminate;
      if (!disabled && !readOnly) {
        fireNonCancelableEvent(onChange, { checked: indeterminate ? true : !checked, indeterminate: false });
      }
    };

    const state = indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked';

    return (
      <AbstractSwitch
        {...rest}
        className={clsx(styles.root, isReadOnly && styles['read-only'])}
        controlId={field.controlId}
        label={children}
        description={description}
        disabled={disabled}
        ariaLabelledby={field.ariaLabelledby}
        ariaDescribedby={field.ariaDescribedby}
        nativeControl={attributes => (
          <input
            {...attributes}
            ref={inputRef}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            name={name}
            aria-label={ariaLabel}
            aria-required={ariaRequired ? 'true' : undefined}
            aria-controls={ariaControls}
            aria-readonly={isReadOnly ? 'true' : undefined}
            onChange={handleChange}
            onFocus={() => fireNonCancelableEvent(onFocus, null)}
            onBlur={() => fireNonCancelableEvent(onBlur, null)}
          />
        )}
        styledControl={
          <span className={clsx(styles.box, styles[`box-${state}`])}>
            {state === 'checked' && <InternalIcon name="check" size="small" />}
          </span>
        }
      />
    );
  }
);

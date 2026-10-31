// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { AbstractSwitch } from '../internal/components/abstract-switch';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { RadioButtonProps } from './interfaces';

import styles from './styles.css.js';

export const InternalRadioButton = React.forwardRef(
  (
    {
      checked,
      name,
      value,
      onSelect,
      children,
      description,
      disabled = false,
      readOnly = false,
      ariaLabel,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      ...rest
    }: RadioButtonProps,
    ref: React.Ref<RadioButtonProps.Ref>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }));

    const field = useFormFieldContext({ controlId, ariaLabelledby, ariaDescribedby });
    const isReadOnly = readOnly && !disabled;

    const handleChange = () => {
      if (!disabled && !readOnly) {
        fireNonCancelableEvent(onSelect, null);
      }
    };

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
            type="radio"
            name={name}
            value={value}
            checked={checked}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-disabled={isReadOnly ? 'true' : undefined}
            onChange={handleChange}
          />
        )}
        styledControl={<span className={clsx(styles.circle, checked && styles.checked)} />}
      />
    );
  }
);

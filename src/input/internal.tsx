// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { InputProps } from './interfaces';

import styles from './styles.css.js';

function toAutoCompleteValue(autoComplete: boolean | string): string {
  if (typeof autoComplete === 'string') {
    return autoComplete;
  }
  return autoComplete ? 'on' : 'off';
}

export const InternalInput = React.forwardRef(
  (
    {
      value,
      onChange,
      type = 'text',
      placeholder,
      disabled = false,
      readOnly = false,
      ariaLabel,
      ariaRequired,
      name,
      autoComplete = true,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      ...rest
    }: InputProps,
    ref: React.Ref<InputProps.Ref>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      select: () => inputRef.current?.select(),
    }));

    const field = useFormFieldContext({ controlId, ariaLabelledby, ariaDescribedby, invalid });

    return (
      <div {...rest} className={styles.root}>
        <input
          ref={inputRef}
          id={field.controlId}
          className={clsx(styles.input, field.invalid && styles.invalid)}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          name={name}
          autoComplete={toAutoCompleteValue(autoComplete)}
          aria-label={ariaLabel}
          aria-labelledby={field.ariaLabelledby}
          aria-describedby={field.ariaDescribedby}
          aria-invalid={field.invalid ? 'true' : undefined}
          aria-required={ariaRequired ? 'true' : undefined}
          onChange={event => fireNonCancelableEvent(onChange, { value: event.target.value })}
          onFocus={() => fireNonCancelableEvent(onFocus, null)}
          onBlur={() => fireNonCancelableEvent(onBlur, null)}
        />
      </div>
    );
  }
);

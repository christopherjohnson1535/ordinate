// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { AbstractSwitch } from '../internal/components/abstract-switch';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { ToggleProps } from './interfaces';

import styles from './styles.css.js';

export const InternalToggle = React.forwardRef(
  (
    {
      checked,
      onChange,
      children,
      description,
      disabled = false,
      readOnly = false,
      name,
      ariaLabel,
      ariaControls,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      ...rest
    }: ToggleProps,
    ref: React.Ref<ToggleProps.Ref>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }));

    const field = useFormFieldContext({ controlId, ariaLabelledby, ariaDescribedby });
    const isReadOnly = readOnly && !disabled;

    const handleChange = () => {
      if (!disabled && !readOnly) {
        fireNonCancelableEvent(onChange, { checked: !checked });
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
            type="checkbox"
            role="switch"
            checked={checked}
            disabled={disabled}
            name={name}
            aria-label={ariaLabel}
            aria-controls={ariaControls}
            aria-readonly={isReadOnly ? 'true' : undefined}
            onChange={handleChange}
            onFocus={() => fireNonCancelableEvent(onFocus, null)}
            onBlur={() => fireNonCancelableEvent(onBlur, null)}
          />
        )}
        styledControl={
          <span className={clsx(styles.track, checked && styles.checked)}>
            <span className={styles.thumb} />
          </span>
        }
      />
    );
  }
);

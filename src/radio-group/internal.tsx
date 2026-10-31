// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { FormFieldContext, useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { RadioButtonProps } from '../radio-button/interfaces';
import { InternalRadioButton } from '../radio-button/internal';
import { RadioGroupProps } from './interfaces';

import styles from './styles.css.js';

export const InternalRadioGroup = React.forwardRef(
  (
    {
      value,
      items = [],
      onChange,
      name,
      readOnly = false,
      direction = 'vertical',
      ariaLabel,
      ariaRequired,
      ariaControls,
      ariaLabelledby,
      ariaDescribedby,
      ...rest
    }: RadioGroupProps,
    ref: React.Ref<RadioGroupProps.Ref>
  ) => {
    const generatedName = useId();
    const groupName = name ?? `ord-radio-${generatedName}`;
    const field = useFormFieldContext({ ariaLabelledby, ariaDescribedby });

    const buttonRefs = useRef<(RadioButtonProps.Ref | null)[]>([]);
    useImperativeHandle(ref, () => ({
      focus: () => {
        const selected = items.findIndex(item => item.value === value && !item.disabled);
        const target = selected !== -1 ? selected : items.findIndex(item => !item.disabled);
        buttonRefs.current[target]?.focus();
      },
    }));

    return (
      <div
        {...rest}
        role="radiogroup"
        className={clsx(styles.root, styles[`direction-${direction}`])}
        aria-label={ariaLabel}
        aria-labelledby={field.ariaLabelledby}
        aria-describedby={field.ariaDescribedby}
        aria-required={ariaRequired ? 'true' : undefined}
        aria-controls={ariaControls}
        aria-readonly={readOnly ? 'true' : undefined}
      >
        {/* The field labels the group. Its control ID and label must not reach every radio button. */}
        <FormFieldContext.Provider value={{}}>
          {items.map((item, index) => (
            <InternalRadioButton
              key={item.value}
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
              onSelect={() => fireNonCancelableEvent(onChange, { value: item.value })}
            >
              {item.label}
            </InternalRadioButton>
          ))}
        </FormFieldContext.Provider>
      </div>
    );
  }
);

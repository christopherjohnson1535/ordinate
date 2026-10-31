// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { InputProps } from './interfaces';
import { InternalInput } from './internal';

export type { InputProps };

const Input = React.forwardRef(
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
      ...props
    }: InputProps,
    ref: React.Ref<InputProps.Ref>
  ) => (
    <InternalInput
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      ariaLabel={ariaLabel}
      ariaRequired={ariaRequired}
      name={name}
      autoComplete={autoComplete}
      onFocus={onFocus}
      onBlur={onBlur}
      controlId={controlId}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      invalid={invalid}
    />
  )
);

Input.displayName = 'Input';

export default Input;

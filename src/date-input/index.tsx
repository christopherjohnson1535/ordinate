// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { DateInputProps } from './interfaces';
import { InternalDateInput } from './internal';

export type { DateInputProps };

const DateInput = React.forwardRef(
  (
    {
      value,
      onChange,
      granularity = 'day',
      placeholder,
      disabled = false,
      readOnly = false,
      autoFocus = false,
      ariaLabel,
      ariaRequired,
      name,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      ...props
    }: DateInputProps,
    ref: React.Ref<DateInputProps.Ref>
  ) => (
    <InternalDateInput
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      onChange={onChange}
      granularity={granularity}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      autoFocus={autoFocus}
      ariaLabel={ariaLabel}
      ariaRequired={ariaRequired}
      name={name}
      onFocus={onFocus}
      onBlur={onBlur}
      controlId={controlId}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      invalid={invalid}
      warning={warning}
    />
  )
);

DateInput.displayName = 'DateInput';

export default DateInput;

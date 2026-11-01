// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TimeInputProps } from './interfaces';
import { InternalTimeInput } from './internal';

export type { TimeInputProps };

const TimeInput = React.forwardRef(
  (
    {
      value,
      onChange,
      format = 'hh:mm:ss',
      use24Hour = true,
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
    }: TimeInputProps,
    ref: React.Ref<TimeInputProps.Ref>
  ) => (
    <InternalTimeInput
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      onChange={onChange}
      format={format}
      use24Hour={use24Hour}
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

TimeInput.displayName = 'TimeInput';

export default TimeInput;

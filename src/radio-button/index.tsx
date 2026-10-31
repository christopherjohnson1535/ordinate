// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { RadioButtonProps } from './interfaces';
import { InternalRadioButton } from './internal';

export type { RadioButtonProps };

const RadioButton = React.forwardRef(
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
      ...props
    }: RadioButtonProps,
    ref: React.Ref<RadioButtonProps.Ref>
  ) => (
    <InternalRadioButton
      {...getBaseProps(props)}
      ref={ref}
      checked={checked}
      name={name}
      value={value}
      onSelect={onSelect}
      description={description}
      disabled={disabled}
      readOnly={readOnly}
      ariaLabel={ariaLabel}
      controlId={controlId}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
    >
      {children}
    </InternalRadioButton>
  )
);

RadioButton.displayName = 'RadioButton';

export default RadioButton;

// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { CheckboxProps } from './interfaces';
import { InternalCheckbox } from './internal';

export type { CheckboxProps };

const Checkbox = React.forwardRef(
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
      ...props
    }: CheckboxProps,
    ref: React.Ref<CheckboxProps.Ref>
  ) => (
    <InternalCheckbox
      {...getBaseProps(props)}
      ref={ref}
      checked={checked}
      indeterminate={indeterminate}
      onChange={onChange}
      description={description}
      disabled={disabled}
      readOnly={readOnly}
      name={name}
      ariaLabel={ariaLabel}
      ariaRequired={ariaRequired}
      ariaControls={ariaControls}
      onFocus={onFocus}
      onBlur={onBlur}
      controlId={controlId}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
    >
      {children}
    </InternalCheckbox>
  )
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;

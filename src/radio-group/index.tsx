// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { RadioGroupProps } from './interfaces';
import { InternalRadioGroup } from './internal';

export type { RadioGroupProps };

const RadioGroup = React.forwardRef(
  (
    {
      value,
      items,
      onChange,
      name,
      readOnly = false,
      direction = 'vertical',
      ariaLabel,
      ariaRequired,
      ariaControls,
      ariaLabelledby,
      ariaDescribedby,
      ...props
    }: RadioGroupProps,
    ref: React.Ref<RadioGroupProps.Ref>
  ) => (
    <InternalRadioGroup
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      items={items}
      onChange={onChange}
      name={name}
      readOnly={readOnly}
      direction={direction}
      ariaLabel={ariaLabel}
      ariaRequired={ariaRequired}
      ariaControls={ariaControls}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
    />
  )
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;

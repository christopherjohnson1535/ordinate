// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ToggleProps } from './interfaces';
import { InternalToggle } from './internal';

export type { ToggleProps };

const Toggle = React.forwardRef(
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
      ...props
    }: ToggleProps,
    ref: React.Ref<ToggleProps.Ref>
  ) => (
    <InternalToggle
      {...getBaseProps(props)}
      ref={ref}
      checked={checked}
      onChange={onChange}
      description={description}
      disabled={disabled}
      readOnly={readOnly}
      name={name}
      ariaLabel={ariaLabel}
      ariaControls={ariaControls}
      onFocus={onFocus}
      onBlur={onBlur}
      controlId={controlId}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
    >
      {children}
    </InternalToggle>
  )
);

Toggle.displayName = 'Toggle';

export default Toggle;

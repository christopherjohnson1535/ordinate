// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ToggleButtonProps } from './interfaces';
import { InternalToggleButton } from './internal';

export type { ToggleButtonProps };

const ToggleButton = React.forwardRef(
  (
    {
      pressed,
      onChange,
      children,
      variant = 'normal',
      iconName,
      pressedIconName,
      disabled = false,
      loading = false,
      loadingText,
      ariaLabel,
      ...props
    }: ToggleButtonProps,
    ref: React.Ref<ToggleButtonProps.Ref>
  ) => (
    <InternalToggleButton
      {...getBaseProps(props)}
      ref={ref}
      pressed={pressed}
      onChange={onChange}
      variant={variant}
      iconName={iconName}
      pressedIconName={pressedIconName}
      disabled={disabled}
      loading={loading}
      loadingText={loadingText}
      ariaLabel={ariaLabel}
    >
      {children}
    </InternalToggleButton>
  )
);

ToggleButton.displayName = 'ToggleButton';

export default ToggleButton;

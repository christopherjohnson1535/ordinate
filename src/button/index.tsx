// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ButtonProps } from './interfaces';
import { InternalButton } from './internal';

export type { ButtonProps };

const Button = React.forwardRef(
  (
    {
      children,
      variant = 'normal',
      disabled = false,
      href,
      formAction = 'submit',
      fullWidth = false,
      ariaLabel,
      iconSvg,
      onClick,
      ...props
    }: ButtonProps,
    ref: React.Ref<ButtonProps.Ref>
  ) => (
    <InternalButton
      {...getBaseProps(props)}
      ref={ref}
      variant={variant}
      disabled={disabled}
      href={href}
      formAction={formAction}
      fullWidth={fullWidth}
      ariaLabel={ariaLabel}
      iconSvg={iconSvg}
      onClick={onClick}
    >
      {children}
    </InternalButton>
  )
);

Button.displayName = 'Button';

export default Button;

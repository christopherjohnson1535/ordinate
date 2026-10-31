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
      loading = false,
      loadingText,
      iconName,
      iconAlign = 'left',
      iconSvg,
      wrapText = true,
      href,
      target,
      rel,
      external = false,
      externalIconAriaLabel = 'Opens in a new tab',
      download,
      formAction = 'submit',
      form,
      fullWidth = false,
      ariaLabel,
      ariaExpanded,
      ariaHaspopup,
      ariaControls,
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
      loading={loading}
      loadingText={loadingText}
      iconName={iconName}
      iconAlign={iconAlign}
      iconSvg={iconSvg}
      wrapText={wrapText}
      href={href}
      target={target}
      rel={rel}
      external={external}
      externalIconAriaLabel={externalIconAriaLabel}
      download={download}
      formAction={formAction}
      form={form}
      fullWidth={fullWidth}
      ariaLabel={ariaLabel}
      ariaExpanded={ariaExpanded}
      ariaHaspopup={ariaHaspopup}
      ariaControls={ariaControls}
      onClick={onClick}
    >
      {children}
    </InternalButton>
  )
);

Button.displayName = 'Button';

export default Button;
